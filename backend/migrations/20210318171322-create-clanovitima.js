'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clanovitima', {
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
      broj_dresa: {
        type: Sequelize.SMALLINT
      },
      nacionalnost: {
        type: Sequelize.STRING
      },
      datum_rodenja: {
        type: Sequelize.DATE
      },
      visina: {
        type: Sequelize.SMALLINT
      },
      tezina: {
        type: Sequelize.SMALLINT
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
    await queryInterface.dropTable('clanovitima');
  }
};