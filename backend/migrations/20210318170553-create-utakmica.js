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
      minuta:{
        type: Sequelize.SMALLINT,
        defaultValue:1
      },
      sudac1_ocjena:{
        type:Sequelize.FLOAT,
        defaultValue:0
      },
      sudac2_ocjena:{
        type:Sequelize.FLOAT,
        defaultValue:0
      },
      status: {//nije jos pocelo ali upisano=1,igra=2,poluvreme=3,4=drugo poluvreme,5=kraj->kada se spremi i zavrsi utakmica
        type: Sequelize.SMALLINT,
        defaultValue:1
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('utakmica');
  }
};