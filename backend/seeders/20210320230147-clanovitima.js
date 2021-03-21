'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('clanovitima',
      [
        {
          "maticni_broj":"159/523",
          "rola":1,
          "ime": "Herrod",
          "prezime": "Wiley",
          "broj_dresa": 10,
          "datum_rodenja": "1993-03-22 17:30:07",
          "visina": 185,
          "tezina": 81,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"159/5238",
          "rola":1,
          "ime": "Brandon",
          "prezime": "Gordon",
          "broj_dresa": 6,
          "datum_rodenja": "1992-03-31 09:54:22",
          "visina": 190,
          "tezina": 104,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1579/523",
          "rola":1,
          "ime": "Jackson",
          "prezime": "Park",
          "broj_dresa": 8,
          "datum_rodenja": "1996-08-23 04:54:47",
          "visina": 189,
          "tezina": 97,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1509/523",
          "rola":1,
          "ime": "Matthew",
          "prezime": "Gould",
          "broj_dresa": 9,
          "datum_rodenja": "1975-07-27 22:02:14",
          "visina": 189,
          "tezina": 94,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1579/503",
          "rola":1,
          "ime": "Macaulay",
          "prezime": "Macias",
          "broj_dresa": 3,
          "datum_rodenja": "1976-07-06 20:38:39",
          "visina": 197,
          "tezina": 98,
          "nacionalnost": "Mađarska"
        },
        {
          "maticni_broj":"1989/523",
          "rola":1,
          "ime": "Cedric",
          "prezime": "Pollard",
          "broj_dresa": 14,
          "datum_rodenja": "1982-10-23 13:31:18",
          "visina": 183,
          "tezina": 113,
          "nacionalnost": "Slovenija"
        },
        {
          "maticni_broj":"15779/523",
          "rola":2,
          "ime": "Elliott",
          "prezime": "Mitchell",
          "broj_dresa": 7,
          "datum_rodenja": "1992-11-04 20:45:45",
          "visina": 197,
          "tezina": 91,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1479/523",
          "rola":2,
          "ime": "Eaton",
          "prezime": "Vaughn",
          "broj_dresa": 2,
          "datum_rodenja": "1993-09-17 21:19:11",
          "visina": 194,
          "tezina": 108,
          "nacionalnost": "Srbija"
        },
        {
          "maticni_broj":"15419/523",
          "rola":1,
          "ime": "Lewis",
          "prezime": "Ramirez",
          "broj_dresa": 8,
          "datum_rodenja": "1990-03-04 13:33:34",
          "visina": 205,
          "tezina": 100,
          "nacionalnost": "Mađarska"
        },
        {
          "maticni_broj":"15700/523",
          "rola":2,
          "ime": "Kato",
          "prezime": "Lyons",
          "broj_dresa": 4,
          "datum_rodenja": "1989-03-23 04:54:16",
          "visina": 183,
          "tezina": 99,
          "nacionalnost": "Spanjolska"
        },
        {
          "maticni_broj":"15710/523",
          "rola":2,
          "ime": "Finn",
          "prezime": "Blair",
          "broj_dresa": 2,
          "datum_rodenja": "1980-04-02 14:05:48",
          "visina": 188,
          "tezina": 120,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"15763/523",
          "rola":1,
          "ime": "Addison",
          "prezime": "Joyner",
          "broj_dresa": 1,
          "datum_rodenja": "1976-12-20 03:01:00",
          "visina": 186,
          "tezina": 109,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"11029/523",
          "rola":2,
          "ime": "Bernard",
          "prezime": "Monroe",
          "broj_dresa": 18,
          "datum_rodenja": "1988-10-20 19:33:14",
          "visina": 191,
          "tezina": 104,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1570478930/523",
          "rola":1,
          "ime": "Rooney",
          "prezime": "Roach",
          "broj_dresa": 2,
          "datum_rodenja": "1995-12-26 04:00:16",
          "visina": 194,
          "tezina": 102,
          "nacionalnost": "Mađarska"
        },
        {
          "maticni_broj":"15221/523",
          "rola":2,
          "ime": "Ishmael",
          "prezime": "Murray",
          "broj_dresa": 9,
          "datum_rodenja": "1984-03-20 00:49:01",
          "visina": 186,
          "tezina": 91,
          "nacionalnost": "Slovenija"
        },
        {
          "maticni_broj":"15741/523",
          "rola":1,
          "ime": "Byron",
          "prezime": "Carlson",
          "broj_dresa": 10,
          "datum_rodenja": "1998-02-21 13:18:30",
          "visina": 185,
          "tezina": 116,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"451579/523",
          "rola":1,
          "ime": "Myles",
          "prezime": "Gates",
          "broj_dresa": 8,
          "datum_rodenja": "1998-06-15 06:49:18",
          "visina": 181,
          "tezina": 83,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1579029/523",
          "rola":1,
          "ime": "Walker",
          "prezime": "Newman",
          "broj_dresa": 10,
          "datum_rodenja": "1984-07-19 12:37:48",
          "visina": 195,
          "tezina": 112,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1579711/523",
          "rola":1,
          "ime": "Jesse",
          "prezime": "Snider",
          "broj_dresa": 2,
          "datum_rodenja": "1993-07-01 06:05:21",
          "visina": 198,
          "tezina": 116,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"157032/523",
          "rola":1,
          "ime": "Alfonso",
          "prezime": "Riley",
          "broj_dresa": 18,
          "datum_rodenja": "1995-05-10 13:19:31",
          "visina": 185,
          "tezina": 98,
          "nacionalnost": "Srbija"
        },
        {
          "maticni_broj":"1579/52263",
          "rola":1,
          "ime": "Jack",
          "prezime": "Weber",
          "broj_dresa": 8,
          "datum_rodenja": "1996-04-22 07:01:01",
          "visina": 195,
          "tezina": 99,
          "nacionalnost": "Mađarska"
        },
        {
          "maticni_broj":"1550179/523",
          "rola":1,
          "ime": "Brendan",
          "prezime": "Page",
          "broj_dresa": 3,
          "datum_rodenja": "1975-04-11 06:53:15",
          "visina": 196,
          "tezina": 94,
          "nacionalnost": "Slovenija"
        },
        {
          "maticni_broj":"1579/523002",
          "rola":1,
          "ime": "Noble",
          "prezime": "Peters",
          "broj_dresa": 5,
          "datum_rodenja": "1989-05-01 07:08:41",
          "visina": 200,
          "tezina": 104,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"157029/523",
          "rola":1,
          "ime": "Merritt",
          "prezime": "Clark",
          "broj_dresa": 4,
          "datum_rodenja": "1978-12-19 13:49:18",
          "visina": 180,
          "tezina": 94,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1579065/523",
          "rola":1,
          "ime": "Keane",
          "prezime": "Gomez",
          "broj_dresa": 8,
          "datum_rodenja": "1988-10-16 14:17:28",
          "visina": 188,
          "tezina": 105,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1579/5231478",
          "rola":1,
          "ime": "Reuben",
          "prezime": "Patrick",
          "broj_dresa": 3,
          "datum_rodenja": "1980-02-15 04:17:37",
          "visina": 198,
          "tezina": 98,
          "nacionalnost": "Mađarska"
        },
        {
          "maticni_broj":"1579/5230888",
          "rola":1,
          "ime": "Sawyer",
          "prezime": "Austin",
          "broj_dresa": 17,
          "datum_rodenja": "1981-05-14 04:41:46",
          "visina": 191,
          "tezina": 83,
          "nacionalnost": "Slovenija"
        },
        {
          "maticni_broj":"1500236/523",
          "rola":1,
          "ime": "Cooper",
          "prezime": "Vega",
          "broj_dresa": 14,
          "datum_rodenja": "1976-11-07 16:52:38",
          "visina": 188,
          "tezina": 104,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"0126579/523",
          "rola":1,
          "ime": "Alden",
          "prezime": "Montgomery",
          "broj_dresa": 13,
          "datum_rodenja": "1985-02-14 00:41:38",
          "visina": 196,
          "tezina": 84,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"8011579/523",
          "rola":1,
          "ime": "Melvin",
          "prezime": "Parsons",
          "broj_dresa": 17,
          "datum_rodenja": "1986-07-03 13:53:14",
          "visina": 186,
          "tezina": 106,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1579/5020363",
          "rola":1,
          "ime": "Vaughan",
          "prezime": "Mayer",
          "broj_dresa": 10,
          "datum_rodenja": "1998-12-03 05:51:20",
          "visina": 193,
          "tezina": 96,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"10067579/523",
          "rola":1,
          "ime": "Harding",
          "prezime": "Lawrence",
          "broj_dresa": 13,
          "datum_rodenja": "1984-05-11 21:46:45",
          "visina": 180,
          "tezina": 115,
          "nacionalnost": "Mađarska"
        },
        {
          "maticni_broj":"078962/523",
          "rola":1,
          "ime": "Nigel",
          "prezime": "Phelps",
          "broj_dresa": 9,
          "datum_rodenja": "1982-02-09 22:21:16",
          "visina": 188,
          "tezina": 113,
          "nacionalnost": "Spanjolska"
        },
        {
          "maticni_broj":"101473579/523",
          "rola":1,
          "ime": "Ezekiel",
          "prezime": "Guy",
          "broj_dresa": 1,
          "datum_rodenja": "1976-01-31 21:43:13",
          "visina": 193,
          "tezina": 82,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1579/50239304",
          "rola":1,
          "ime": "Kibo",
          "prezime": "Barber",
          "broj_dresa": 2,
          "datum_rodenja": "1993-08-18 00:37:00",
          "visina": 187,
          "tezina": 110,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"784179/523",
          "rola":1,
          "ime": "Lawrence",
          "prezime": "Marshall",
          "broj_dresa": 18,
          "datum_rodenja": "1991-05-01 17:42:38",
          "visina": 192,
          "tezina": 115,
          "nacionalnost": "Slovenija"
        },
        {
          "maticni_broj":"6034179/523",
          "rola":1,
          "ime": "Lawrence",
          "prezime": "Marshall",
          "broj_dresa": 18,
          "datum_rodenja": "1991-05-01 17:42:38",
          "visina": 192,
          "tezina": 115,
          "nacionalnost": "Slovenija"
        },
        {
          "maticni_broj":"157901369/523",
          "rola":1,
          "ime": "Orlando",
          "prezime": "Snow",
          "broj_dresa": 14,
          "datum_rodenja": "1978-02-13 06:36:36",
          "visina": 185,
          "tezina": 107,
          "nacionalnost": "Srbija"
        },
        {
          "maticni_broj":"6301579/52053",
          "rola":2,
          "ime": "Deacon",
          "prezime": "Mathis",
          "broj_dresa": 1,
          "datum_rodenja": "1996-09-06 17:03:49",
          "visina": 187,
          "tezina": 104,
          "nacionalnost": "Mađarska"
        },
        {
          "maticni_broj":"1069579/52398",
          "rola":2,
          "ime": "Alexander",
          "prezime": "Bradshaw",
          "broj_dresa": 9,
          "datum_rodenja": "1994-08-19 10:17:40",
          "visina": 189,
          "tezina": 111,
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"10702579/52398",
          "rola":3,
          "ime": "Clark",
          "prezime": "Williams",
          "datum_rodenja": "1987-02-19 11:48:52",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"10701119/52398",
          "rola":3,
          "ime": "Chandler",
          "prezime": "Martinez",
          "datum_rodenja": "1993-08-09 07:48:25",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"10702500/52398",
          "rola":3,
          "ime": "Shad",
          "prezime": "Little",
          "datum_rodenja": "1999-09-28 09:52:12",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"12579/5230198",
          "rola":4,
          "ime": "Sebastian",
          "prezime": "Jennings",
          "datum_rodenja": "1975-03-11 17:39:37",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"70262579/52398",
          "rola":4,
          "ime": "Arthur",
          "prezime": "Berger",
          "datum_rodenja": "1980-08-01 08:47:22",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"10763079/52398",
          "rola":4,
          "ime": "Evan",
          "prezime": "Jennings",
          "datum_rodenja": "1980-10-27 10:44:15",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"0002579/52398",
          "rola":5,
          "ime": "Thor",
          "prezime": "Stone",
          "datum_rodenja": "1977-10-19 08:53:55",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"10112579/52398",
          "rola":5,
          "ime": "Oscar",
          "prezime": "Alston",
          "datum_rodenja": "1977-10-15 11:59:58",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1070379/52398",
          "rola":5,
          "ime": "Bert",
          "prezime": "Finley",
          "datum_rodenja": "1996-03-09 22:35:16",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"107007879/52",
          "rola":6,
          "ime": "Elton",
          "prezime": "Ball",
          "datum_rodenja": "1984-03-27 08:04:56",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1070379/598",
          "rola":6,
          "ime": "Lars",
          "prezime": "Walls",
          "datum_rodenja": "1980-02-03 02:10:30",
          "nacionalnost": "Hrvatska"
        },
        {
          "maticni_broj":"1020779/523103",
          "rola":6,
          "ime": "Luke",
          "prezime": "Valentine",
          "datum_rodenja": "1986-10-18 04:53:02",
          "nacionalnost": "Hrvatska"
        }
    ])
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.bulkDelete('clanovitima',null,{});
  }
};
