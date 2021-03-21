'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('dogadaj',[
      {
        naziv:'Gol',
        tip:1
    },
    {
        naziv:'Obrana',
        tip:3
    },
    {
        naziv:'Promasaj',
        tip:3
    },
    {
        naziv:'Primljen pogodak',
        tip:3
    },
    {
        naziv:'Sedmerac pogodak',
        tip:1
    },
    {
        naziv:'Sedmerac obrana',
        tip:3
    },
    {
        naziv:'Sedmerac promasaj',
        tip:3
    },
    {
        naziv:'Sedmerac primljen',
        tip:3
    },
    {
        naziv:'Iskljucenje',
        tip:3
    },
    {
        naziv:'Asistencija',
        tip:3
    },
    {
        naziv:'Tehnicka',
        tip:3
    },
    {
        naziv:'Zuti karton',
        tip:3
    },
    {
        naziv:'Crveni karton',
        tip:3
    },
    {
        naziv:'Plavi karton',
        tip:3
    },
    {
        naziv:'Timeout domaći',
        tip:2
    },
    {
        naziv:'Timeout gosti',
        tip:2
    }
    ])
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.bulkDelete('dogadaj',null,{});
  }
};
