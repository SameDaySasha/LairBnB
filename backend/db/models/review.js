'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
      });
      Review.belongsTo(models.Spot, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
      });
    }
  }

  Review.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'User ID is required.',
          },
        },
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Spot ID is required.',
          },
        },
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Review is required.',
          },
          len: {
            args: [1, 500],
            msg: 'Review must be between 1 and 500 characters.',
          },
        },
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Stars is required.',
          },
          min: {
            args: 1,
            msg: 'Stars must be at least 1.',
          },
          max: {
            args: 5,
            msg: 'Stars cannot exceed 5.',
          },
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );

  return Review;
};
