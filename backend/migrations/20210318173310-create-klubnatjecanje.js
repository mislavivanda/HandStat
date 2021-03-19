'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('klubnatjecanje', {
      natjecanje_id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        references:{
          model: 'natjecanje',
          key: 'id',
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      klub_id: {
        type: Sequelize.INTEGER,
        primaryKey:true,
        references:{
          model: 'klub',
          key: 'id',
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('klubnatjecanje');
  }
};