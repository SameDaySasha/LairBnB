'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class Booking extends Model {
    static associate(models) {

      // Booking.belongsTo(models.Spot, {
      //   foreignKey: 'spotId',
      //   otherKey:'id'
      // });
      // Booking.belongsTo(models.User, {
      //   foreignKey: 'userId',
      //   otherKey:'id'
      // });
      Booking.hasOne(models.Spot,
        {foreignKey:'id',
          otherKey:'spotId'})

      Booking.hasOne(models.User,{
        foreignKey:'id',
        otherKey:'UserId'
      })
      // Booking.belongsTo(models.Spot, {
      //   foreignKey: 'id',
      //   onDelete: 'CASCADE',
      // });
      // Booking.belongsTo(models.User, {
      //   foreignKey: 'id',
      //   onDelete: 'CASCADE',
      // });
      // Add any additional associations as needed
    }
  }

  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Spot ID is required.',
          },
          isInt: {
            msg: 'Spot ID must be an integer.',
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'User ID is required.',
          },
          isInt: {
            msg: 'User ID must be an integer.',
          },
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Start date is required.',
          },
          isDate: {
            msg: 'Start date must be a valid date.',
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'End date is required.',
          },
          isDate: {
            msg: 'End date must be a valid date.',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      // tableName: 'bookings',
    }
  );

  return Booking;
};
