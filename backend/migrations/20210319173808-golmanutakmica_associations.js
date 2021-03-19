'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn(
        'golmanutakmica',
        'broj_utakmice',
        {
          type: Sequelize.STRING,
        references: {
          model: 'utakmica' ,
          key:'broj_utakmice',
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
      ),
      queryInterface.addColumn(
        'golmanutakmica',
        'maticni_broj',
        {
          type: Sequelize.STRING,
        references: {
          model: 'clanovitima' ,
          key:'maticni_broj',
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
      ),
      queryInterface.addColumn(
        'golmanutakmica',
        'klub_id',
        {
          type: Sequelize.INTEGER,
        references: {
          model: 'klub' ,
          key:'id',
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn(
        'golmanutakmica',
        'broj_utakmice'
      ),
      queryInterface.removeColumn(
        'golmanutakmica',
        'maticni_broj'
      ),
      queryInterface.removeColumn(
        'golmanutakmica',
        'klub_id'
      )
    ])
  }
};
