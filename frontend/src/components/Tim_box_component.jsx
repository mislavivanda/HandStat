import React, { Fragment } from 'react'
import {Box,IconButton,Typography,Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { useSelector, useDispatch } from 'react-redux';
import {odabranClan} from '../redux/slicers/odabraniClan';
/*komponenta koja se renderira unutar tim boxa nakon odabira u selectu koga zelimo dodati ili ako odaberemo dodavanje svih*/
const useStyles=makeStyles((theme)=>({
    glavniBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'90%',
        backgroundColor:'#FFFFFF',
        borderRadius:10,
        margin:'0.1rem auto',
    },
   buttonBox:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width:'100%'
   },
   dres:{
       width:'12.5%',
       height:'auto',
       backgroundColor:theme.palette.primary.main,
       borderRadius:'50%',
       marginLeft:'5%'
   },
   imePrezimeBox:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'87.5%'
   },
   imePrezimeStozerBox:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'87.5%',
    marginLeft:'12.5%'//da bude poravnato kao kod igraca i golmana
   },
   odabraniBox:{//classa koju imaju odabrani clanovi
      backgroundColor:'#fa9905'
   },
   imePrezimeNeselektiran:{//ostavit ovako u slucaju promjena boje
       color:theme.palette.secondary.main
   },
   imePrezimeSelektiran:{
       color:'#FFFFFF'
   }
}))
//komponenta u kojoj se izlistavaju igraci/golmani i ostali clanovi u tim boxu
function TimBoxComponent({maticni_broj,dres,ime,prezime,spremljenTim,klub,tip,clanovi,setClanovi,preostaliClanovi,setPreostaliClanovi}) {//tip ima vrijednost 1=igrac,2=golman,3=trener,4=predstavnik,5=tehniko,6=fiziotarapeut KAKO BI ZNALI IZ KOJEG NIZA UNUTAR TIMA GA UKLONITI
    //kako moramo omogu??it unselect odre??enog ??lana i doga??aja,npr ako selektiramo igra??a onda ne mo??emo unselectat igra??a i upisat doga??aj timeout jer nam stoji selektiran akter
     //stoga ponovnin klikon na selektiranog aktera/dogadaj ??e se unselectat taj odabranik
    const classes=useStyles();
    const dispatch=useDispatch();
    const odabraniClan=useSelector(state=>state.odabraniClan.clan);
    const { timDomaciSpremljen,timGostiSpremljen}=useSelector(state=>state.timovi);
function ukloniClanaTima(maticni_broj,dres,ime,prezime,tip)
{
      if(tip===1||tip===2)//igrac
      {
        //vrati ga u niz PREOSTALIH jer se u njemu nalaze svi koji nisu trenutno seleketirani
          //PROBLEM-> .push NE VRACA?? NAZAD NOVI NIZ NEGO DULJINU NOVOG NIZA-> spojimo ih sa spread operatorom
          let new_array1=[...preostaliClanovi, {maticni_broj:maticni_broj,
          broj_dresa:dres,
          ime:ime,
          prezime:prezime
        }];
          let new_array2=clanovi.filter((clan)=>{
          return (clan==null || clan.maticni_broj!==maticni_broj)//clanove koji su null znaci da tu stoji komponenta za odabiranje pa nju isto ne mi??emo nego ostavimo, ina??e javi error da je igra?? null kad nai??e na nju
          }
          );//makni ga iz niza trenutno odabranih
          setPreostaliClanovi(new_array1);
          setClanovi(new_array2);
    }
    else{
        setClanovi({}); //nema preostalih ,samo postavimo na prazan objekt
    } 
  
}
function clanKlubaKlik(maticni_broj,ime,prezime,klub_id,tip)//funkcija koja se poziva kod selektiranja clana kluba za dogadaj
{
    if(odabraniClan)
    {
    if(odabraniClan.maticni_broj===maticni_broj)//ako je vec taj selektiran onda drugi klik na njega zna??i unselect-> POSTAVI ODABRANOG CLANA NA NULL
    {
      //Postavi odabranog clana na null->UNSELECT
      dispatch(odabranClan(null));
    }
    else {//kliknut neki drugi clan prvi put->
        dispatch(odabranClan({
            maticni_broj:maticni_broj,
            ime:ime,
            prezime:prezime,
            klub_id:klub_id,
            tip:tip
        }))//da znamo jeli golman,igrac ili osoblje za spremit u bazu,
    }
  }//ako je null onda je kliknuto prvi put sigurno
    else {
        dispatch(odabranClan({
            maticni_broj:maticni_broj,
            ime:ime,
            prezime:prezime,
            klub_id:klub_id,
            tip:tip
        }))//da znamo jeli golman,igrac ili osoblje za spremit u bazu,
    }
}
 {/*KONDIICONALNA PRIMJENA VI??E KLASA-> DOLJE U BOXU ,INA??E SE VI??E KLASA NA 1 ELEMENT RJE??AVA PREKO TEMPLATE STRINGOVA*/}
     return (
         <Fragment>
             {
              ((tip===1 || tip===2))?//igrac ili golman         ako je odabran taj clan i ako nije prethodno odabran bio( null ili razlicit maticni broj)-> kliknili smo prvi put na njega-> obojamo ga, u suprotnome je ovo drugi klik na njega i odznacit cemo ga, ako bude treci klik na njega onda moramo dozovlit da ga opet oznacimo
             <Box className={`${classes.glavniBox} ${(odabraniClan && odabraniClan.maticni_broj===maticni_broj)? classes.odabraniBox : ''}`} >{/*istaknuti odabranog ??lana*/}
                  <Button disabled={(timDomaciSpremljen&&timGostiSpremljen)? false : true}  onClick={()=> clanKlubaKlik(maticni_broj,ime,prezime,klub,tip)} disableRipple style={{flexGrow:1}}>
                  {/*sve dok nisu spremljene postave OBA TIMA NE MO??EMO KLIKAT NA ??LANOVE TIMA ZA DOGA??AJE,AKO SU OBA SPREMLJENA ONDA MO??EMO */}
                  <Box className={classes.buttonBox}>{/*overflowWrap govori da ukoliko teskt preolazi ??irinu koja mu je ododijeljena da ??e razlomit rije?? u vi??e djelova i stavit u novi red*/}
                      <Box className={classes.dres}><Typography style={{color:'#FFFFFF'}}>{dres}</Typography></Box>
                      <Box className={classes.imePrezimeBox}><Typography className={`${(odabraniClan && odabraniClan.maticni_broj===maticni_broj)? classes.imePrezimeSelektiran : classes.imePrezimeNeselektiran}`}>{ime + ' '+prezime}</Typography></Box>
                  </Box>
                  </Button>{/*ako je spremljen roster za neku od ekipa onda nemoj prikazat ukloni ikonu-> nema vise mijenjanja, u suprotnome prikazi */}
                  {(spremljenTim)? null : <IconButton onClick={()=>ukloniClanaTima(maticni_broj,dres,ime,prezime,tip)} title='Ukloni' color='secondary'  disableRipple><RemoveCircleIcon/></IconButton>}
              </Box>
                  :
                  <Box  className={`${classes.glavniBox} ${(odabraniClan && odabraniClan.maticni_broj===maticni_broj)? classes.odabraniBox : ''}`}>
                      <Button disabled={((timDomaciSpremljen&&timGostiSpremljen))? false : true} onClick={()=>clanKlubaKlik(maticni_broj,ime,prezime,klub,tip)} disableRipple style={{flexGrow:1}}>
                      <Box className={classes.buttonBox}>{/*umisto spremljen tim imat state od oba tima jesu li spremljena*/}
                          <Box className={classes.imePrezimeStozerBox}><Typography className={`${(odabraniClan && odabraniClan.maticni_broj===maticni_broj)? classes.imePrezimeSelektiran : classes.imePrezimeNeselektiran}`}>{ime + ' '+prezime}</Typography></Box>
                      </Box>
                      </Button>
                      {(spremljenTim)? null : <IconButton onClick={()=> ukloniClanaTima(maticni_broj,undefined,ime,prezime,tip)}  title='Ukloni' color='secondary'  disableRipple><RemoveCircleIcon/></IconButton>}
                  </Box>
          }
         </Fragment>
     )
   }

export default TimBoxComponent
