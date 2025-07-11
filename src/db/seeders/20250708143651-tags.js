"use strict";
const { faker } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
    async up(queryInterface, Sequelize) {
        const tags = [];

        for (let i = 0; i < 10; i++) {
            const name = faker.word.noun();
            tags.push({
                name: slugify(name),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("tags", tags, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("tags", null, {});
    },
};
