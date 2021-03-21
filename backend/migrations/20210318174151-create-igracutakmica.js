'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('igracutakmica', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      golovi: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      pokusaji: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      sedmerac_golovi: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      sedmerac_pokusaji: {
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
      tehnicke: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      asistencije: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('igracutakmica');
  }
};