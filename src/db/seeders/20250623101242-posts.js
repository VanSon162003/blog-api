"use strict";
const { faker } = require("@faker-js/faker");
const slugify = require("slugify");

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        const posts = [];

        for (let i = 0; i < 20; i++) {
            const title = faker.lorem.sentence();
            posts.push({
                user_id: users[Math.floor(Math.random() * users.length)].id,
                title,
                slug: slugify(title, { lower: true }),
                thumbnail: faker.image.url(),
                description: faker.lorem.paragraph(),
                meta_title: title,
                meta_description: faker.lorem.sentences(),
                content: faker.lorem.paragraphs(2),
                status: "published",
                visibility: "public",
                views_count: faker.number.int(500),
                likes_count: faker.number.int(100),
                published_at: new Date(),
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("posts", posts, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("posts", null, {});
    },
};
