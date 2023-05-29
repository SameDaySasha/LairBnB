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
        url: 'backend/Images/LavaCave.png',
        previewImage: true,
        // type: 'png',
        indexId: 1,
        indexType: 'Spot',
       
      },
      {
       
        url: 'backend/Images/smokeyCave.png',
        previewImage: true,
        // type: 'png',
        indexId: 2,
        indexType: 'Spot',
        
      },
      {
   
        url: 'backend/Images/celestialCave.png',
        previewImage: true,
        // type: 'png',
        indexId: 3,
        indexType: 'Spot',
       
      },
      {
      
        url: 'backend/Images/frostCave.png',
        previewImage: true,
        // type: 'png',
        indexId: 4,
        indexType: 'Spot',
       
      },
      {
        
        url: 'backend/Images/HalflingCave.png',
        previewImage: true,
        // type: 'png',
        indexId: 5,
        indexType: 'Spot',
        
      },
      {
       
        url: 'https://example.com/image6.png',
        previewImage: false,
        // type: 'png',
        indexId: 6,
        indexType: 'Spot',
       
      },
      {
       
        url: 'https://example.com/image7.png',
        previewImage: false,
        // type: 'png',
        indexId: 7,
        indexType: 'Spot',
       
      },
      {
        
        url: 'https://example.com/image8.png',
        previewImage: false,
        // type: 'png',
        indexId: 8,
        indexType: 'Spot',
     
      },
      {
      
        url: 'https://cdn.mage.space/generate/79b94f6f3dc94670a5998d78d58eae7a.png',
        previewImage: false,
        // type: 'png',
        indexId: 9,
        indexType: 'Review',
       
      },
      {
       
        url: 'https://cdn.mage.space/generate/ae20eeaef2c4467ca9ff219f9e6677f4.png',
        previewImage: false,
        // type: 'png',
        indexId: 10,
        indexType: 'Review',
       
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options);
  }
};
