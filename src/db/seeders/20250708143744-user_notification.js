"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const notifications = await queryInterface.sequelize.query(
            `SELECT id FROM notifications`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const userNotifications = [];
        const uniqueSet = new Set();

        while (
            userNotifications.length < 10 &&
            users.length > 0 &&
            notifications.length > 0
        ) {
            const user = users[Math.floor(Math.random() * users.length)];
            const notification =
                notifications[Math.floor(Math.random() * notifications.length)];

            const key = `${user.id}-${notification.id}`;

            if (!uniqueSet.has(key)) {
                uniqueSet.add(key);
                userNotifications.push({
                    user_id: user.id,
                    notification_id: notification.id,
                    read_at: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
        }

        await queryInterface.bulkInsert(
            "user_notification",
            userNotifications,
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("user_notification", null, {});
    },
};
