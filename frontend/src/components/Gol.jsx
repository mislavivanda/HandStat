import React,{Fragment,useState,useEffect} from 'react'
import gol from '../images/handball_goal.jpg';
import {Grid, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import {otkljucajGol} from '../redux/slicers/otkljucajGol';
import {dodajDogadaj} from '../redux/slicers/dogadajiUtakmice';
import {odabranDogadaj} from '../redux/slicers/odabraniDogadaj';
import {odabranClan} from '../redux/slicers/odabraniClan';
import {incrementDomaci,incrementGosti} from '../redux/slicers/rezultat';
import { useMutation } from '@apollo/client';
import {spremiDogadaj,spremiGolPozicija} from '../graphql/mutation';
import ErrorDialog from './ErrorDialog';
import {postaviError} from '../redux/slicers/error';
const useStyles=makeStyles((theme)=>({
    gol:{
        height:'auto',//width:100% i hegiht auto znaci da će za visinu slika zadrzati svoj apsect ratio(omjer width i hegiht) koji iznosi 1.5748 pa znamo kolika će bit visina slike u odnosu na sirinu parent containera jer je width slike=width containera(100%)
        width:'100%'
      },
      golGrid:{
        position:'absolute',
        marginTop:'3.75%',//VAŽNOOOO!!!-> SVE MARGINE(TOP.BOTTOM,LEFT I RIGHT) SE RAĆUNAJU U ODNOSU NA WIDTH ELEMENTA, VIDIMO DA IVISNA PREĆKE ZAUZIMA 5.9055...% VISINE SLIKE ŠTO JE 3.75% ŠIRINE parenta(podijelit s apsect ratio)
        width:'92.25%',/*kada odbijemo sirine 2 stative dobijemo oko 92% sirinu grida-> sirina 2 stative uzima 8% jer je slika sira ,a sirina prećke zauzima 10% jer je visina manja*/
        height:'94.0945%',/*gol grid je position absolute-> on se pozicionira u odnosu na prvi relative element -> to je glavni container od gola
        znamo da slika gola ima istu sirinu i visinu kao taj container, grid sa botunima nam treba biti visine slike-visina prećke s tim da se visina računa u odnosu na visinu parent containera koji ima istu visinu ko i slika gola
        -> znamo da prećka oduzima 5.9055% visine gola odnosno containera pa stoga visina grida sa botunima mora biti 100-5.9055=94.0945% i pomaknuta s marginon za visinu precke(koja se kod margina racuna u odnosu na ŠIRINU) */
        borderBottomWidth:4,
        borderBottomColor:theme.palette.secondary.main,
        borderBottomStyle:'solid',
        borderLeftWidth:4,
        borderLeftStyle:'solid',
        borderLeftColor:theme.palette.secondary.main,
        boxSizing:'border-box'//s ovim smo rekli da zelimo da nam cijela sirina i visina grida s botunima zajedno sa gornjim i lijevim borerom bude ista prostoru unutar slike
      },
      golPolje:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:'100%',
        margin:0,
        borderRadius:0,
        "&:hover":{//da ne radi shadow kad se howera stavimo istu boju ko inače pozadina
          backgroundColor:theme.palette.primary.main
        }
      },
      svakiGolPolje:{//ovo primjenjujemo na svaki grid item-> svaki gird item ce imat 1/3 sirine retka-> zelimo da unutar te sirine i visine budu uracunate i gornji i desni border
        //kako svako polje ima top i right border onda će imat i isti content box size jer će se svima od ukupne sirine i visine oduzet 4 gore i 4 desno-> to i zelimo-> da bijeLa podrucja budu iste velicine
        //content size od gornjeg grida će biti CIJELI DIO BEZ DONJEG I LIJEVOG BORDERA-> TAMAN UNUTAR TOG DIJELA STAVLJAMO NAŠE RETKE KOJI ĆE IMAT 1/3 ŠIRINE I VISINE I KOJI ĆE UNUTAR TIH MJERA DODAT GORNJI I DESNI BORDER PREKO GRID ITEMA
        //-> VISINA SVAKOG RETKA SA SADRZAJEM I BORDEROM ĆE BIT 1/3 VISINE TOG PROSTORA, A SIRINA ĆE BIT 1/3 SIRINE TOG PROSTORA U KOJI JE URACUNAT I DESNI BORDER-> SVI RETCI I CLANOVI REDAKA SU ISTI
        boxSizing:'border-box',
        borderTopWidth:4,
        borderTopColor:theme.palette.secondary.main,
        borderTopStyle:'solid',
        borderRightWidth:4,
        borderRightColor:theme.palette.secondary.main,
        borderRightStyle:'solid',
        borderRadius:0
      },
      mutationErrorItem:{
        position:'fixed',
        top:'50%',
        left:'50%',//centrira na način da stavi margin top 50% visine ekrana od vrha i 50% od sirine ekrana ALI OD BORDERA/EDGEA ELEMENTA-> NEĆE BITI CENTRIRANO JER
        //NPR AKO JE ELEENT SIROK 10% ONDA ĆE MU LIJEVI RUB BITI NA 50% OD LIJEVOG RUBA EKRANA A DESNI 40%->nije centrirano-> rješenje:
        //KADA POMAKNEMO ELEMENT ZA 50% OD RUBA EKRANA ONDA GA MAKNEMO ZA POLOVICU NJEGOVE SIRINE NAZAD->
        //1) ŠIRINA EKRANA= 50%+ŠIRINA ELEMENTA + 50% - ŠIRINA ELEMENTA
        //NAKON POMAKA:
        //ŠIRINA EKRANA=50%-ŠIRINAELEMENTA/2+ŠIRINA ELEMENTA +50%-ŠIRINAELEMENTA/2-> VIDIMO DA SU LIJEVE I DESNE MARGINE JEDNAKE S OBIZROM NA RUB ELEMENTA
        transform: 'translate(-50%, -50%)'//TRANSLATIRAMO PO X I Y OSI U SUPROTNOM SMJERU
    }
}))
function Gol() {
    const [odabraniDioGola,setOdabraniDioGola]=useState(null);
    const classes=useStyles();
    const dispatch=useDispatch();
    const brojUtakmice=useSelector(state=>state.brojUtakmice);
    const otkljucanGol=useSelector(state=>state.otkljucajGol);
    const odabraniDogadaj=useSelector(state=>state.odabraniDogadaj.dogadaj);
    const odabraniClan=useSelector(state=>state.odabraniClan.clan);
    const time=useSelector(state=>state.timer);
    let domaciRez=useSelector(state=>state.rezultat.timDomaci);
    let gostiRez=useSelector(state=> state.rezultat.timGosti);
    const [spremiOdabraniDogadaj,{error:dogadajError}]=useMutation(spremiDogadaj,{
      onCompleted:(data)=>{
        //ako se uspješno spremi događaj uvećavamo rezultat i spremamo poziciju gola sa vracenim id-om
        spremiPozicijuGola({
          variables:{
            broj_utakmice:brojUtakmice,
            pozicija:odabraniDioGola,
            maticni_broj:odabraniClan.maticni_broj,
            dogadaj_id:odabraniDogadaj.id,
            dogadaj:data.spremidogadaj.id
          }
        });
        //vrati sve vriiednosti na početak nakon uspješnog ili neuspješnog unosa-> ako je neuspješan isto mora krenuti ispočetka sve
        dispatch(odabranDogadaj(null));
        dispatch(odabranClan(null));
        dispatch(otkljucajGol(false));
        setOdabraniDioGola(null);
        if(data.spremidogadaj.dogadaj.tip===1&&data.spremidogadaj.tim===1)
        {
          //uvećaj rezultat domaćih
          dispatch(incrementDomaci());
        }
        else if(data.spremidogadaj.dogadaj.tip===1&&data.spremidogadaj.tim===2)
        {
          //uvecaj rezultat gostiju
          dispatch(incrementGosti());
        }
        //svakako dodaj dogadaj
        dispatch(dodajDogadaj({
          id:data.spremidogadaj.id,
          vrijeme:data.spremidogadaj.vrijeme,
          klubikona:data.spremidogadaj.tim,//ako je domaći->1-> prikazi sliku od odmaćeg tima,inače od gostujućeg NE PSREMAMO SLIKU NEGO SAMO OVI FLAG
          tip:data.spremidogadaj.dogadaj.tip,
          naziv_dogadaja:data.spremidogadaj.dogadaj.naziv,
          ime:(data.spremidogadaj.akter)? data.spremidogadaj.akter.ime : null,
          prezime:(data.spremidogadaj.akter)? data.spremidogadaj.akter.prezime : null,
          domaci:data.spremidogadaj.rez_domaci,
          gosti:data.spremidogadaj.rez_gosti
      }))
      },
      onError:(error)=>{
        dispatch(postaviError(true));//ovo će otvorit error popup
      }
    });
    //spremanje odabranog dijela branke
  const [spremiPozicijuGola,{error:golpozicijaError}]=useMutation(spremiGolPozicija,{
    onError:(error)=>{
      dispatch(postaviError(true));//ovo će otvorit error popup
    }
  });
  function odabraniGol(gol_pozicija)//poziva se nakon klika odnosno odabira pozicije gola
  {
    setOdabraniDioGola(gol_pozicija);
  }
  useEffect(()=>{
  //ODABIR GOLA JE ZADNJA FAZA U TOM DOGAĐAJU-> NAKON ODABIRA SPREMI GA U NIZ DOGAĐAJA I U BAZU
    if(odabraniDioGola)//ako je različit od null onda je odabran neki dio
    {
      if(odabraniDogadaj.tip===1 && (odabraniClan.klub_id===1))//za golove promijenimo i rezultat
      {
        domaciRez+=1;//uvećamo vrijednost/rezultat domaćeg tima
      }
      else if(odabraniDogadaj.tip===1 && (odabraniClan.klub_id===2))
      {
       gostiRez+=1;
      }
      //SPREMI DOGAĐAJ I SPREMI U BAZU DIO KOJI SE ODNOSI NA POZICIJU GOLA
      if(odabraniClan.klub_id===1)
      {
        spremiOdabraniDogadaj({
          variables:{
            broj_utakmice:brojUtakmice,
            vrijeme:(time.minutes.toString()+':'+time.seconds.toString()),
            klubgrb:1,
            dogadaj_id:odabraniDogadaj.id,
            maticni_broj:odabraniClan.maticni_broj,
            domaci:domaciRez,
            gosti:gostiRez
          }
        })
    }
      else {
        spremiOdabraniDogadaj({
          variables:{
            broj_utakmice:brojUtakmice,
            vrijeme:(time.minutes.toString()+':'+time.seconds.toString()),
            klubgrb:2,
            dogadaj_id:odabraniDogadaj.id,
            maticni_broj:odabraniClan.maticni_broj,
            domaci:domaciRez,
            gosti:gostiRez
          }
        })
      }
    }
  
  },[odabraniDioGola]);//POZIVA SE KADA KORISNIK ODABERE DIO GOLA KADA ODABEREMO NEKI OD DOGAĐAJA KOJI OMOGUĆUJE ODABIR GOLA

   /* if(dogadajError) //pozovi error window

    if(golpozicijaError) //pozovi error window
    */

    return (
      <Fragment>
           <img src={gol} alt='handball goal' className={classes.gol}/>
                          <Grid className={classes.golGrid} item container direction='column'>{/*tablica*/}
                            <Grid item container direction='row' xs style={{height:'33.33%'}}>{/*redak*/}
                                <Grid item  xs={4} className={classes.svakiGolPolje}>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(1)} disableRipple variant='outlined' className={[classes.golPolje,classes.gornjiGolPolje,classes.lijeviGolPolje].join(' ')} ></Button>{/*multiple classNames za lement rjesavamo sa joinanjem u string*/}
                                </Grid>
                                <Grid item  xs={4} className={classes.svakiGolPolje}>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(2)} disableRipple variant='outlined'  className={[classes.golPolje,classes.gornjiGolPolje].join(' ')}></Button>
                                </Grid>
                                <Grid item xs={4} className={classes.svakiGolPolje}>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(3)} disableRipple variant='outlined'  className={[classes.golPolje,classes.gornjiGolPolje].join(' ')}></Button>
                                </Grid>
                            </Grid>
                            <Grid item container direction='row' xs style={{height:'33.33%'}}>
                                <Grid item xs={4} className={classes.svakiGolPolje}>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(4)} disableRipple variant='outlined'  className={[classes.golPolje,classes.lijeviGolPolje].join(' ')}></Button>
                                </Grid>
                                <Grid item xs={4} className={classes.svakiGolPolje}>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(5)} disableRipple variant='outlined'  className={classes.golPolje}></Button>
                                </Grid>
                                <Grid item xs={4} className={classes.svakiGolPolje}>
                                  <Button  disabled={(otkljucanGol)? false : true} onClick={()=>odabraniGol(6)} disableRipple variant='outlined'  className={classes.golPolje}></Button>
                                </Grid>
                            </Grid>
                            <Grid item container direction='row' xs style={{height:'33.33%'}}>
                                <Grid item xs={4} className={classes.svakiGolPolje}>
                                  <Button  disabled={(otkljucanGol)? false : true} onClick={()=>odabraniGol(7)} disableRipple variant='outlined'  className={[classes.golPolje,classes.lijeviGolPolje].join(' ')}></Button>
                                </Grid>
                                <Grid item xs={4} className={classes.svakiGolPolje}>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(8)} disableRipple variant='outlined'  className={classes.golPolje}></Button>
                                </Grid>
                                <Grid item xs={4} className={classes.svakiGolPolje}>
                                  <Button  disabled={(otkljucanGol)? false : true} onClick={()=>odabraniGol(9)} variant='outlined'  className={classes.golPolje}></Button>
                                </Grid>
                          </Grid>
                        </Grid>
           {                   
                ((dogadajError&&dogadajError.message)||(golpozicijaError&&golpozicijaError.message))?//kada se dogodi 1 od errora radimo alert dialog
                <ErrorDialog errorText={(dogadajError)? dogadajError.message : golpozicijaError.message} /> //kada se dogodi error onda vraćamo dialog komponentu i otvaramo je u onError funkciji
                :
                null
            }
      </Fragment>
    )
}

export default Gol