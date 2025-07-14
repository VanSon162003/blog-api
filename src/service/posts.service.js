const { where } = require("sequelize");
const { Post, Topic, User, Like } = require("../db/models");
const likesService = require("./likes.service");
class PostsService {
    async getAll(currentUser) {
        try {
            const posts = await Post.findAll({
                include: [
                    { model: Topic, as: "topics" },
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "avatar", "first_name", "last_name"],
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

    async getListByTopicId(currentUser, topicId) {
        try {
            const posts = await Post.findAll({
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

            return this.handleLikeAndBookmarkFlags(posts, currentUser);
        } catch (error) {
            throw new Error("TopicId invalid");
        }
    }

    async getBookmarkedPostsByUser(currentUser) {
        if (!currentUser) throw new Error("Chưa đăng nhập");

        const user = await User.findByPk(currentUser.id, {
            include: [
                {
                    model: Post,
                    as: "bookmarkedPosts",
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

        const posts = user?.bookmarkedPosts || [];

        return this.handleLikeAndBookmarkFlags(posts, currentUser);
    }

    async getById(id) {
        const post = await Post.findOne({
            where: { id },
            include: [{ model: Topic, as: "topic" }],
        });

        return post;
    }

    handleLikeAndBookmarkFlags = async (posts, currentUser) => {
        if (!currentUser) return posts;

        const postIds = posts.map((post) => post.id);

        const likes = await likesService.getAll({
            where: {
                likeable_type: "Post",
                likeable_id: postIds,
            },
        });

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

    async create(data) {
        const post = await Post.create(data);
        return post;
    }

    async toggleLike(currentUser, postId) {
        if (!currentUser) throw new Error("Cần đăng nhập để thả tim");

        const [like, create] = await Like.findOrCreate({
            where: {
                likeable_id: postId,
                user_id: currentUser.id,
                likeable_type: "Post",
            },
        });

        if (!create) {
            await like.destroy();
            return false;
        }
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
