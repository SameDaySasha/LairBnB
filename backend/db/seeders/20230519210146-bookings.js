'use strict';
/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');

let options = {};
console.log("===================================================1")
options.tableName = 'Bookings'
// console.log(`${Bookings}`)
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

console.log("===================================================1")
module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx bookings seeder complete xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ')
    return queryInterface.bulkInsert(options,[
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-07'),
      
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2023-07-10'),
        endDate: new Date('2023-07-15'),
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date('2023-08-20'),
        endDate: new Date('2023-08-25'),
      },
      {
        spotId: 4,
        userId: 4,
        startDate: new Date('2023-09-05'),
        endDate: new Date('2023-09-10'),
      },
      {
        spotId: 5,
        userId: 5,
        startDate: new Date('2023-10-15'),
        endDate: new Date('2023-10-20'),

      },
    ],options);
  },

  down: async (queryInterface, Sequelize) => {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx bookings async complete xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ')
    return queryInterface.bulkDelete(options);
  }
};
