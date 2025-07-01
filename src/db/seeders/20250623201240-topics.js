"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        const topics = [];

        for (let i = 0; i < 5; i++) {
            const name = faker.lorem.words(2);
            topics.push({
                name,
                slug: faker.helpers.slugify(name).toLowerCase(),
                description: faker.lorem.sentence(),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("topics", topics, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("topics", null, {});
    },
};
