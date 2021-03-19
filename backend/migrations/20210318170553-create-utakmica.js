'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('utakmica', {
      broj_utakmice: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      kolo: {
        type: Sequelize.SMALLINT
      },
      datum: {
        type: Sequelize.STRING
      },
      vrijeme: {
        type: Sequelize.STRING
      },
      gledatelji: {
        type: Sequelize.SMALLINT
      },
      rezultat_domaci: {
        type: Sequelize.SMALLINT
      },
      rezultat_gosti: {
        type: Sequelize.SMALLINT
      },
      sudac1_ocjena:{
        type:Sequelize.FLOAT
      },
      sudac2_ocjena:{
        type:Sequelize.FLOAT
      },
      status: {//pocetak,poluvreme,kraj...
        type: Sequelize.SMALLINT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('utakmica');
  }
};