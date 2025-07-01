const { where } = require("sequelize");
const { Comment, Post } = require("../db/models");

class CommentsService {
    async getAll() {
        const comments = await Comment.findAll();
        return comments;
    }

    async getAllCommentsInPost(id) {
        const comments = await Comment.findAll({
            where: {
                post_id: id,
            },
        });
        return comments;
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

    async create(data) {
        const comment = await Comment.create(data);
        return comment;
    }

    async update(id, data) {
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
