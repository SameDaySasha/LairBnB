'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      previewImage: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('jpg', 'jpeg', 'png'),
        allowNull: false,
      },
      indexId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      indexType: {
        type: Sequelize.ENUM('spot', 'review'),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // if (process.env.NODE_ENV === 'production') {
    //   await queryInterface.addIndex('Images', ['indexId', 'indexType']);
    // }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Images');
  },
};