'use strict';
const { Model, DataTypes } = require('sequelize');



module.exports = (sequelize) => {

  class Image extends Model {
    static associate(models) {
      Image.belongsTo(models.Spot, {
        foreignKey: 'indexId',
        constraints: false,
        as: 'Spot',
        scope: {
          indexType: 'Spot',
        },
      });

      Image.belongsTo(models.Review, {
        foreignKey: 'indexId',
        constraints: false,
        as: 'Review',
        scope: {
          indexType: 'Review',
        },
      });
    }
  }

  Image.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Image URL is required.',
          },
          notEmpty: {
            msg: 'Image URL cannot be empty.',
          },
        },
      },
      previewImage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      type: {
        type: DataTypes.ENUM('jpg', 'jpeg', 'png'),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Image type is required.',
          },
          isIn: {
            args: [['jpg', 'jpeg', 'png']],
            msg: 'Image type must be either "jpg", "jpeg", or "png".',
          },
        },
      },
      indexId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      indexType: {
        type: DataTypes.ENUM('spot', 'review'),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Image',
    }
  );

  return Image;
};
