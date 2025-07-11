const { where } = require("sequelize");
const { Conversation, Topic } = require("../db/models");

class ConversationsService {
    async getAll() {
        const conversations = await Conversation.findAll();
        return conversations;
    }

    async getById(id) {
        const conversation = await Conversation.findOne({
            where: { id },
            include: [{ model: Topic, as: "topic" }],
        });

        return conversation;
    }

    async getByName(name) {
        const conversation = await Conversation.findOne({
            where: { name },
        });

        return conversation;
    }

    async create(data) {
        const conversation = await Conversation.create(data);
        return conversation;
    }

    async update(id, data) {
        try {
            await Conversation.update(data, {
                where: { id },
            });

            return await Conversation.findByPk(id);
        } catch (error) {
            return console.log("Lỗi khi update: ", error);
        }
    }

    async remove(id) {
        await Conversation.destroy({
            where: { id },
        });

        return null;
    }
}

module.exports = new ConversationsService();
