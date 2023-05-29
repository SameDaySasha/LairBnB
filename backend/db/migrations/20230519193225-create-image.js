'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
options.tableName = 'Images'
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(options, {
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
        allowNull:true,
      },
      indexId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      indexType: {
        type: Sequelize.ENUM('Spot', 'Review'),
        allowNull: true,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    },options);

    // if (process.env.NODE_ENV === 'production') {
    //   await queryInterface.addIndex('Images', ['indexId', 'indexType']);
    // }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(options);
  },
};
