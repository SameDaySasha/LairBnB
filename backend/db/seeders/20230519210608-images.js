'use strict';
/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');

let options = {};
options.tableName = 'Images'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(options, [
      {
        id: 1,
        url: 'backend/Images/LavaCave.png',
        previewImage: true,
        // type: 'png',
        indexId: 1,
        indexType: 'Spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        url: 'backend/Images/smokeyCave.png',
        previewImage: true,
        // type: 'png',
        indexId: 2,
        indexType: 'Spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        url: 'backend/Images/celestialCave.png',
        previewImage: true,
        // type: 'png',
        indexId: 3,
        indexType: 'Spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        url: 'backend/Images/frostCave.png',
        previewImage: true,
        // type: 'png',
        indexId: 4,
        indexType: 'Spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        url: 'backend/Images/HalflingCave.png',
        previewImage: true,
        // type: 'png',
        indexId: 5,
        indexType: 'Spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        url: 'https://example.com/image6.png',
        previewImage: false,
        // type: 'png',
        indexId: 6,
        indexType: 'Spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        url: 'https://example.com/image7.png',
        previewImage: false,
        // type: 'png',
        indexId: 7,
        indexType: 'Spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        url: 'https://example.com/image8.png',
        previewImage: false,
        // type: 'png',
        indexId: 8,
        indexType: 'Spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        url: 'https://cdn.mage.space/generate/79b94f6f3dc94670a5998d78d58eae7a.png',
        previewImage: false,
        // type: 'png',
        indexId: 9,
        indexType: 'Spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        url: 'https://cdn.mage.space/generate/ae20eeaef2c4467ca9ff219f9e6677f4.png',
        previewImage: false,
        // type: 'png',
        indexId: 10,
        indexType: 'Spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options);
  }
};
