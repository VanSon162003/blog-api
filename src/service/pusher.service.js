const {
    Conversation,
    Message,
    UserNotification,
    Notification,
} = require("../db/models");
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

        // notification

        const notification = await Notification.create({
            type: "message",
            title: `You have a new message from ${currentUser.username}`,
            message: `You have a new message from ${currentUser.username}`,
            link: "/messages",
            notifiable_type: "Message",
            notifiable_id: message.id,
        });

        await UserNotification.create({
            user_id: data.recipientId,
            notification_id: notification.id,
            read_at: null,
        });

        // 3. Gửi real-time bằng Pusher
        await pusher.trigger(
            `user-${data.recipientId}`,
            "notification-new-message",
            {
                id: notification.id,
                type: "message",
                title: `You have a new message from ${currentUser.username}`,
                message: `You have a new message from ${currentUser.username}`,
                link: "/messages",
                notifiable_type: "Message",
                notifiable_id: message.id,
                createAt: Date.now(),
                updateAt: Date.now(),

                UserNotification: {
                    read_at: null,
                    createAt: Date.now(),
                },
            }
        );

        return message;
    }

    async follow(data, currentUser) {
        try {
            const notification = await Notification.create({
                type: "follow",
                title: `${currentUser.fullname} has started following you`,
                message: `${currentUser.fullname} has started following you`,
                link: `/profile/${currentUser.username}`,
                notifiable_type: "Follow",
                notifiable_id: currentUser.id,
            });

            await UserNotification.create({
                user_id: data.recipientId,
                notification_id: notification.id,
                read_at: null,
            });

            // 3. Gửi real-time bằng Pusher
            await pusher.trigger(
                `follow-${data.recipientId}`,
                "notification-new-follow",
                {
                    id: notification.id,
                    type: "follow",
                    title: `${currentUser.fullname} has started following you`,
                    message: `${currentUser.fullname} has started following you`,
                    link: `/profile/${currentUser.username}`,
                    notifiable_type: "follow",
                    notifiable_id: currentUser.id,
                    createAt: Date.now(),
                    updateAt: Date.now(),

                    UserNotification: {
                        read_at: null,
                        createAt: Date.now(),
                    },
                }
            );
        } catch (error) {}

        return true;
    }

    async likePost(data, currentUser) {
        if (currentUser.id === data.recipientId) return;

        try {
            const notification = await Notification.create({
                type: "like",
                title: `${currentUser.fullname} liked your post`,
                message: `${currentUser.fullname} liked your post`,
                link: `blog/${data.post.slug}`,
                notifiable_type: "Like",
                notifiable_id: data.post.id,
            });

            await UserNotification.create({
                user_id: data.recipientId,
                notification_id: notification.id,
                read_at: null,
            });

            // 3. Gửi real-time bằng Pusher
            await pusher.trigger(
                `like-${data.recipientId}`,
                "notification-new-like-post",
                {
                    id: notification.id,
                    type: "like",
                    title: `${currentUser.fullname} liked your post`,
                    message: `${currentUser.fullname} liked your post`,
                    link: `blog/${data.post.slug}`,
                    notifiable_type: "Like",
                    notifiable_id: data.post.id,
                    createAt: Date.now(),
                    updateAt: Date.now(),

                    UserNotification: {
                        read_at: null,
                        createAt: Date.now(),
                    },
                }
            );
        } catch (error) {}

        return true;
    }

    async sendComment(data, currentUser) {
        if (currentUser.id === data.recipientId) return;

        try {
            const notification = await Notification.create({
                type: "comment",
                title: `${currentUser.fullname} commented your post`,
                message: `${currentUser.fullname} commented your post`,
                link: `blog/${data.post.slug}#${currentUser.username}`,
                notifiable_type: "Comment",
                notifiable_id: data.post.id,
            });

            await UserNotification.create({
                user_id: data.recipientId,
                notification_id: notification.id,
                read_at: null,
            });

            // 3. Gửi real-time bằng Pusher
            await pusher.trigger(
                `comment-${data.recipientId}`,
                "notification-new-comment-post",
                {
                    id: notification.id,
                    type: "comment",
                    title: `${currentUser.fullname} commented your post`,
                    message: `${currentUser.fullname} commented your post`,
                    link: `blog/${data.post.slug}#${currentUser.username}`,
                    notifiable_type: "Comment",
                    notifiable_id: data.post.id,
                    createAt: Date.now(),
                    updateAt: Date.now(),

                    UserNotification: {
                        read_at: null,
                        createAt: Date.now(),
                    },
                }
            );
        } catch (error) {}

        return true;
    }
}

module.exports = new PusherService();
