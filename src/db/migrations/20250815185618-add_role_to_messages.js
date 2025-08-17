"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("messages", "role", {
            type: Sequelize.STRING(50),
            allowNull: true,
            defaultValue: null,
            after: "type",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("messages", "role");
    },
};
