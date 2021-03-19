'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stozerutakmica', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      zuti: {
        type: Sequelize.SMALLINT
      },
      crveni: {
        type: Sequelize.SMALLINT
      },
      plavi: {
        type: Sequelize.SMALLINT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stozerutakmica');
  }
};