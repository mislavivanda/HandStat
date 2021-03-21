'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.bulkInsert('klub',[
    {naziv:'RK PPD Zagreb',drzava:'Hrvatska',grad:'Zagreb',osnutak:'1945.'},
    {naziv:'RK Barcelona',drzava:'Spanjolska',grad:'Barcelona',osnutak:'1945.'},
     {naziv:'RK Split',drzava:'Hrvatska',grad:'Split',osnutak:'1945.'},
     {naziv:'RK Varaždin',drzava:'Hrvatska',grad:'Varaždin',osnutak:'1945.'},
     {naziv:'RK Bjelovar',drzava:'Hrvatska',grad:'Bjelovar',osnutak:'1945.'},
     {naziv:'RK Poreč',drzava:'Hrvatska',grad:'Poreč',osnutak:'1945.'},
  ])
  },

  down: async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('klub',null,{});
  }
};
