'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await Promise.all([
     queryInterface.addColumn(
      'stozerutakmica',
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
      'stozerutakmica',
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
      'stozerutakmica',
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
        'stozerutakmica',
        'broj_utakmice'
      ),
      queryInterface.removeColumn(
        'stozerutakmica',
        'maticni_broj'
      ),
      queryInterface.removeColumn(
        'stozerutakmica',
        'klub_id'
      )
    ])
  }
};
