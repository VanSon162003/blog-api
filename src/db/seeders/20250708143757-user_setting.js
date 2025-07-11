"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = await queryInterface.sequelize.query(
            `SELECT id FROM users`,
            {
                type: queryInterface.sequelize.QueryTypes.SELECT,
            }
        );

        const settings = users.map((user) => ({
            user_id: user.id,
            data: JSON.stringify({ theme: "dark", notifications: true }),
            created_at: new Date(),
            updated_at: new Date(),
        }));

        await queryInterface.bulkInsert("user_setting", settings, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("user_setting", null, {});
    },
};
