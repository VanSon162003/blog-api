const { where } = require("sequelize");
const { Topic } = require("../db/models");

class TopicsService {
    async getAll() {
        try {
            const topics = await Topic.findAll();
            return topics;
        } catch (error) {
            throw new Error("Unable to fetch the list of topics.");
        }
    }

    async getById(id) {
        const topic = await Topic.findOne({ where: { id } });

        return topic;
    }

    async getBySlug(slug) {
        try {
            const topic = await Topic.findOne({ where: { slug } });

            return topic;
        } catch (error) {
            throw new Error("Invalid slug");
        }
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
