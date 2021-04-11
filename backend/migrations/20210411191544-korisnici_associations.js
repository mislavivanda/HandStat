'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'korisnici',
      'maticni_broj',
      {
        type:Sequelize.STRING,
        references:{
          model:'sluzbenoosoblje',
          key:'maticni_broj'
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('korisnici','maticni_broj');
  }
};
