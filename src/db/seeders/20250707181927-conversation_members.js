"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        const conversations = await queryInterface.sequelize.query(
            `SELECT id FROM conversations`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const data = [];
        const uniqueSet = new Set();

        while (
            data.length < 20 &&
            users.length > 0 &&
            conversations.length > 0
        ) {
            const user = users[Math.floor(Math.random() * users.length)];
            const conversation =
                conversations[Math.floor(Math.random() * conversations.length)];

            const key = `${user.id}-${conversation.id}`;

            if (!uniqueSet.has(key)) {
                uniqueSet.add(key);
                data.push({
                    user_id: user.id,
                    conversation_id: conversation.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
        }

        await queryInterface.bulkInsert("user_conversation", data, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("user_conversation", null, {});
    },
};
