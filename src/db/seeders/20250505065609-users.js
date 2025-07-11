"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
    async up(queryInterface, Sequelize) {
        const users = [];

        for (let i = 0; i < 10; i++) {
            users.push({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                two_factor_enabled: false,
                two_factor_secret: null,
                username: faker.internet.userName(),
                avatar: faker.image.avatar(),
                title: faker.person.jobTitle(),
                about: faker.lorem.sentences(),
                posts_count: 0,
                follower_count: 0,
                following_count: 0,
                likes_count: 0,
                address: faker.location.streetAddress(),
                website_url: faker.internet.url(),
                twitter_url: faker.internet.url(),
                github_url: faker.internet.url(),
                linkedin_url: faker.internet.url(),
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
