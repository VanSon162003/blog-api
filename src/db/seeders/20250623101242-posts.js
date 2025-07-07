"use strict";
const { faker } = require("@faker-js/faker");
const { slugify } = require("transliteration");

module.exports = {
    async up(queryInterface) {
        const posts = [];

        for (let i = 0; i < 20; i++) {
            const title = faker.lorem.sentence();
            posts.push({
                title,
                slug: slugify(title),
                content: faker.lorem.paragraphs(3),
                thumbnail: faker.image.urlPicsumPhotos(),
                views: faker.number.int({ min: 0, max: 1000 }),
                user_id: faker.number.int({ min: 1, max: 20 }),
                topic_id: faker.number.int({ min: 1, max: 10 }),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("posts", posts, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("posts", null, {});
    },
};
