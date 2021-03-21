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
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      porazi: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      nerjeseni: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      bodovi: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      },
      gol_razlika: {
        type: Sequelize.SMALLINT,
        defaultValue:0
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rezultati');
  }
};