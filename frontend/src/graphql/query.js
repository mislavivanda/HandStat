import { gql } from '@apollo/client';//parsiranje zadanih template stringova u graphql querye/mutacije
//query varijable saljemo u query tip pa onda prosljeđujemo kao argumente unutar entry pointa
const prikazUtakmice=gql`
    query($broj_utakmice:String!){
        utakmica(broj_utakmice:$broj_utakmice){
            broj_utakmice
            kolo
            datum
            vrijeme
            gledatelji
            rezultat_domaci
            rezultat_gosti
            status
            natjecanje{
                id
                naziv
                sezona
            }
            lokacija{
                id
                dvorana
                mjesto
            }
            nadzornik{
                maticni_broj
                ime
                prezime
            }
            lijecnik{
                maticni_broj
                ime
                prezime
            }
            zapisnicar{
                maticni_broj
                ime
                prezime
            }
            mjeracvremena{
                maticni_broj
                ime
                prezime
            }
            sudac1{
                maticni_broj
                ime
                prezime
            }
            sudac2{
                maticni_broj
                ime
                prezime
            }
            domaci{
                id
                naziv
                image_path
            }
            gosti{
                id
                naziv
                image_path
            }
        }
    }
`;

const dohvatiSvaNatjecanja=gql`
    query{
        natjecanja{
            id
            naziv
            sezona
        }
    }
`;

const dohvatiSveDvorane=gql`
query{
    dvorane{
            id
            dvorana
            mjesto
        }
    }
`;

const dohvatiSveNadzornike=gql`
query{
    nadzornici{
        maticni_broj
        ime
        prezime
    }
}
`;

const dohvatiSveLijecnike=gql`
query{
    lijecnici{
        maticni_broj
        ime
        prezime
    }
}
`;

const dohvatiSveZapisnicare=gql`
query{
    zapisnicari{
        maticni_broj
        ime
        prezime
    }
}
`;

const dohvatiSveMjerace=gql`
query{
    mjeracivremena{
        maticni_broj
        ime
        prezime
    }
}
`;

const dohvatiSveSuce=gql`
    query{
        suci{
            maticni_broj
            ime
            prezime
            mjesto
        }
    }
`;
//dohvat svih klubova iz odredenog natjecanja
const dohvatiSveKluboveOdNatjecanja=gql`
    query($natjecanje_id:Int!){
        klubovi(natjecanje_id:$natjecanje_id){
            id
            naziv
            image_path
        }
    }
`;

const dohvatiSveMoguceDogadaje=gql`
    query{
        dogadaji{
            id
            naziv
            tip
        }
    }
`;
//dohvaća sve moguće članove tima za sve titule od kojih biramo one koji su prisutni za utakmicu
const dohvatiSveClanoveTima=gql`
    query($klub_id:Int!){
        timclanovi(klub_id:$klub_id){
            igraci{
                maticni_broj
                broj_dresa
                ime
                prezime
            }
            golmani{
                maticni_broj
                broj_dresa
                ime
                prezime
            }
            treneri{
                maticni_broj
                ime
                prezime
            }
            sluzbenipredstavnici{
                maticni_broj
                ime
                prezime
            }
            tehniko{
                maticni_broj
                ime
                prezime
            }
            fizio{
                maticni_broj
                ime
                prezime
            }
        }
    }
`;
//dohvat statistike SVIH clanova koji su sudjelovali u utakmici tima za pojedine utakmicu
const dohvatiStatistikuTima=gql`
    query($broj_utakmice:String!,$klub_id:Int!){
        timstatistika(broj_utakmice:$broj_utakmice,klub_id:$klub_id){
            igraci{
                golovi
                pokusaji
                sedmerac_golovi
                sedmerac_pokusaji
                iskljucenja
                zuti
                crveni
                plavi
                tehnicke
                asistencije
                igrac{
                    maticni_broj
                    broj_dresa
                    ime
                    prezime
                } 
            }
            golmani{
                obrane_ukupno
                primljeni_ukupno
                sedmerac_obrane
                sedmerac_primljeni
                iskljucenja
                zuti
                crveni
                plavi
                golovi
                pokusaji
                golman{
                    maticni_broj
                    broj_dresa
                    ime
                    prezime
                } 
            }
            stozer{
                zuti
                crveni
                plavi
                clan{
                    maticni_broj
                    ime
                    prezime
                    rola
                }
            }
        }
    }
`;
//dohvat svhi dogadaja utakmice za prikaz tijeka utakmice
const dohvatiSveDogadajeUtakmice=gql`
    query($broj_utakmice:String!){
        dogadajiutakmice(broj_utakmice:$broj_utakmice){
            id
            vrijeme
            tim
            rez_domaci
            rez_gosti
            dogadaj{
                id
                naziv
                tip
            }
            akter{
                maticni_broj
                ime
                prezime
            }
        }
    }
`;
//kad otovri homepage dohvatimo mu sve trenutno live rezultate a kasnije ih mijenjamo sa subscriptionsima
const dohvatiLiveRezultate=gql`
    query{
        rezultatiuzivo{
            broj_utakmice
            natjecanje{
            naziv
            }
            domaci{
            naziv
            }
            gosti{
            naziv
            }
            rezultat_domaci
            rezultat_gosti
            minuta
            status
        }
    }
`
//provjera je li korisnik logiran
const checkLogin=gql`
    query{
        checklogin
    }`

export {prikazUtakmice,dohvatiSvaNatjecanja,dohvatiSveDvorane,dohvatiSveNadzornike,dohvatiSveLijecnike,dohvatiSveZapisnicare,
dohvatiSveMjerace,dohvatiSveSuce,dohvatiSveKluboveOdNatjecanja,dohvatiSveMoguceDogadaje,dohvatiSveClanoveTima,dohvatiStatistikuTima,dohvatiSveDogadajeUtakmice,checkLogin,
dohvatiLiveRezultate};