"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        const comments = [];

        const posts = await queryInterface.sequelize.query(
            "SELECT id FROM posts;",
            { type: Sequelize.QueryTypes.SELECT }
        );

        for (const post of posts) {
            for (let i = 0; i < 5; i++) {
                comments.push({
                    post_id: post.id,
                    author: faker.internet.userName(),
                    content: faker.lorem.sentences(2),
                    created_at: new Date(),
                });
            }
        }

        await queryInterface.bulkInsert("comments", comments, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("comments", null, {});
    },
};
