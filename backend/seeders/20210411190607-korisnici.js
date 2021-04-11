'use strict';
const hash=require('../services/bcrypt.js');//funkcina za hashiranje passworda
module.exports = {
  up: async (queryInterface, Sequelize) => {
    let hashes=new Array(2);
    try {
      hashes[0]=await hash('password');
      hashes[1]=await hash('admin123');
    } catch (error) {
      console.log('Greška kod hashiranja passworda kod seedanja '+error);
      throw(error);
    }
    await queryInterface.bulkInsert('korisnici',[
      {
        "username":"admin1",
        "password":hashes[0],
        "maticni_broj":"1025039/524"
      },
      {
        "username":"admin2",
        "password":hashes[1],
        "maticni_broj":"1021379/5098"
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('korisnici',null,{});
  }
};
