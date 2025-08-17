const { where, Op } = require("sequelize");
const { Conversation, Topic, User, Message } = require("../db/models");
const intentClassifier = require("../utils/intentClassifier");
const messagesService = require("../service/messages.service");
const sendOpenai = require("../agents/sendOpenai");

class ConversationsService {
    async getAll(currentUser) {
        if (!currentUser)
            throw new Error(
                "You can't get conversations when you are not logged in."
            );

        const conversations = await Conversation.findAll({
            include: [
                {
                    model: User,
                    as: "users",
                    attributes: ["id", "username", "fullname", "avatar"],
                    through: { attributes: [] },
                    where: { id: currentUser?.id },
                    required: true,
                    include: {
                        model: Message,
                        as: "messages",
                        limit: 1,
                        attributes: [
                            "id",
                            "conversation_id",
                            "type",
                            "content",
                            "createdAt",
                            "updatedAt",
                        ],

                        where: {
                            deleted_at: null,
                        },
                        order: [["created_at", "DESC"]],
                    },
                },
                {
                    model: User,
                    as: "otherUsers",
                    attributes: ["id", "username", "fullname", "avatar"],
                    through: { attributes: [] },
                    where: { id: { [Op.ne]: currentUser?.id } },
                    include: {
                        model: Message,
                        as: "messages",
                        limit: 1,
                        attributes: [
                            "id",
                            "conversation_id",
                            "type",
                            "content",
                            "createdAt",
                            "updatedAt",
                        ],
                        where: {
                            deleted_at: null,
                        },
                        order: [["created_at", "DESC"]],
                    },
                },
            ],
        });

        return conversations;
    }

    async getById(id, currentUser) {
        if (!currentUser)
            throw new Error(
                "You can't get conversations when you are not logged in."
            );
        const conversation = await Conversation.findOne({
            where: { id },
            attributes: ["name"],
            include: {
                model: User,
                as: "users",
                attributes: ["id"],
                where: {
                    id: { [Op.ne]: currentUser.id },
                },
                through: {
                    attributes: [],
                },
            },
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

    // open ai
    async chat(newMessages, conversationId, currentUser) {
        if (!currentUser)
            throw new Error("You need to log in to use the chatbot.");
        const [chatbot, create] = await User.findOrCreate({
            where: {
                email: `chatbot@gmail.com`,
                username: "chat bot",
            },
        });

        let conversation = null;
        let messages = [];
        if (conversationId === "null") {
            const timestamp = new Date().toISOString().replace(/[-:T.]/g, "");
            const name = `user-${timestamp}`;
            conversation = await Conversation.create({ name });
        } else {
            messages = await messagesService.getByConversationId(
                conversationId
            );

            conversation = await Conversation.findByPk(conversationId);
        }

        const checkCurrentUser = await conversation.hasUser(currentUser.id);
        const checkChatbot = await conversation.hasUser(chatbot.id);

        if (!checkCurrentUser) {
            await conversation.addUser(currentUser.id);
        }

        if (!checkChatbot) {
            await conversation.addUser(chatbot.id);
        }

        const messagesAll = messages.map((item) => {
            const result = JSON.parse(item.content);

            return result;
        });

        const messagesUser = messagesAll
            .filter((item) => item.role === "user")
            .slice(-4);

        const intent = await intentClassifier([
            ...messagesUser,
            {
                role: "user",
                content: newMessages,
            },
        ]);

        let result = null;

        switch (intent) {
            case "content.search":
                result = await sendOpenai(
                    "content.search",
                    messagesAll.slice(-10)
                );
                break;
            case "tutorial.assist":
                result = await sendOpenai(
                    "tutorial.assist",
                    messagesAll.slice(-10)
                );
                break;

            case "qa.expert":
                result = await sendOpenai("qa.expert", messagesAll.slice(-10));
                break;

            case "feedback.engage":
                result = await sendOpenai(
                    "feedback.engage",
                    messagesAll.slice(-10)
                );
                break;

            case "news.update":
                result = await sendOpenai(
                    "news.update",
                    messagesAll.slice(-10)
                );
                break;

            case "nav.support":
                result = await sendOpenai(
                    "nav.support",
                    messagesAll.slice(-10)
                );
                break;

            default:
                result = await sendOpenai("default", messagesAll.slice(-10));
        }

        await Message.create({
            user_id: currentUser.id,
            conversation_id:
                conversationId === "null" ? conversation.id : conversationId,
            content: JSON.stringify({
                role: "user",
                content: newMessages,
            }),
            role: "user",
        });

        await Message.create({
            user_id: chatbot.id,
            conversation_id:
                conversationId === "null" ? conversation.id : conversationId,
            role: "system",
            content: JSON.stringify({
                role: "system",
                ...result,
            }),
        });

        return {
            content: result.content,
            conversationId:
                conversationId === "null" ? conversation.id : conversationId,
        };
    }

    async removeChat(id) {
        await Conversation.destroy({
            where: { id },
        });

        await Message.destroy({
            where: {
                conversation_id: id,
            },
        });

        return null;
    }
}

module.exports = new ConversationsService();
