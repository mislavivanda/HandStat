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
        type: Sequelize.SMALLINT
      },
      porazi: {
        type: Sequelize.SMALLINT
      },
      nerjeseno: {
        type: Sequelize.SMALLINT
      },
      od: {
        type: Sequelize.DATE
      },
      //oni kojima je 
      do: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('klubclanovi');
  }
};