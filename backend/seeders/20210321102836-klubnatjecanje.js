'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.bulkInsert('klubnatjecanje',[
    {
      "natjecanje_id":2,
      "klub_id":1
    },
    {
      "natjecanje_id":2,
      "klub_id":2
    }
  ])
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.bulkDelete('klubnatjecanje',null,{});
  }
};
