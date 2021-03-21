'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.bulkInsert('sluzbenoosoblje',
    [
      {
        "maticni_broj":"1021069/52398",
        "rola":1,
        "ime": "Reed",
        "prezime": "Garrett",
        "datum_rodenja": "1984-10-08 14:05:22"
      },
      {
        "maticni_broj":"1021379/5098",
        "rola":1,
        "ime": "Wang",
        "prezime": "Schwartz",
        "datum_rodenja": "1977-08-16 20:42:45"
      },
      {
        "maticni_broj":"1025039/524",
        "rola":1,
        "ime": "Lane",
        "prezime": "Bartlett",
        "datum_rodenja": "1988-11-13 06:47:18"
      },
      {
        "maticni_broj":"70360779/52398",
        "rola":1,
        "ime": "Quentin",
        "prezime": "Wallace",
        "datum_rodenja": "1981-12-11 15:11:10"
      },
      {
        "maticni_broj":"1020002/53698",
        "rola":1,
        "ime": "Melvin",
        "prezime": "Cantu",
        "datum_rodenja": "1990-03-06 02:25:56"
      },
      {
        "maticni_broj":"100369/523",
        "rola":2,
        "ime": "Ahmed",
        "prezime": "Hoover",
        "datum_rodenja": "1989-07-25 14:10:43"
      },
      {
        "maticni_broj":"132607/52333",
        "rola":2,
        "ime": "Wesley",
        "prezime": "Warner",
        "datum_rodenja": "1999-06-17 14:16:43"
      },
      {
        "maticni_broj":"108900/52398",
        "rola":2,
        "ime": "Steel",
        "prezime": "Vargas",
        "datum_rodenja": "1991-04-13 09:34:51"
      },
      {
        "maticni_broj":"102149/52336",
        "rola":2,
        "ime": "Justin",
        "prezime": "Castaneda",
        "datum_rodenja": "1981-10-11 09:07:04"
      },
      {
        "maticni_broj":"1029/52303",
        "rola":2,
        "ime": "Matthew",
        "prezime": "Chen",
        "datum_rodenja": "1977-08-16 18:32:32"
      },
      {
        "maticni_broj":"41020779/52398",
        "rola":2,
        "ime": "Zeph",
        "prezime": "Velazquez",
        "datum_rodenja": "1994-05-08 18:59:49"
      },
      {
        "maticni_broj":"1420244/52398",
        "rola":3,
        "ime": "Samson",
        "prezime": "Farmer",
        "datum_rodenja": "1989-04-09 13:57:06"
      },
      {
        "maticni_broj":"478963/52398",
        "rola":3,
        "ime": "Zahir",
        "prezime": "Walter",
        "datum_rodenja": "1990-02-16 23:44:41"
      },
      {
        "maticni_broj":"4456779/52398",
        "rola":3,
        "ime": "Ferdinand",
        "prezime": "Compton",
        "datum_rodenja": "1983-11-05 12:45:05"
      },
      {
        "maticni_broj":"1020779/44398",
        "rola":4,
        "ime": "Macon",
        "prezime": "Hardy",
        "datum_rodenja": "1990-11-15 07:21:17"
      },
      {
        "maticni_broj":"140779/892398",
        "rola":4,
        "ime": "Wayne",
        "prezime": "Saunders",
        "datum_rodenja": "1976-04-05 09:53:40"
      },
   ])
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.bulkDelete('sluzbenoosoblje',null,{});
  }
};
