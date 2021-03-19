'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dogadajiutakmice', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vrijeme: {
        type: Sequelize.STRING
      },
      tim: {//GOSTI ILI DOMACI-> 1 ILI 2 -> DA ZNAMO KOJU IKONU ISCRTAT
        type: Sequelize.SMALLINT
      },
      rez_domaci: {
        type: Sequelize.SMALLINT
      },
      rez_gosti: {
        type: Sequelize.SMALLINT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dogadajiutakmice');
  }
};