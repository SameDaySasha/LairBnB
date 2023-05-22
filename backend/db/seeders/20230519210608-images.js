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
    await queryInterface.bulkInsert(options.tableName, [
      {
        id: 1,
        url: '/Users/alexflorea/Desktop/Classwork/Project_Alpha/LairBnB/backend/Images/BeachCave.png',
        previewImage: true,
        type: 'png',
        indexId: 1,
        indexType: 'spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        url: '/Users/alexflorea/Desktop/Classwork/Project_Alpha/LairBnB/backend/Images/celestialCave.png',
        previewImage: false,
        type: 'png',
        indexId: 2,
        indexType: 'spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        url: '/Users/alexflorea/Desktop/Classwork/Project_Alpha/LairBnB/backend/Images/DruidCove.png',
        previewImage: true,
        type: 'png',
        indexId: 3,
        indexType: 'spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        url: '/images/FeyLair.png',
        previewImage: false,
        type: 'png',
        indexId: 4,
        indexType: 'spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        url: 'https://example.com/image5.jpg',
        previewImage: true,
        type: 'png',
        indexId: 5,
        indexType: 'spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        url: 'https://example.com/image6.jpg',
        previewImage: true,
        type: 'png',
        indexId: 6,
        indexType: 'spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        url: 'https://example.com/image7.jpg',
        previewImage: true,
        type: 'png',
        indexId: 7,
        indexType: 'spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        url: 'https://example.com/image8.jpg',
        previewImage: true,
        type: 'png',
        indexId: 8,
        indexType: 'spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        url: 'https://cdn.mage.space/generate/79b94f6f3dc94670a5998d78d58eae7a.png',
        previewImage: true,
        type: 'png',
        indexId: 9,
        indexType: 'spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        url: 'https://cdn.mage.space/generate/ae20eeaef2c4467ca9ff219f9e6677f4.png',
        previewImage: true,
        type: 'png',
        indexId: 10,
        indexType: 'spot',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options.tableName);
  }
};
