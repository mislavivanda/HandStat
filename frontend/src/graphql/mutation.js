import { gql } from '@apollo/client';
//kod mutacija je obavezno staviti tip mutation za razliku od querya kojima možemo i izostavit tip ako hoćemo
//zapisnicar i nadzornik obavezni,mogu samo 1 sudac(npr dica)
const dodajUtakmicu=gql`
    mutation($broj_utakmice:String!,kolo:Int!,datum:String!,vrijeme:String!,gledatelji:Int!,natjecanje_id:Int!,dvorana_id:Int!,
    nadzornik_id:String!,lijecnik_id:String,zapisnicar_id:String!,mjvremena_id:String,sudac1_id:String!,sudac2_id:String,timdomaci_id:Int!,timgosti_id:Int!){
        dodajutakmicu(broj_utakmice:$broj_utakmice,kolo:$kolo,datum:$datum,vrijeme:$vrijeme,gledatelji:$gledatelji,natjecanje_id:$natjecanje_id,dvorana_id:$dvorana_id,
        nadzornik_id:$nadzornik_id,lijecnik_id:$lijecnik_id,zapisnicar_id:$zapisnicar_id,mjvremena_id:$mjvremena_id,sudac1_id:$sudac1_id,sudac2_id:$sudac2_id,timdomaci_id:$timdomaci_id,timgosti_id:$timgosti_id){
            broj_utakmice
        }
    }
`;
//liste maticnih brojeva ne smiju biti null odnosno prazne i unutar njih nesmi bit nijedan null objekt a od titula je jedino trener obavezan uvijek
const spremiRosterUtakmice=gql`
    mutation(broj_utakmice:String!,klub_id:Int!,igraci_id:[String!]!,golmani_id:[String!]!,trener_id:String!,
    sluzpredstavnik_id:String,tehniko_id:String,fizio_id:String){
        spremitimzautakmicu(broj_utakmice:$broj_utakmice,klub_id:$klub_id,igraci_id:$igraci_id,golmani_id:$golmani_id,
        trener_id:$trener_id,sluzpredstavnik_id:$sluzpredstavnik_id,tehniko_id:$tehniko_id,fizio_id:$fizio_id){

        }
    }
`;
//ako je uspjesno spremljen u bazu onda vrati id od dogadaja da ga mozemo cacheat i renderat
//u svakom dogadaju su obavezni tip,vrijeme,broj utakmice i klub
const spremiDogadaj=gql`
    mutation(broj_utakmice:String!,vrijeme:String!,klubgrb:Int!,maticni_broj:String,dogadaj_id:Int!,domaci:Int,gosti:Int){
        spremidogadaj(broj_utakmice:$broj_utakmice,vrijeme:$vrijeme,klubgrb:$klubgrb,maticni_broj:$maticni_broj,dogadaj_id:$dogadaj_id,domaci:$domaci,gosti:$gosti){
            id
        }
    }
`;
//vrati id ako je dobro spremilo
const spremiGolPozicija=gql`
    mutation(pozicija:Int!,gol:Boolean!,broj_utakmice:String!,maticni_broj:String!,dogadaj_id:Int!){
        spremigolpoziciju(pozicija:$pozicija,gol:$gol,broj_utakmice:$broj_utakmice,maticni_broj:$maticni_broj,dogadaj_id:$dogadaj_id){
            id
        }
    }
`;
//vrati status koji je postavljen ako nije bilo greske
const azurirajStatus=gql`
    mutation(broj_utakmice:String!,status:Int!){
        azurirajstatusutakmice(broj_utakmice:$broj_utakmice,status:$status){
        }
    }
`;
// kada zavrsavamo utakmicu i postavljamo zadnje parametre, sigurno ce biti barem 1 sudac pa zato ocjena drugog suca nije obavezna
//ako je sve dobro spremljeno onda vratimo broj utakmice
const zavrsiUtakmicu=gql`
    mutation(broj_utakmice:String!,rez_domaci:Int!,rez_gosti:Int!,sudac1_ocjena:Float!,sudac2_ocjena:Float){
        zavrsiutakmicu(broj_utakmice:$broj_utakmice,rez_domaci:$rez_domaci,rez_gosti:$rez_gosti,sudac1_ocjena:$sudac1_ocjena,sudac2_ocjena:$sudac2_ocjena){
            
        }
    }
`;
export default {dodajUtakmicu,spremiRosterUtakmice,spremiDogadaj,spremiGolPozicija,azurirajStatus,zavrsiUtakmicu};