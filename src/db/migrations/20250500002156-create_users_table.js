"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable("users", {
            id: {
                type: Sequelize.INTEGER({
                    unsigned: true,
                }),
                primaryKey: true,
                autoIncrement: true,
            },
            name: Sequelize.STRING,
            username: {
                type: Sequelize.STRING,
                unique: true,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
            },
            password: Sequelize.STRING,

            avatar: Sequelize.STRING,

            bio: Sequelize.TEXT,

            role: {
                type: Sequelize.ENUM("user", "admin"),
                defaultValue: "user",
            },

            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable("users");
    },
};
