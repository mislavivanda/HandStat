import { gql } from '@apollo/client';
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
export {novaUtakmica,promjenaStatusa,promjenaVremena,promjenaRezultata};