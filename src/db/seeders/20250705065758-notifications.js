"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        const notifications = [];

        for (let i = 1; i <= 10; i++) {
            notifications.push({
                type: "info",
                title: faker.lorem.sentence(),
                notifiable_type: "Post",
                notifiable_id: i,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("notifications", notifications, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("notifications", null, {});
    },
};
