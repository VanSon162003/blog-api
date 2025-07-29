const { where } = require("sequelize");
const { Post, Bookmark, Conversation, Message } = require("../db/models");
const pusher = require("../config/pusher");

class PusherService {
    async sendMessage(data, currentUser) {
        if (!currentUser) throw new Error("Before chat message you can logged");

        const conversation = await Conversation.findOne({
            where: {
                name: data.channel,
            },
        });

        const message = await Message.create({
            user_id: currentUser.id,
            conversation_id: conversation.id,
            content: data.message,
        });

        await pusher.trigger(data.channel, "new-message", {
            id: message.id,
            content: message.content,
            user_id: message.user_id,
            conversation_id: message.conversation_id,
            createdAt: message.createdAt,
        });

        return message;
    }
}

module.exports = new PusherService();
