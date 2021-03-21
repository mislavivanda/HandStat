'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('golmanutakmica', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      obrane_ukupno: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      primljeni_ukupno: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      sedmerac_obrane: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      sedmerac_primljeni: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      iskljucenja: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      zuti: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      crveni: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      plavi: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      golovi: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      pokusaji: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('golmanutakmica');
  }
};