"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const posts = await queryInterface.sequelize.query(
            `SELECT id FROM posts`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const likesSet = new Set();
        const likes = [];

        while (likes.length < 20) {
            const user = users[Math.floor(Math.random() * users.length)];
            const post = posts[Math.floor(Math.random() * posts.length)];

            const key = `${user.id}-Post-${post.id}`;

            if (!likesSet.has(key)) {
                likesSet.add(key);
                likes.push({
                    user_id: user.id,
                    likeable_type: "Post",
                    likeable_id: post.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
        }

        await queryInterface.bulkInsert("likes", likes, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("likes", null, {});
    },
};
