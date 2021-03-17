//1-> dogadjai koji uzrokuju promjenu rezultata-> golovi
//2-> dogadaji koji ne uzrokuju promjenu rezultata i nemaju aktera-> timeout
//3-> dogadaji koji ne uzrokuju promjenu rezultata a imaju aktera-> promasaji,obrane,iskljucenja,zuti,...
//ovo nam je bitno kod ispisa dogadaja u boxu da znamo kako ih ispisati
const dogadaji=[
    {
        id:1,
        naziv:'Gol',
        tip:1
    },
    {
        id:2,
        naziv:'Obrana',
        tip:3
    },
    {
        id:3,
        naziv:'Promasaj',
        tip:3
    },
    {
        id:4,
        naziv:'Primljen pogodak',
        tip:3
    },
    {
        id:5,
        naziv:'Sedmerac pogodak',
        tip:1
    },
    {
        id:6,
        naziv:'Sedmerac obrana',
        tip:3
    },
    {
        id:7,
        naziv:'Sedmerac promasaj',
        tip:3
    },
    {
        id:8,
        naziv:'Sedmerac primljen',
        tip:3
    },
    {
        id:9,
        naziv:'Iskljucenje',
        tip:3
    },
    {
        id:10,
        naziv:'Asistencija',
        tip:3
    },
    {
        id:11,
        naziv:'Tehnicka',
        tip:3
    },
    {
        id:12,
        naziv:'Zuti karton',
        tip:3
    },
    {
        id:13,
        naziv:'Crveni karton',
        tip:3
    },
    {
        id:14,
        naziv:'Plavi karton',
        tip:3
    },
    {
        id:15,
        naziv:'Timeout domaći',
        tip:2
    },
    {
        id:16,
        naziv:'Timeout gosti',
        tip:2
    }

]
export default dogadaji