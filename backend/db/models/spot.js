"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        as: "previewImage",
      });
      Spot.hasMany(models.Booking, { foreignKey: "spotId" });
      Spot.hasMany(models.Review, { foreignKey: "spotId" });
      Spot.belongsToMany(models.User, {
        through: models.Review,
        otherKey: "userId",
        foreignKey: "spotId",
      }); 
      Spot.belongsToMany(models.User, {
        through: models.Booking,
        as: "owner",
        otherKey: "userId",
        foreignKey: "spotId",
      }); 
    }
  }
  Spot.init(
    {
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [5, 58],
        },
      },
      state: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [2, 2],
        },
      },
      country: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [4, 15],
        },
      },
      lat: {
        type: DataTypes.DECIMAL,
        validate: {
          len: [4, 10],
        },
      },
      lng: {
        type: DataTypes.DECIMAL,
        validate: {
          len: [4, 10],
        },
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          len: [5, 25],
        },
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          max: 400,
        },
      },
      price: {
        // minimum is 0
        allowNull: false,
        type: DataTypes.DECIMAL,
        validate: {
          min: 0,
        },
      },
      ownerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Spot",
      raw: true,
    }
  );
  return Spot;
};