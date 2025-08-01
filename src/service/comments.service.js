const { where } = require("sequelize");
const {
    Comment,
    Post,
    User,
    Like,
    UserSetting,
    Queue,
} = require("../db/models");

const likesService = require("../service/likes.service");

class CommentsService {
    async getAll() {
        const comments = await Comment.findAll();
        return comments;
    }

    async getAllCommentsInPost(postId, currentUser) {
        const comments = await Comment.findAll({
            where: {
                post_id: postId,
                deleted_at: null,
                parent_id: null,
            },
            attributes: [
                "id",
                "user_id",
                "post_id",
                "parent_id",
                "content",
                "like_count",
                "edited_at",
                "deleted_at",
                "created_at",
                "updated_at",
            ],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "avatar",
                        "fullname",
                        "first_name",
                        "last_name",
                        "email",
                        "username",
                    ],
                },
                {
                    model: Comment,
                    as: "replies",
                    where: {
                        deleted_at: null,
                    },
                    required: false,
                    attributes: [
                        "id",
                        "user_id",
                        "post_id",
                        "parent_id",
                        "content",
                        "like_count",
                        "deleted_at",
                        "edited_at",

                        "created_at",
                        "updated_at",
                    ],

                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "avatar",
                                "first_name",
                                "fullname",
                                "last_name",
                                "email",
                                "username",
                            ],
                        },
                    ],
                },
            ],
        });

        return this.likeCommentFlags(comments, currentUser);
    }

    async getById(id) {
        const comment = await Comment.findOne({
            where: { id },
            include: [{ model: Post, as: "post" }],
        });

        return comment;
    }

    async getBySlug(slug) {
        const comment = await Comment.findOne({
            where: { slug },
            include: [{ model: Post, as: "post" }],
        });

        return comment;
    }

    likeCommentFlags = async (comments, currentUser) => {
        if (!currentUser) return comments;

        const allComments = [];
        comments.forEach((comment) => {
            allComments.push(comment);
            if (comment.replies && comment.replies.length > 0) {
                allComments.push(...comment.replies);
            }
        });

        const commentIds = allComments.map((comment) => comment.id);

        const likes = await likesService.getAll("Comment", commentIds);

        const currentUserLikes = new Set();
        likes.forEach((like) => {
            if (like.user_id === currentUser.id) {
                currentUserLikes.add(like.likeable_id);
            }
        });

        const withLikeFlag = comments.map((comment) => {
            const commentJSON = comment.toJSON();
            commentJSON.is_like = currentUserLikes.has(comment.id);

            if (commentJSON.replies && commentJSON.replies.length > 0) {
                commentJSON.replies = commentJSON.replies.map((reply) => ({
                    ...reply,
                    is_like: currentUserLikes.has(reply.id),
                }));
            }

            return commentJSON;
        });

        return withLikeFlag;
    };

    async toggleLike(currentUser, commentId) {
        if (!currentUser)
            throw new Error("You must be logged in to like this post.");

        const [like, created] = await Like.findOrCreate({
            where: {
                likeable_id: commentId,
                user_id: currentUser.id,
                likeable_type: "Comment",
            },
        });

        const comment = await Comment.findByPk(commentId);

        if (!comment) throw new Error("Comment not found");

        if (!created) {
            await like.destroy();
            comment.like_count = Math.max(0, (comment.like_count ?? 0) - 1);
            await comment.save();
            return false;
        }

        comment.like_count = (comment.like_count ?? 0) + 1;
        await comment.save();
        return true;
    }

    async create(currentUser, data) {
        if (!currentUser)
            throw new Error("You must be logged in to comment this post.");

        let parentId = data.parent_id || null;

        let currentPost = null;

        try {
            currentPost = await Post.findOne({
                where: {
                    id: data.post_id,
                },
            });
            if (currentPost) {
                const userPost = await User.findByPk(currentPost?.user_id, {
                    include: {
                        model: UserSetting,
                        as: "settings",
                    },
                });

                const settings = JSON.parse(userPost.settings.data);

                if (!settings.allowComments) {
                    throw new Error("You can't comment in post this");
                }
            }
        } catch (error) {
            throw new Error(error.message);
        }

        console.log(123);

        if (parentId) {
            const parentComment = await Comment.findByPk(parentId);

            if (!parentComment) {
                throw new Error("Parent comment not found");
            }

            if (parentComment.parent_id) {
                parentId = parentComment.parent_id;
            }
        }

        const comment = await Comment.create({
            ...data,
            parent_id: parentId,
            user_id: currentUser.id,
        });

        await comment.reload({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "avatar",
                        "fullname",
                        "first_name",
                        "last_name",
                        "email",
                        "username",
                    ],
                },
                {
                    model: Comment,
                    as: "replies",
                    attributes: [
                        "id",
                        "user_id",
                        "post_id",
                        "parent_id",
                        "content",
                        "like_count",
                        "deleted_at",
                        "created_at",
                        "updated_at",
                    ],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: [
                                "id",
                                "avatar",
                                "fullname",
                                "first_name",
                                "last_name",
                                "email",
                                "username",
                            ],
                        },
                    ],
                },
            ],
        });

        try {
            if (currentPost) {
                const userPost = await User.findByPk(currentPost?.user_id, {
                    include: {
                        model: UserSetting,
                        as: "settings",
                    },
                });

                const settings = JSON.parse(userPost.settings.data);

                if (
                    userPost.id !== currentUser.id &&
                    settings.emailNewComments
                ) {
                    await Queue.create({
                        type: "sendNewCommentJob",
                        payload: {
                            userPostId: userPost.id,
                            userCommentId: currentUser.id,
                            content: data.content,
                            post: currentPost,
                        },
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }

        return comment;
    }

    async update(id, data, currentUser) {
        if (!currentUser)
            throw new Error("You must be logged in to edit comment this post.");

        try {
            await Comment.update(data, {
                where: { id },
            });

            return await Comment.findByPk(id);
        } catch (error) {
            return console.log("Lỗi khi update: ", error);
        }
    }

    async remove(id) {
        await Comment.destroy({
            where: { id },
        });

        return null;
    }
}

module.exports = new CommentsService();
