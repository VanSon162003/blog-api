"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("Users", "privacy", {
            type: Sequelize.JSON,
            allowNull: true,
            after: "skills",
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("Users", "privacy");
    },
};
