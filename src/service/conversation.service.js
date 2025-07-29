const { where } = require("sequelize");
const { Conversation, Topic, User } = require("../db/models");

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

    async create(userId1, userId2) {
        if (userId1 === userId2) {
            throw new Error("Cannot create conversation with yourself.");
        }

        const ids = [userId1, userId2].sort((a, b) => a - b);
        const name = `private_${ids[0]}_${ids[1]}`;

        const [conversation, created] = await Conversation.findOrCreate({
            where: { name },
        });

        if (created) {
            const users = await User.findAll({
                where: {
                    id: ids,
                },
            });

            await conversation.addUsers(users);
        }

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
