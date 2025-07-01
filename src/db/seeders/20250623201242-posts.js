"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        const posts = [];

        const topics = await queryInterface.sequelize.query(
            "SELECT id FROM topics;",
            { type: Sequelize.QueryTypes.SELECT }
        );

        for (const topic of topics) {
            for (let i = 0; i < 50; i++) {
                const title = faker.lorem.sentence();
                posts.push({
                    topic_id: topic.id,
                    title,
                    slug: faker.helpers.slugify(title).toLowerCase(),
                    content: faker.lorem.paragraphs(3),
                    author: faker.internet.userName(),
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
        }

        await queryInterface.bulkInsert("posts", posts, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("posts", null, {});
    },
};
