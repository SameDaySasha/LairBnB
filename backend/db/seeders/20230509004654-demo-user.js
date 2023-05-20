'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
 
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Smaug',
        lastName: 'The Magnificent',
        email: 'smaug@dragon.io',
        username: 'Smaug',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Drogon',
        lastName: 'Blackfyre',
        email: 'drogon@dragon.io',
        username: 'Drogon',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Toothless',
        lastName: 'Night Fury',
        email: 'toothless@dragon.io',
        username: 'Toothless',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Spyro',
        lastName: 'Firestarter',
        email: 'spyro@dragon.io',
        username: 'Spyro',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Falkor',
        lastName: 'Luckdragon',
        email: 'falkor@dragon.io',
        username: 'Falkor',
        hashedPassword: bcrypt.hashSync('password5')
      },
      // {
      //   firstName: 'Viserion',
      //   lastName: 'Icefire',
      //   email: 'viserion@dragon.io',
      //   username: 'Viserion',
      //   hashedPassword: bcrypt.hashSync('password6')
      // },
      // {
      //   firstName: 'Norberta',
      //   lastName: 'Hagrid',
      //   email: 'norberta@dragon.io',
      //   username: 'Norberta',
      //   hashedPassword: bcrypt.hashSync('password7')
      // },
      // {
      //   firstName: 'Saphira',
      //   lastName: 'Eragon',
      //   email: 'saphira@dragon.io',
      //   username: 'Saphira',
      //   hashedPassword: bcrypt.hashSync('password8')
      // },
      // {
      //   firstName: 'Mushu',
      //   lastName: 'Fa Mulan',
      //   email: 'mushu@dragon.io',
      //   username: 'Mushu',
      //   hashedPassword: bcrypt.hashSync('password9')
      // },
      // {
      //   firstName: 'Charizard',
      //   lastName: 'Pokemon',
      //   email: 'charizard@dragon.io',
      //   username: 'Charizard',
      //   hashedPassword: bcrypt.hashSync('password10')
      // }
    ],);
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Smaug', 'Drogon', 'Toothless', 'Spyro', 'Falkor', 'Viserion', 'Norberta', 'Saphira', 'Mushu', 'Charizard'] }
    }, {});
  }
};
