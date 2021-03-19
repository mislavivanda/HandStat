'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([queryInterface.addColumn(
      'utakmica', // name of the Source model/table
      "natjecanje_id", // name of the key to be added
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'natjecanje' ,
          key:'id',
        },
        onUpdate: "CASCADE",//kada se promijeni vrijednost PK u tablici subjects onda ce se vrijednost fk u tablici topics automatski updateati s novom vrijednosti
        onDelete: "SET NULL",//kada se izbirse redak sa primarnin kljucen koji se nalazi kao FK u tblici topics onda će se na njegovim mjestima di se on pojavljuje u tablici topics staviti null
      }
    ),
   queryInterface.addColumn(
      'utakmica', // name of the Source model/table
      "mjesto_id", // name of the key to be added
      {
        type: Sequelize.INTEGER,
        references: {
          model: "mjestodvorana", // name of the Target model/table
          key: "id", // key/field in the Target table
        },
        onUpdate: "CASCADE",//kada se promijeni vrijednost PK u tablici subjects onda ce se vrijednost fk u tablici topics automatski updateati s novom vrijednosti
        onDelete: "SET NULL",//kada se izbirse redak sa primarnin kljucen koji se nalazi kao FK u tblici topics onda će se na njegovim mjestima di se on pojavljuje u tablici topics staviti null
      }
    ),
    queryInterface.addColumn(
      'utakmica', // name of the Source model/table
      "nadzornik_id", // name of the key to be added
      {
        type: Sequelize.STRING,
        references: {
          model: "sluzbenoosoblje", // name of the Target model/table
          key: "maticni_broj", // key/field in the Target table
        },
        onUpdate: "CASCADE",//kada se promijeni vrijednost PK u tablici subjects onda ce se vrijednost fk u tablici topics automatski updateati s novom vrijednosti
        onDelete: "SET NULL",//kada se izbirse redak sa primarnin kljucen koji se nalazi kao FK u tblici topics onda će se na njegovim mjestima di se on pojavljuje u tablici topics staviti null
      }
    ),
    queryInterface.addColumn(
      'utakmica', // name of the Source model/table
      "lijecnik_id", // name of the key to be added
      {
        type: Sequelize.STRING,
        references: {
          model: "sluzbenoosoblje", // name of the Target model/table
          key: "maticni_broj", // key/field in the Target table
        },
        onUpdate: "CASCADE",//kada se promijeni vrijednost PK u tablici subjects onda ce se vrijednost fk u tablici topics automatski updateati s novom vrijednosti
        onDelete: "SET NULL",//kada se izbirse redak sa primarnin kljucen koji se nalazi kao FK u tblici topics onda će se na njegovim mjestima di se on pojavljuje u tablici topics staviti null
      }
    ),
    queryInterface.addColumn(
      'utakmica', // name of the Source model/table
      "zapisnicar_id", // name of the key to be added
      {
        type: Sequelize.STRING,
        references: {
          model: "sluzbenoosoblje", // name of the Target model/table
          key: "maticni_broj", // key/field in the Target table
        },
        onUpdate: "CASCADE",//kada se promijeni vrijednost PK u tablici subjects onda ce se vrijednost fk u tablici topics automatski updateati s novom vrijednosti
        onDelete: "SET NULL",//kada se izbirse redak sa primarnin kljucen koji se nalazi kao FK u tblici topics onda će se na njegovim mjestima di se on pojavljuje u tablici topics staviti null
      }
    ),
    queryInterface.addColumn(
      'utakmica', // name of the Source model/table
      "mjvremena_id", // name of the key to be added
      {
        type: Sequelize.STRING,
        references: {
          model: "sluzbenoosoblje", // name of the Target model/table
          key: "maticni_broj", // key/field in the Target table
        },
        onUpdate: "CASCADE",//kada se promijeni vrijednost PK u tablici subjects onda ce se vrijednost fk u tablici topics automatski updateati s novom vrijednosti
        onDelete: "SET NULL",//kada se izbirse redak sa primarnin kljucen koji se nalazi kao FK u tblici topics onda će se na njegovim mjestima di se on pojavljuje u tablici topics staviti null
      }
    ),
    queryInterface.addColumn(
      'utakmica', // name of the Source model/table
      "sudac1_id", // name of the key to be added
      {
        type: Sequelize.STRING,
        references: {
          model: "suci", // name of the Target model/table
          key: "maticni_broj", // key/field in the Target table
        },
        onUpdate: "CASCADE",//kada se promijeni vrijednost PK u tablici subjects onda ce se vrijednost fk u tablici topics automatski updateati s novom vrijednosti
        onDelete: "SET NULL",//kada se izbirse redak sa primarnin kljucen koji se nalazi kao FK u tblici topics onda će se na njegovim mjestima di se on pojavljuje u tablici topics staviti null
      }
    ),
    queryInterface.addColumn(
      'utakmica', // name of the Source model/table
      "sudac2_id", // name of the key to be added
      {
        type: Sequelize.STRING,
        references: {
          model: "suci", // name of the Target model/table
          key: "maticni_broj", // key/field in the Target table
        },
        onUpdate: "CASCADE",//kada se promijeni vrijednost PK u tablici subjects onda ce se vrijednost fk u tablici topics automatski updateati s novom vrijednosti
        onDelete: "SET NULL",//kada se izbirse redak sa primarnin kljucen koji se nalazi kao FK u tblici topics onda će se na njegovim mjestima di se on pojavljuje u tablici topics staviti null
      }
    ),
    queryInterface.addColumn(
      'utakmica', // name of the Source model/table
      "domaci_id", // name of the key to be added
      {
        type: Sequelize.INTEGER,
        references: {
          model: "klub", // name of the Target model/table
          key: "id", // key/field in the Target table
        },
        onUpdate: "CASCADE",//kada se promijeni vrijednost PK u tablici subjects onda ce se vrijednost fk u tablici topics automatski updateati s novom vrijednosti
        onDelete: "SET NULL",//kada se izbirse redak sa primarnin kljucen koji se nalazi kao FK u tblici topics onda će se na njegovim mjestima di se on pojavljuje u tablici topics staviti null
      }
    ),
    queryInterface.addColumn(
      'utakmica', // name of the Source model/table
      "gosti_id", // name of the key to be added
      {
        type: Sequelize.INTEGER,
        references: {
          model: "klub", // name of the Target model/table
          key: "id", // key/field in the Target table
        },
        onUpdate: "CASCADE",//kada se promijeni vrijednost PK u tablici subjects onda ce se vrijednost fk u tablici topics automatski updateati s novom vrijednosti
        onDelete: "SET NULL",//kada se izbirse redak sa primarnin kljucen koji se nalazi kao FK u tblici topics onda će se na njegovim mjestima di se on pojavljuje u tablici topics staviti null
      }
    )]);

  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([queryInterface.removeColumn(
      "utakmica", // name of Source model
      "natjecanje_id" // key we want to remove
    ),
    queryInterface.removeColumn(
      "utakmica", // name of Source model
      "mjesto_id" // key we want to remove
    ),
    queryInterface.removeColumn(
      "utakmica", // name of Source model
      "nadzornik_id" // key we want to remove
    ),
    queryInterface.removeColumn(
      "utakmica", // name of Source model
      "lijecnik_id" // key we want to remove
    ),
    queryInterface.removeColumn(
      "utakmica", // name of Source model
      "zapisnicar_id" // key we want to remove
    ),
    queryInterface.removeColumn(
      "utakmica", // name of Source model
      "mjvremena_id" // key we want to remove
    ),
    queryInterface.removeColumn(
      "utakmica", // name of Source model
      "sudac1_id" // key we want to remove
    ),
    queryInterface.removeColumn(
      "utakmica", // name of Source model
      "sudac2_id" // key we want to remove
    ),
    queryInterface.removeColumn(
      "utakmica", // name of Source model
      "domaci_id" // key we want to remove
    ),
    queryInterface.removeColumn(
      "utakmica", // name of Source model
      "gosti_id" // key we want to remove
    )
  ]);
  }
};
