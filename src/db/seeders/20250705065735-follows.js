"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const follows = [];
        const uniquePairs = new Set();

        while (follows.length < 20 && users.length > 1) {
            const follower = users[Math.floor(Math.random() * users.length)];
            let followed = users[Math.floor(Math.random() * users.length)];

            while (follower.id === followed.id) {
                followed = users[Math.floor(Math.random() * users.length)];
            }

            const key = `${follower.id}-${followed.id}`;
            if (!uniquePairs.has(key)) {
                uniquePairs.add(key);
                follows.push({
                    following_id: follower.id,
                    followed_id: followed.id,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }
        }

        await queryInterface.bulkInsert("follows", follows, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("follows", null, {});
    },
};
