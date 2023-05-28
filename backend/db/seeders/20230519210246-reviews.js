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
    
        userId: 1,
        spotId: 1,
        review: "Fantastic experience! The spot exceeded my expectations.",
        stars: 5,
       
      },
      {
        
        userId: 2,
        spotId: 2,
        review: "Great location and amenities. Highly recommend it.",
        stars: 4,
      
      },
      {
     
        userId: 3,
        spotId: 3,
        review: "Average experience. The spot could use some improvements.",
        stars: 3,
     
      },
      {
       
        userId: 4,
        spotId: 4,
        review: "Disappointing stay. The spot did not meet my expectations.",
        stars: 2,
       
      },
      {
        id: 5,
        userId: 5,
        spotId: 5,
        review: "Terrible experience. I do not recommend this spot.",
        stars: 1,

      }
    ], options);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options);
  }
};
