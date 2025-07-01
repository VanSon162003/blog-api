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

        await queryInterface.createTable("posts", {
            id: {
                type: Sequelize.INTEGER({
                    unsigned: true,
                }),
                primaryKey: true,
                autoIncrement: true,
            },
            topic_id: {
                type: Sequelize.INTEGER({
                    unsigned: true,
                }),
                allowNull: false,
                references: {
                    model: "topics",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            slug: {
                type: Sequelize.STRING,
                unique: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            author: {
                type: Sequelize.STRING,
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

        await queryInterface.dropTable("posts");
    },
};
