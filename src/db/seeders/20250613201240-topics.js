"use strict";
const { faker } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
    async up(queryInterface, Sequelize) {
        const topics = [];

        for (let i = 0; i < 10; i++) {
            const name = faker.lorem.words(3);
            topics.push({
                name,
                slug: slugify(name, { lower: true }),
                image: faker.image.url(),
                description: faker.lorem.sentences(),
                posts_count: 0,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("topics", topics, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("topics", null, {});
    },
};
