"use strict";

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

        const bookmarks = [];
        const uniqueSet = new Set();

        while (bookmarks.length < 10 && users.length > 0 && posts.length > 0) {
            const user = users[Math.floor(Math.random() * users.length)];
            const post = posts[Math.floor(Math.random() * posts.length)];

            const key = `${user.id}-${post.id}`;
            if (!uniqueSet.has(key)) {
                uniqueSet.add(key);
                bookmarks.push({
                    user_id: user.id,
                    post_id: post.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
        }

        await queryInterface.bulkInsert("bookmarks", bookmarks, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("bookmarks", null, {});
    },
};
