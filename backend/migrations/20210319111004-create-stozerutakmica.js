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
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stozerutakmica');
  }
};