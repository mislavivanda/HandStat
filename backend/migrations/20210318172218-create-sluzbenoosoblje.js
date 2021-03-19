'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sluzbenoosoblje', {
      maticni_broj: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      ime: {
        type: Sequelize.STRING
      },
      prezime: {
        type: Sequelize.STRING
      },
      datum_rodenja: {
        type: Sequelize.DATE
      },
      image_path: {
        type: Sequelize.STRING
      },
      rola: {
        type: Sequelize.SMALLINT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sluzbenoosoblje');
  }
};