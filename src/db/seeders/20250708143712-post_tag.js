"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const posts = await queryInterface.sequelize.query(
            `SELECT id FROM posts`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        const tags = await queryInterface.sequelize.query(
            `SELECT id FROM tags`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        const postTags = [];
        const uniqueSet = new Set();

        while (postTags.length < 20 && posts.length > 0 && tags.length > 0) {
            const post = posts[Math.floor(Math.random() * posts.length)];
            const tag = tags[Math.floor(Math.random() * tags.length)];

            const key = `${post.id}-${tag.id}`;

            if (!uniqueSet.has(key)) {
                uniqueSet.add(key);
                postTags.push({
                    post_id: post.id,
                    tag_id: tag.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
        }

        await queryInterface.bulkInsert("post_tag", postTags, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("post_tag", null, {});
    },
};
