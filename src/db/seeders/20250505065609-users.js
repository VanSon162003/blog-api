"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = [];

        for (let i = 0; i < 20; i++) {
            users.push({
                name: faker.person.fullName(),
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                avatar: faker.image.avatar(),
                bio: faker.lorem.paragraph(),
                role: "user",
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert("users", users, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users", null, {});
    },
};
