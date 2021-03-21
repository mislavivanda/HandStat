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
        type: Sequelize.STRING,
        defaultValue:null
      },
      //1=nadzornik,2=zapisnicar,3=mjerac vremena,4=lijecnik, pristup ko admin imaju svi osim lijecnika
      rola: {
        type: Sequelize.SMALLINT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sluzbenoosoblje');
  }
};