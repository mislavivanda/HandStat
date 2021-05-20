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
    },
    {
      "natjecanje_id":3,
      "klub_id":3
    },
    {
      "natjecanje_id":3,
      "klub_id":4
    },
    {
      "natjecanje_id":4,
      "klub_id":5
    },
    {
      "natjecanje_id":4,
      "klub_id":6
    }
  ])
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.bulkDelete('klubnatjecanje',null,{});
  }
};
