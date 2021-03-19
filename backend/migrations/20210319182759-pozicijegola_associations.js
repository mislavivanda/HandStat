'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await Promise.all([
     queryInterface.addColumn(
       'pozicijegola',
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
       'pozicijegola',
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
       'pozicijegola',
       'dogadaj_id',
       {
        type: Sequelize.INTEGER,
      references: {
        model: 'dogadaj' ,
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
      'pozicijegola',
      'broj_utakmice'
    ),
    queryInterface.removeColumn(
      'pozicijegola',
      'maticni_broj'
    ),
    queryInterface.removeColumn(
      'pozicijegola',
      'dogadaj_id'
    )
  ]);
  }
};
