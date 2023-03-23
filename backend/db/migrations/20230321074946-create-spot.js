"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  // async up(queryInterface, Sequelize) {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "Spots",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        address: {
          allowNull: false,
          type: Sequelize.STRING(45),
        },
        city: {
          allowNull: false,
          type: Sequelize.STRING(30),
        },
        state: {
          allowNull: false,
          type: Sequelize.STRING(30),
        },
        country: {
          allowNull: false,
          type: Sequelize.STRING(30),
        },
        lat: {
          type: Sequelize.DECIMAL,
        },
        lng: {
          type: Sequelize.DECIMAL,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.STRING(400),
        },
        price: {
          allowNull: false,
          type: Sequelize.DECIMAL,
        },
        ownerId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: "Users",
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  // async down(queryInterface, Sequelize) {
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Spots";
    await queryInterface.dropTable(options);
  },
};