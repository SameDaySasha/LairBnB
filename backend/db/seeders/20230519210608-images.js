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
        url: 'https://images-ext-2.discordapp.net/external/_KNBz3oa-u_yhz6zdtwKshcvsHwKMf5YtiNhoJIhPdg/https/cdn.mage.space/generate/0c3b42a6c0ff40b099626d2d9f4b3e08.png?width=1392&height=928',
        previewImage: true,
        // type: 'png',
        indexId: 1,
        indexType: 'Spot',
       
      },
      {
       
        url: 'https://images-ext-1.discordapp.net/external/gVSAvb0bgwegDY7WlgPebLzMmcj2WHNiyEqYQSW6u58/https/cdn.mage.space/generate/5539c2d6098742b782dd049f97f51e53.png?width=1638&height=928',
        previewImage: true,
        // type: 'png',
        indexId: 2,
        indexType: 'Spot',
        
      },
      {
   
        url: 'https://images-ext-2.discordapp.net/external/KkvsZu3urW18PwVlWyaXtR8cQ0xZ1WrA0-xkWE0u2gM/https/cdn.mage.space/generate/9ef816e875b44e578bcf80c7f3ac81d9.png?width=1638&height=928',
        previewImage: true,
        // type: 'png',
        indexId: 3,
        indexType: 'Spot',
       
      },
      {
      
        url: 'https://images-ext-1.discordapp.net/external/v1oql7Qvu0OdeXV1L_RYYzsGtv3MEjs3ViJ7L9MiFH8/https/cdn.mage.space/generate/adae90a9ab4746c5b75c55fce7ecccbc.png?width=1638&height=928',
        previewImage: true,
        // type: 'png',
        indexId: 4,
        indexType: 'Spot',
       
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options);
  }
};
