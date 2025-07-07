"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface) {
        const subscribers = [];

        for (let i = 0; i < 20; i++) {
            subscribers.push({
                email: faker.internet.email(),
                created_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("subscribers", subscribers, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("subscribers", null, {});
    },
};
