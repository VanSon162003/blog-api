"use strict";
const { faker } = require("@faker-js/faker");
const { slugify } = require("transliteration");

module.exports = {
    async up(queryInterface) {
        const topics = [];

        for (let i = 0; i < 10; i++) {
            const name = faker.word.words({ count: { min: 1, max: 3 } });
            topics.push({
                name,
                slug: slugify(name),
                thumbnail: faker.image.urlPicsumPhotos(),
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
