const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface) {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const follows = [];
        for (let i = 0; i < 30; i++) {
            const follower = faker.helpers.arrayElement(users);
            let following = faker.helpers.arrayElement(users);
            while (follower.id === following.id) {
                following = faker.helpers.arrayElement(users);
            }
            follows.push({
                follower_id: follower.id,
                following_id: following.id,
                created_at: new Date(),
            });
        }
        await queryInterface.bulkInsert("follows", follows, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("follows", null, {});
    },
};
