const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface) {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const notifications = [];
        for (let i = 0; i < 30; i++) {
            notifications.push({
                user_id: faker.helpers.arrayElement(users).id,
                type: faker.helpers.arrayElement(["like", "comment", "follow"]),
                content: faker.lorem.sentence(),
                is_read: faker.datatype.boolean(),
                created_at: new Date(),
            });
        }
        await queryInterface.bulkInsert("notifications", notifications, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("notifications", null, {});
    },
};
