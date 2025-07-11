"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        const posts = await queryInterface.sequelize.query(
            `SELECT id FROM posts`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        const comments = [];

        for (let i = 0; i < 20; i++) {
            comments.push({
                user_id: users[Math.floor(Math.random() * users.length)].id,
                post_id: posts[Math.floor(Math.random() * posts.length)].id,
                parent_id: null,
                content: faker.lorem.sentences(),
                deleted_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("comments", comments, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("comments", null, {});
    },
};
