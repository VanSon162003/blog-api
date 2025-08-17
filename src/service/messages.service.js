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

    async create(data, currentUser) {
        if (!currentUser) throw new Error("You need logged oke!!!");

        if (data.role) {
            let conversation = null;
            let message = null;
            if (!data.conversationId) {
                const timestamp = new Date()
                    .toISOString()
                    .replace(/[-:T.]/g, "");
                const name = `user-${timestamp}`;
                conversation = await Conversation.create({ name });
            }

            if (data.role === "user") {
                message = await Message.create({
                    user_id: currentUser.id,
                    conversation_id: !data.conversationId
                        ? conversation.id
                        : data.conversationId,
                    role: data.role,
                    content: JSON.stringify({
                        role: data.role,
                        content: data.content,
                    }),
                });
            } else {
                const [chatbot, create] = await User.findOrCreate({
                    where: {
                        email: `chatbot@gmail.com`,
                        username: "chat bot",
                    },
                });
                message = await Message.create({
                    user_id: chatbot.id,
                    conversation_id: !data.conversationId
                        ? conversation.id
                        : data.conversationId,
                    role: data.role,
                    content: JSON.stringify({
                        role: data.role,
                        content: data.content,
                    }),
                });
            }

            return {
                content: JSON.parse(message.content),
                conversationId: !data?.conversationId
                    ? conversation?.id
                    : data?.conversationId,
            };
        }
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
