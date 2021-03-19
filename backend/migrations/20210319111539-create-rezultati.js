'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rezultati', {
      klub_id: {
        type: Sequelize.SMALLINT,
        primaryKey:true,
        references:{
          model: 'klub',
          key: 'id',
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      natjecanje_id: {
        type: Sequelize.SMALLINT,
        primaryKey:true,
        references:{
          model: 'natjecanje',
          key: 'id',
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      pobjede: {
        type: Sequelize.SMALLINT
      },
      porazi: {
        type: Sequelize.SMALLINT
      },
      nerjeseni: {
        type: Sequelize.SMALLINT
      },
      bodovi: {
        type: Sequelize.SMALLINT
      },
      gol_razlika: {
        type: Sequelize.SMALLINT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rezultati');
  }
};