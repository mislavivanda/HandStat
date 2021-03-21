'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.bulkInsert('suci',[
    {
      "maticni_broj":"1940779/892398",
      "nacionalnost":"Hrvatska",
      "mjesto":"Zagreb",
      "broj_utakmica":10,
      "prosjecna_ocjena":3.98,
      "ime": "Reuben",
      "prezime": "Craig",
      "datum_rodenja": "1996-02-16 01:50:39"
    },
    {
      "maticni_broj":"154179/892398",
      "nacionalnost":"Hrvatska",
      "mjesto":"Metković",
      "broj_utakmica":15,
      "prosjecna_ocjena":3.45,
      "ime": "Kermit",
      "prezime": "Roman",
      "datum_rodenja": "1991-09-27 07:27:36"
    },
    {
      "maticni_broj":"1653779/892398",
      "nacionalnost":"Hrvatska",
      "mjesto":"Split",
      "broj_utakmica":7,
      "prosjecna_ocjena":4.3,
      "ime": "Wade",
      "prezime": "Parks",
      "datum_rodenja": "1988-09-20 07:11:54"
    },
    {
      "maticni_broj":"1630779/89098",
      "nacionalnost":"Hrvatska",
      "mjesto":"Metković",
      "broj_utakmica":18,
      "prosjecna_ocjena":4.23,
      "ime": "Davis",
      "prezime": "Reynolds",
      "datum_rodenja": "1975-03-10 06:16:59"
    },
    {
      "maticni_broj":"1940693/892398",
      "nacionalnost":"Hrvatska",
      "mjesto":"Zagreb",
      "ime": "Dane",
      "prezime": "Knox",
      "datum_rodenja": "1993-01-13 14:59:33"
    },
    {
      "maticni_broj":"19408679/892398",
      "nacionalnost":"Hrvatska",
      "mjesto":"Split",
      "broj_utakmica":17,
      "prosjecna_ocjena":4.51,
      "ime": "Jerome",
      "prezime": "Keller",
      "datum_rodenja": "1982-01-04 07:49:47"
    },
    {
      "maticni_broj":"19403601/892398",
      "nacionalnost":"Hrvatska",
      "mjesto":"Dubrovnik",
      "ime": "Vaughan",
      "prezime": "Wilkinson",
      "datum_rodenja": "1997-01-22 14:32:36"
    },
   ])
  },

  down: async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('suci',null,{});
  }
};
