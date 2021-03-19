'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('suci', {
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
      nacionalnost: {
        type: Sequelize.STRING
      },
      datum_rodenja: {
        type: Sequelize.DATE
      },
      mjesto: {
        type: Sequelize.STRING
      },
      image_path: {
        type: Sequelize.STRING
      },
      broj_utakmica: {
        type: Sequelize.SMALLINT
      },
      prosjecna_ocjena: {
        type: Sequelize.FLOAT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('suci');
  }
};