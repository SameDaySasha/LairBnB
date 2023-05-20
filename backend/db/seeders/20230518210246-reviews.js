'use strict';
/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');

let options = {};
options.tableName = 'Reviews'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(options, [
      {
        id: 1,
        userId: 1,
        spotId: 1,
        review: "Fantastic experience! The spot exceeded my expectations.",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 2,
        spotId: 2,
        review: "Great location and amenities. Highly recommend it.",
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        userId: 3,
        spotId: 3,
        review: "Average experience. The spot could use some improvements.",
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        userId: 4,
        spotId: 4,
        review: "Disappointing stay. The spot did not meet my expectations.",
        stars: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        userId: 5,
        spotId: 5,
        review: "Terrible experience. I do not recommend this spot.",
        stars: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options);
  }
};
