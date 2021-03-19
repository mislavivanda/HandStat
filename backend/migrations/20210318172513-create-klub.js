'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('klub', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      drzava: {
        type: Sequelize.STRING
      },
      grad: {
        type: Sequelize.STRING
      },
      naziv: {
        type: Sequelize.STRING
      },
      osnutak: {
        type: Sequelize.STRING
      },
      image_path: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('klub');
  }
};