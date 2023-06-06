'use strict';
const { Model, DataTypes } = require('sequelize');
const database = require('../../config/database');

module.exports = (sequelize) => {
  class Spot extends Model {
    static associate(models) {
    Spot.hasMany(
      models.Booking,{
        foreignKey:'spotId',
        otherKey:'id'
      }
    )
    Spot.hasMany(
      models.Review,{
        foreignKey:'spotId',
        otherKey:'id',
        onDelete:'CASCADE',
        hooks:true
      }
    )
   Spot.hasMany(
    models.Image, {
      foreignKey:'indexId',
      constraints:false,
      scope:{
        indexType:'Spot'
      },
      as:'SpotImages'
    }
   )
   Spot.belongsTo(models.User,{
    foreignKey:'ownerId',
    as:'Owner'
  });



      // Spot.belongsTo(models.User, {
      //   foreignKey: 'id',
      
      // });
      // Spot.hasMany(models.Review, {
      //   foreignKey: 'spotId',
      //   otherKey:'id',
        
      // });
      // Spot.hasMany(models.Review,{
      //   foreignKey:'spotId',
      // })
      // Add any additional associations as needed
    }
  }

  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
        },
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
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
      previewImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );

  return Spot;
};
