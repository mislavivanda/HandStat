'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  await Promise.all([
    queryInterface.addColumn(
      'igracutakmica',
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
      'igracutakmica',
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
      'igracutakmica',
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
    await Promise.all[(
      queryInterface.removeColumn(
        'igracutakmica',
        'broj_utakmice'
      ),
      queryInterface.removeColumn(
        'igracutakmica',
        'maticni_broj'
      ),
      queryInterface.removeColumn(
        'igracutakmica',
        'klub_id'
      )
    )]
  }
};
