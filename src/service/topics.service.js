const { where } = require("sequelize");
const { Topic } = require("../db/models");

class TopicsService {
    async getAll() {
        const topics = await Topic.findAll();
        return topics;
    }

    async getById(id) {
        const topic = await Topic.findOne({ where: { id } });

        return topic;
    }

    async getBySlug(slug) {
        const topic = await Topic.findOne({ where: { slug } });

        return topic;
    }

    async create(data) {
        const topic = await Topic.create(data);
        return topic;
    }

    async update(id, data) {
        try {
            await Topic.update(data, {
                where: { id },
            });

            return await Topic.findByPk(id);
        } catch (error) {
            return console.log("Lỗi khi update: ", error);
        }
    }

    async remove(id) {
        await Topic.destroy({
            where: { id },
        });

        return null;
    }
}

module.exports = new TopicsService();
