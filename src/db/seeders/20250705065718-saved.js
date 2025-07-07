const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface) {
        const posts = await queryInterface.sequelize.query(
            `SELECT id FROM posts`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const saved = [];
        for (let i = 0; i < 50; i++) {
            saved.push({
                post_id: faker.helpers.arrayElement(posts).id,
                user_id: faker.helpers.arrayElement(users).id,
                created_at: new Date(),
            });
        }
        await queryInterface.bulkInsert("save_posts", saved, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("save_posts", null, {});
    },
};
