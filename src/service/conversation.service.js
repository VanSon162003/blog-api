const { where, Op } = require("sequelize");
const { Conversation, Topic, User, Message } = require("../db/models");

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

    async remove(id) {
        await Conversation.destroy({
            where: { id },
        });

        return null;
    }
}

module.exports = new ConversationsService();
