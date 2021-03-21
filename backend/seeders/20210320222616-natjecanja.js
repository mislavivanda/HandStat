'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.bulkInsert('natjecanje',[
    {naziv:'Premijer liga(M)',sezona:'2020/21.'},
    {naziv:'EHF Liga prvaka(M)',sezona:'2020/21.'},
    {naziv:'1. HRL Jug(M)',sezona:'2020/21.'},
    {naziv:'1. HRL Sjever(M)',sezona:'2020/21.'},
   {naziv:'2. HRL Jug(M)',sezona:'2020/21.'},
   {naziv:'Prva liga(Ž)',sezona:'2020/21.'}
   ])
  },

  down: async (queryInterface, Sequelize) => {
 await queryInterface.bulkDelete('natjecanje',null,{});
  }
};
