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
        type: Sequelize.SMALLINT
      },
      primljeni_ukupno: {
        type: Sequelize.SMALLINT
      },
      sedmerac_obrane: {
        type: Sequelize.SMALLINT
      },
      sedmerac_primljeni: {
        type: Sequelize.SMALLINT
      },
      iskljucenja: {
        type: Sequelize.SMALLINT
      },
      zuti: {
        type: Sequelize.SMALLINT
      },
      crveni: {
        type: Sequelize.SMALLINT
      },
      plavi: {
        type: Sequelize.SMALLINT
      },
      golovi: {
        type: Sequelize.SMALLINT
      },
      pokusaji: {
        type: Sequelize.SMALLINT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('golmanutakmica');
  }
};