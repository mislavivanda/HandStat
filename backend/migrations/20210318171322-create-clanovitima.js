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
        type: Sequelize.SMALLINT,
        defaultValue:null
      },
      nacionalnost: {
        type: Sequelize.STRING
      },
      datum_rodenja: {
        type: Sequelize.DATE
      },
      visina: {
        type: Sequelize.SMALLINT,
        defaultValue:null
      },
      tezina: {
        type: Sequelize.SMALLINT,
        defaultValue:null
      },
      image_path: {
        type: Sequelize.STRING,
        defaultValue:null
      },
      rola: {//jeli igrac=1,golman=2,trener=3,sluzbeni predstavnik=4,tehniko=5 i fizio=6
        type: Sequelize.SMALLINT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clanovitima');
  }
};