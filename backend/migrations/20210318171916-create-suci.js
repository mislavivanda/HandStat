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
        type: Sequelize.STRING,
        defaultValue:null
      },
      broj_utakmica: {
        type: Sequelize.SMALLINT,
        defaultValue:1
      },
      prosjecna_ocjena: {
        type: Sequelize.FLOAT,
        defaultValue:0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('suci');
  }
};