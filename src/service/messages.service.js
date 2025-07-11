const { where } = require("sequelize");
const { Message, User, Conversation } = require("../db/models");

class MessagesService {
    async getAll() {
        const messages = await Message.findAll();
        return messages;
    }

    async getById(id) {
        const message = await Message.findOne({
            where: { id },
            include: [{ model: User, as: "topic" }],
        });

        return message;
    }

    async getByConversationId(id) {
        const message = await Message.findAll({
            where: { conversation_id: id },
            include: [
                { model: User, as: "user" },
                { model: Conversation, as: "conversation" },
            ],
        });

        return message;
    }

    async create(data) {
        const message = await Message.create(data);
        return message;
    }

    async update(id, data) {
        try {
            await Message.update(data, {
                where: { id },
            });

            return await Message.findByPk(id);
        } catch (error) {
            return console.log("Lỗi khi update: ", error);
        }
    }

    async remove(id) {
        await Message.destroy({
            where: { id },
        });

        return null;
    }
}

module.exports = new MessagesService();
