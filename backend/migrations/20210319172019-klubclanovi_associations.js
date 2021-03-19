'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn(
        'klubclanovi',
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
        'klubclanovi',
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
      'klubclanovi',
      'maticni_broj'
    ),
    queryInterface.removeColumn(
      'klubclanovi',
      'klub_id'
    )
  ]);
  }
};
