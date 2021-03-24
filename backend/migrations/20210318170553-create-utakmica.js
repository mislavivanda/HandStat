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
        type: Sequelize.DATE
      },
      vrijeme: {
        type: Sequelize.DATE
      },
      gledatelji: {
        type: Sequelize.SMALLINT
      },
      rezultat_domaci: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      rezultat_gosti: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      sudac1_ocjena:{
        type:Sequelize.FLOAT,
        defaultValue:0
      },
      sudac2_ocjena:{
        type:Sequelize.FLOAT,
        defaultValue:0
      },
      status: {//nije jos pocelo ali upisano=1,igra=2,pauza=3,kraj=4
        type: Sequelize.SMALLINT,
        defaultValue:1
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('utakmica');
  }
};