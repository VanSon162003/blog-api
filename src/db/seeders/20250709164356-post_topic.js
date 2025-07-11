"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const posts = await queryInterface.sequelize.query(
            `SELECT id FROM posts`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        const topics = await queryInterface.sequelize.query(
            `SELECT id FROM topics`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        const postTopics = [];

        for (let i = 0; i < 20; i++) {
            postTopics.push({
                post_id: posts[Math.floor(Math.random() * posts.length)].id,
                topic_id: topics[Math.floor(Math.random() * topics.length)].id,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("post_topic", postTopics, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("post_topic", null, {});
    },
};
