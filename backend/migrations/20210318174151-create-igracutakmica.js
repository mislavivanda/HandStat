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
        type: Sequelize.SMALLINT
      },
      pokusaji: {
        type: Sequelize.SMALLINT
      },
      sedmerac_golovi: {
        type: Sequelize.SMALLINT
      },
      sedmerac_pokusaji: {
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
      tehnicke: {
        type: Sequelize.SMALLINT
      },
      asistencije: {
        type: Sequelize.SMALLINT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('igracutakmica');
  }
};