import { gql } from '@apollo/client';
//OVA PRVA 4 SUBSCRIPTIONSA SU ZA PROMJENE PODATAKA O ODREĐENOJUTAKMICI U LISTI UTAKMICA  
//kada nova utakmica bude live-> dodajemo je u prikaz
const novaUtakmica=gql`
    subscription{
      novautakmica{
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
//promjena statusa utakmice-> 3,4,5
const promjenaStatusa=gql`
  subscription{
    promjenastatusa{
      broj_utakmice
      status
    }
  }
`
//promjena minute
const promjenaVremena=gql`
  subscription{
    promjenavremena{
      broj_utakmice
      minuta
    }
  }
`
//promjena rezultata utakmice
const promjenaRezultata=gql`
  subscription{
    promjenarezultata{
      broj_utakmice
      rezultat_domaci
      rezultat_gosti
    }
  }
`
//OVI SUBSCRIPTIONSI SU ZA PROMJENU PODATAKA/STANJA OD SPEICIFIČNE UTAKMICE-> IMAJU ARGUMENT BROJ_UTAKMICE
const rezultatUtakmice=gql`
  subscription($broj_utakmice:String!){
    rezultatutakmice(broj_utakmice:$broj_utakmice){
      rezultat_domaci
      rezultat_gosti
    }
  }`

const statusUtakmice=gql`
  subscription($broj_utakmice:String!){
    statusutakmice(broj_utakmice:$broj_utakmice){
      status
    }
  }`

const minutaUtakmice=gql`
  subscription($broj_utakmice:String!){
    minutautakmice(broj_utakmice:$broj_utakmice){
      minuta
    }
  }
`

const noviDogadaj=gql`
  subscription($broj_utakmice:String!){
    novidogadajutakmice(broj_utakmice:$broj_utakmice){
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
`

const brisiDogadaj=gql`
  subscription($broj_utakmice:String!){
    brisidogadajutakmice(broj_utakmice:$broj_utakmice){
        id
        dogadaj{
          tip
        }
    }
  }
`

const promjenaStatistikeIgrac=gql`
  subscription($broj_utakmice:String!,$klub_id:Int!){
    statistikaigrac(broj_utakmice:$broj_utakmice,klub_id:$klub_id){
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
  }
`

const promjenaStatistikeGolman=gql`
  subscription($broj_utakmice:String!,$klub_id:Int!){
    statistikagolman(broj_utakmice:$broj_utakmice,klub_id:$klub_id){
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
  }
`

const promjenaStatistikeStozer=gql`
  subscription($broj_utakmice:String!,$klub_id:Int!){
    statistikastozer(broj_utakmice:$broj_utakmice,klub_id:$klub_id){
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
`
export {novaUtakmica,promjenaStatusa,promjenaVremena,promjenaRezultata,rezultatUtakmice,statusUtakmice,minutaUtakmice,noviDogadaj,brisiDogadaj,promjenaStatistikeIgrac,
promjenaStatistikeGolman,promjenaStatistikeStozer};