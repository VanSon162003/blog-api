"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );
        const conversations = await queryInterface.sequelize.query(
            `SELECT id FROM conversations`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const messages = [];

        for (let i = 0; i < 30; i++) {
            messages.push({
                user_id: users[Math.floor(Math.random() * users.length)].id,
                conversation_id:
                    conversations[
                        Math.floor(Math.random() * conversations.length)
                    ].id,
                type: "text",
                content: faker.lorem.sentence(),
                deleted_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("messages", messages, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("messages", null, {});
    },
};
