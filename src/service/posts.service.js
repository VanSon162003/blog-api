const { where } = require("sequelize");
const { Post, Topic, User } = require("../db/models");
const likesService = require("./likes.service");

class PostsService {
    async getAll() {
        const posts = await Post.findAll({
            include: [
                { model: Topic, as: "topics" },
                { model: User, as: "user" },
            ],
        });

        const likes = await likesService.getAll();

        const postIds = posts.map((post) => post.id);

        return { posts, postIds };
    }

    async getById(id) {
        const post = await Post.findOne({
            where: { id },
            include: [{ model: Topic, as: "topic" }],
        });

        return post;
    }

    async countAllPostsInTopic(topicId) {
        const post = await Post.count({
            where: { topic_id: topicId },
        });

        return post;
    }

    async getAllCommentsInPost(id) {
        const posts = await Post.findAll({
            where: {
                topic_id: id,
            },
        });
        return posts;
    }

    async getBySlug(slug) {
        const post = await Post.findOne({
            where: { slug },
            include: [{ model: Topic, as: "topic" }],
        });

        return post;
    }

    async create(data) {
        const post = await Post.create(data);
        return post;
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
