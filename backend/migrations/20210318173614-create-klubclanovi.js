'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('klubclanovi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pobjede: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      porazi: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      nerjeseno: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      od: {
        type: Sequelize.DATE,
        defaultValue:new Date()
      },
      //oni kojima je 
      do: {
        type: Sequelize.DATE,
        defaultValue:null
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('klubclanovi');
  }
};