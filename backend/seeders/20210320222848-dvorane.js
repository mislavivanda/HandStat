'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('mjestodvorana',[
      {dvorana:'GŠD Sokolana',mjesto:'Kaštel Sućurac'},
      {dvorana:'ŠC Gripe',mjesto:'Split'},
      {dvorana:'Spaladium arena',mjesto:'Split'}
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('mjestodvorana',null,{});
  }
};
