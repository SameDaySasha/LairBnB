'use strict';
const { Model, DataTypes, Op } = require('sequelize');

class Booking extends Model {
  static associate(models) {
    Booking.belongsTo(models.Spot, {
      foreignKey: 'spotId',
      onDelete: 'CASCADE',
    });
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  }

  static init(sequelize) {
    return super.init(
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
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Created date is required.',
            },
            isDate: {
              msg: 'Created date must be a valid date.',
            },
          },
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Updated date is required.',
            },
            isDate: {
              msg: 'Updated date must be a valid date.',
            },
          },
        },
      },
      {
        sequelize,
        modelName: 'Booking',
        tableName: 'bookings',
      }
    );
  }

  static associate(models) {
    Booking.belongsTo(models.Spot, {
      foreignKey: 'spotId',
      onDelete: 'CASCADE',
    });
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  }

  static init(sequelize) {
    return super.init(
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
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Created date is required.',
            },
            isDate: {
              msg: 'Created date must be a valid date.',
            },
          },
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'Updated date is required.',
            },
            isDate: {
              msg: 'Updated date must be a valid date.',
            },
          },
        },
      },
      {
        sequelize,
        modelName: 'Booking',
        tableName: 'bookings',
      }
    );
  }

  static async validateBookingConflict(startDate, endDate, spotId) {
    const existingBooking = await Booking.findOne({
      where: {
        spotId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
        ],
      },
    });

    if (existingBooking) {
      throw new Error('Booking conflict detected.');
    }
  }
}

module.exports = Booking;
