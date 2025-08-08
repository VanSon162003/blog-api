const { where } = require("sequelize");
const { Post, Topic, User, Like, Comment, Tag } = require("../db/models");
const { Op, Sequelize } = require("sequelize");
const likesService = require("./likes.service");
const usersService = require("./users.service");
const { Json } = require("sequelize/lib/utils");
const topicsService = require("./topics.service");
const slugify = require("slugify");
const pusherService = require("./pusher.service");

class PostsService {
    canUserViewPost(post, currentUser, followingIds = []) {
        if (!currentUser) {
            return post.visibility === "public" || !post.visibility;
        }

        if (post.user_id === currentUser.id) {
            return true;
        }

        if (post.visibility === "public" || !post.visibility) {
            return true;
        }

        if (post.visibility === "followers") {
            return followingIds.includes(post.user_id);
        }

        if (post.visibility === "private") {
            return false;
        }

        return false;
    }

    async getAll(currentUser) {
        try {
            const posts = await Post.findAll({
                where: {
                    status: "published",
                    published_at: {
                        [Op.lte]: new Date(),
                    },
                },
                include: [
                    { model: Topic, as: "topics" },
                    {
                        model: User,
                        as: "user",
                        attributes: [
                            "id",
                            "avatar",
                            "username",
                            "fullname",
                            "first_name",
                            "last_name",
                        ],
                    },
                    {
                        model: User,
                        as: "usersBookmarked",
                        attributes: ["id"],
                    },
                ],
                order: [["created_at", "DESC"]],
            });

            const followingIds = await usersService.getUserFollowingIds(
                currentUser
            );

            const postVisible = posts.filter((post) =>
                this.canUserViewPost(post, currentUser, followingIds)
            );

            return this.handleLikeAndBookmarkFlags(postVisible, currentUser);
        } catch (error) {
            throw new Error("Get fail");
        }
    }

    async getListByMe(currentUser) {
        if (!currentUser)
            throw new Error("You must be logged in to view posts.");

        try {
            const posts = await Post.findAll({
                where: {
                    user_id: currentUser.id,
                },
                include: [
                    { model: Topic, as: "topics" },
                    {
                        model: User,
                        as: "user",
                        attributes: [
                            "id",
                            "avatar",
                            "username",
                            "fullname",
                            "first_name",
                            "last_name",
                        ],
                    },
                    {
                        model: User,
                        as: "usersBookmarked",
                        attributes: ["id"],
                    },
                ],
            });

            return this.handleLikeAndBookmarkFlags(posts, currentUser);
        } catch (error) {
            throw new Error("Get fail");
        }
    }

    async getBySlug(slug, currentUser) {
        try {
            const post = await Post.findOne({
                where: {
                    slug,
                    status: "published",
                    published_at: {
                        [Op.lte]: new Date(),
                    },
                },
                include: [
                    {
                        model: User,
                        as: "user",
                    },
                    {
                        model: User,
                        as: "usersBookmarked",
                        attributes: ["id"],
                        through: { attributes: [] },
                    },
                    {
                        model: Topic,
                        as: "topics",
                    },
                    {
                        model: Tag,
                        as: "tags",
                    },
                ],
            });

            if (!post) throw new Error("Post not found");

            const followingIds = await usersService.getUserFollowingIds(
                currentUser
            );

            const canView = this.canUserViewPost(
                post,
                currentUser,
                followingIds
            );

            if (!canView)
                throw new Error("You don't have permission to view this post");

            return this.handleLikeAndBookmarkFlags([post], currentUser);
        } catch (error) {
            console.error(error);
            throw new Error("Get fail by slug");
        }
    }

