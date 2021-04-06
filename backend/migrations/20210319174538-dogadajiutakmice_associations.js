'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await Promise.all([
     queryInterface.addColumn(
       'dogadajiutakmice',
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
       'dogadajiutakmice',
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
     ),
     queryInterface.addColumn(
       'dogadajiutakmice',
       'maticni_broj',
       {
       type: Sequelize.STRING,
       references: {
         model: 'clanovitima' ,
         key:'maticni_broj',
       },
       onUpdate: "CASCADE",
       onDelete: "SET NULL",
       allowNull: true
     }
     )
   ])
  },

  down: async (queryInterface, Sequelize) => {
   await Promise.all([
     queryInterface.removeColumn(
       'dogadajiutakmice',
       'broj_utakmice'
     ),
     queryInterface.removeColumn(
       'dogadajiutakmice',
       'dogadaj_id'
     ),
     queryInterface.removeColumn(
       'dogadajiutakmice',
       'maticni_broj'
     )
   ])
  }
};
