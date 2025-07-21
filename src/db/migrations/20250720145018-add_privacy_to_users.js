"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("Users", "privacy", {
            type: Sequelize.JSON,
            allowNull: false,
            defaultValue: {
                profileVisibility: "public",
                showEmail: false,
                showFollowersCount: true,
                showFollowingCount: true,
                allowDirectMessages: true,
                showOnlineStatus: true,
            },
            after: "skills",
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("Users", "privacy");
    },
};