    async getByUserName(username, currentUser) {
        const user = await User.findOne({
            where: {
                username,
            },
        });

        if (!user) throw new Error("Not found user by username");

        const posts = await Post.findAll({
            where: {
                user_id: user.id,
                status: "published",
                published_at: {
                    [Op.lte]: new Date(),
                },
            },
            include: [
                { model: Topic, as: "topics" },
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "avatar",
                        "username",
                        "fullname",
                        "first_name",
                        "last_name",
                    ],
                },
                {
                    model: User,
                    as: "usersBookmarked",
                    attributes: ["id"],
                },
            ],
        });

        const followingIds = await usersService.getUserFollowingIds(
            currentUser
        );

        const postVisible = posts.filter((post) =>
            this.canUserViewPost(post, currentUser, followingIds)
        );

        return this.handleLikeAndBookmarkFlags(postVisible, currentUser);
    }

    async getListByTopicId(currentUser, topicId) {
        try {
            const posts = await Post.findAll({
                where: {
                    status: "published",
                    published_at: {
                        [Op.lte]: new Date(),
                    },
                },
                include: [
                    {
                        model: Topic,
                        as: "topics",
                        where: { id: topicId },
                    },
                    {
                        model: User,
                        as: "user",
                    },
                    {
                        model: User,
                        as: "usersBookmarked",
                        attributes: ["id"],
                    },
                ],
            });

            const followingIds = await usersService.getUserFollowingIds(
                currentUser
            );

            const postVisible = posts.filter((post) =>
                this.canUserViewPost(post, currentUser, followingIds)
            );

            return this.handleLikeAndBookmarkFlags(postVisible, currentUser);
        } catch (error) {
            throw new Error("TopicId invalid");
        }
    }

    async getBookmarkedPostsByUser(currentUser) {
        if (!currentUser)
            throw new Error("You must be logged in to access this.");

        const user = await User.findByPk(currentUser.id, {
            include: [
                {
                    model: Post,
                    as: "bookmarkedPosts",
                    through: {
                        attributes: ["id", "createdAt", "post_id", "user_id"],
                    },
                    include: [
                        {
                            model: Topic,
                            as: "topics",
                        },
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "first_name",
                                "last_name",
                                "avatar",
                            ],
                        },
                        {
                            model: User,
                            as: "usersBookmarked",
                            attributes: ["id"],
                        },
                    ],
                },
            ],
        });

        console.log(user?.bookmarkedPosts);

        const posts = user?.bookmarkedPosts || [];

        return this.handleLikeAndBookmarkFlags(posts, currentUser);
    }

    async getById(id) {
        const post = await Post.findOne({
            where: {
                id,
                status: "published",
                published_at: {
                    [Op.lte]: new Date(),
                },
            },
            include: [{ model: Topic, as: "topic" }],
        });

        return post;
    }

    async getRelatedPosts(currentPostId, currentUser) {
        const currentPostTopic = await Post.findOne({
            where: {
                id: currentPostId,
                status: "published",
                published_at: { [Op.lte]: new Date() },
            },
            include: {
                model: Topic,
                as: "topics",
                through: { attributes: [] },
            },
        });

        if (!currentPostTopic) throw new Error("Post not found");

        const topicIds = currentPostTopic.topics.map((item) => item.id);

        let allPosts = [];

        if (topicIds.length === 0) {
            const posts = await Post.findAll({
                where: { id: { [Op.not]: currentPostId } },
                limit: 3,
                order: Sequelize.literal("RAND()"),

                include: [
                    { model: Topic, as: "topics" },
                    {
                        model: User,
                        as: "user",
                        attributes: [
                            "id",
                            "avatar",
                            "first_name",
                            "fullname",
                            "last_name",
                        ],
                    },
                    {
                        model: User,
                        as: "usersBookmarked",
                        attributes: ["id"],
                    },
                ],
            });

            allPosts = posts;
        }

        const postByTopics = await Post.findAll({
            where: { id: { [Op.not]: currentPostId } },
            include: [
                {
                    model: Topic,
                    as: "topics",
                    through: { attributes: [] },

                    where: {
                        id: topicIds,
                    },
                },
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "avatar",
                        "first_name",
                        "fullname",
                        "last_name",
                    ],
                },
                {
                    model: User,
                    as: "usersBookmarked",
                    attributes: ["id"],
                },
            ],

            limit: 3,
            order: Sequelize.literal("RAND()"),
        });

        if (postByTopics.length >= 3) {
            allPosts = postByTopics;
        }

        const existingIds = postByTopics.map((item) => item.id);
        const excludeIds = [currentPostId, ...existingIds];

        const morePosts = await Post.findAll({
            where: {
                id: { [Op.notIn]: excludeIds },
                status: "published",
                published_at: { [Op.lte]: new Date() },
            },
            include: [
                {
                    model: Topic,
                    as: "topics",
                    through: { attributes: [] },
                },
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "avatar",
                        "fullname",
                        "first_name",
                        "last_name",
                    ],
                },
                {
                    model: User,
                    as: "usersBookmarked",
                    attributes: ["id"],
                },
            ],

            limit: 3 - postByTopics.length,
            order: Sequelize.literal("RAND()"),
        });

        allPosts = [...morePosts, ...postByTopics];

        const followingIds = await usersService.getUserFollowingIds(
            currentUser
        );

        const postVisible = allPosts.filter((post) =>
            this.canUserViewPost(post, currentUser, followingIds)
        );

        return this.handleLikeAndBookmarkFlags(postVisible, currentUser);
    }

    handleLikeAndBookmarkFlags = async (posts, currentUser) => {
        if (!currentUser) return posts;

        const postIds = posts.map((post) => post.id);

        const likes = await likesService.getAll("Post", postIds);

        const currentUserLikes = new Set();
        const currentUserBookmark = new Set();

        likes.forEach((like) => {
            if (like.user_id === currentUser.id) {
                currentUserLikes.add(like.likeable_id);
            }
        });

        return posts.map((post) => {
            post.usersBookmarked?.forEach((item) => {
                if (item.id === currentUser.id)
                    currentUserBookmark.add(post.id);
            });

            return {
                ...post.toJSON(),
                is_like: currentUserLikes.has(post.id),
                is_bookmark: currentUserBookmark.has(post.id),
            };
        });
    };

    async create(thumbnailPath, data, currentUser) {
        if (!currentUser) throw new Error("You must be logged to edit");

        const updateData = {};

        if (thumbnailPath) {
            updateData.thumbnail = thumbnailPath?.path.replace(/\\/g, "/");
        }

        if (!data.published_at) {
            updateData.published_at = Date.now();
        }

        const { topics, ...remain } = data;
        const newData = { ...updateData, ...remain };

        const baseSlug = slugify(newData.title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        while (await Post.findOne({ where: { slug } })) {
            slug = `${baseSlug}-${counter++}`;
        }

        const post = await Post.create({
            ...newData,
            slug,
            user_id: currentUser.id,
        });

        const newTopics = JSON.parse(topics);
        await Promise.all(
            newTopics.map(async (item) => {
                const { topic, created } = await topicsService.findOrCreate(
                    item
                );

                if (!created) {
                    topic.posts_count += 1;
                    await topic.save();
                }

                await post.addTopic(topic.id);
            })
        );

        currentUser.posts_count = currentUser.posts_count + 1;
        await currentUser.save();

        return post;
    }

    async viewsCount(id) {
        try {
            const post = await Post.findByPk(id);
            post.views_count = post.views_count + 1;

            await post.save();
        } catch (error) {
            return console.log("Lỗi khi update: ", error);
        }
    }

    async toggleLike(currentUser, postId) {
        if (!currentUser)
            throw new Error("You must be logged in to like this post.");

        const [like, created] = await Like.findOrCreate({
            where: {
                likeable_id: postId,
                user_id: currentUser.id,
                likeable_type: "Post",
            },
        });

        const post = await Post.findByPk(postId);

        if (!post) throw new Error("Post not found");

        if (!created) {
            await like.destroy();
            post.likes_count = Math.max(0, (post.likes_count ?? 0) - 1);
            await post.save();
            return false;
        }

        post.likes_count = (post.likes_count ?? 0) + 1;
        await post.save();

        try {
            const userPost = await User.findByPk(post.user_id);

            await pusherService.likePost(
                {
                    recipientId: userPost.id,
                    post: {
                        slug: post.slug,
                        id: post.id,
                    },
                },
                currentUser
            );
        } catch (error) {}

        return true;
    }

    async update(id, data) {
        try {
            await Post.update(data, {
                where: { id },
            });

            return await Post.findByPk(id);
        } catch (error) {
            return console.log("Lỗi khi update: ", error);
        }
    }

    async remove(id) {
        await Post.destroy({
            where: { id },
        });

        return null;
    }
}

module.exports = new PostsService();
