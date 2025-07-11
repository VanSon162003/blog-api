"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        const conversations = [];

        for (let i = 0; i < 5; i++) {
            conversations.push({
                name: faker.lorem.words(2),
                avatar: faker.image.avatar(),
                last_message_at: new Date(),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("conversations", conversations, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("conversations", null, {});
    },
};
