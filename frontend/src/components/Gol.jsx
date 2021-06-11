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
        marginTop:'3.8735%',//VAŽNOOOO!!!-> SVE MARGINE(TOP.BOTTOM,LEFT I RIGHT) I PADINZI SE RAĆUNAJU U ODNOSU NA WIDTH ELEMENTA, VIDIMO DA IVISNA PREĆKE ZAUZIMA 6.1% VISINE SLIKE ŠTO JE 3.8735% ŠIRINE
        width:'92.25%',/*kada odbijemo sirine 2 stative dobijemo oko 92% sirinu grida-> sirina 2 stative uzima 8% jer je slika sira ,a sirina prećke zauzima 10% jer je visina manja*/
        height:'93.9%'/*gol grid je position absolute pa se njegovi postoci odnose na prvi realtivno pozicionirani element-> to je glavni container od gola
        znamo da slika gola ima istu sirinu i visinu kao taj container, grid sa botunima nam treba biti visine slike-visina prećke s tim da se visina računa u odnosu na visinu parent containera koji ima istu visinu ko i slika gola
        -> znamo da prećka oduzima 6.1% visine gola odnosno containera pa stoga visina grida sa botunima mora biti 100-6.1=93.9% i pomaknuta s marginon za visinu precke(koja se kod margina racuna u odnosu na ŠIRINU) */
      },
      golPolje:{
        borderBottomWidth:4,
        borderBottomColor:theme.palette.secondary.main,
        borderBottomStyle:'solid',
        borderRightWidth:4,
        borderRightColor:theme.palette.secondary.main,
        borderRightStyle:'solid',
        borderRadius:0,
        width:'100%',
        height:'100%',
        margin:0,
        "&:hover":{//da ne radi shadow kad se howera stavimo istu boju ko inače pozadina
          backgroundColor:theme.palette.primary.main
        }
      },
      lijeviGolPolje:{
        borderLeftWidth:4,
        borderLeftStyle:'solid',
        borderLeftColor:theme.palette.secondary.main
      },
      gornjiGolPolje:{
        borderTopWidth:4,
        borderTopColor:theme.palette.secondary.main,
        borderTopStyle:'solid'
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
        //ako se uspješno spremi događaj uvećavamo rezultat
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
      //u oba slučaja-> mora bit odabran gol-> spremamo ovo neovisno jeli gostujući li domaći tim
      spremiPozicijuGola({
        variables:{
          broj_utakmice:brojUtakmice,
          pozicija:odabraniDioGola,
          gol:(odabraniDogadaj.tip===1)? true : false,//ako je gol-> saljemo true
          maticni_broj:odabraniClan.maticni_broj,
          dogadaj_id:odabraniDogadaj.id
        }
      })
    //vrati sve vriiednosti na početak nakon uspješnog ili neuspješnog unosa-> ako je neuspješan isto mora krenuti ispočetka sve
    dispatch(odabranDogadaj(null));
    dispatch(odabranClan(null));
    dispatch(otkljucajGol(false));
    setOdabraniDioGola(null);
    }
  
  },[odabraniDioGola]);//POZIVA SE KADA KORISNIK ODABERE DIO GOLA KADA ODABEREMO NEKI OD DOGAĐAJA KOJI OMOGUĆUJE ODABIR GOLA

   /* if(dogadajError) //pozovi error window

    if(golpozicijaError) //pozovi error window
    */

    return (
      <Fragment>
           <img src={gol} alt='handball goal' className={classes.gol}/>
                          <Grid className={classes.golGrid} item container direction='column'>{/*tablica*/}
                            <Grid item container direction='row' xs>{/*redak*/}
                                <Grid item  xs>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(1)} disableRipple variant='outlined' className={[classes.golPolje,classes.gornjiGolPolje,classes.lijeviGolPolje].join(' ')} ></Button>{/*multiple classNames za lement rjesavamo sa joinanjem u string*/}
                                </Grid>
                                <Grid item  xs>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(2)} disableRipple variant='outlined'  className={[classes.golPolje,classes.gornjiGolPolje].join(' ')}></Button>
                                </Grid>
                                <Grid item xs>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(3)} disableRipple variant='outlined'  className={[classes.golPolje,classes.gornjiGolPolje].join(' ')}></Button>
                                </Grid>
                            </Grid>
                            <Grid item container direction='row' xs>
                                <Grid item xs>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(4)} disableRipple variant='outlined'  className={[classes.golPolje,classes.lijeviGolPolje].join(' ')}></Button>
                                </Grid>
                                <Grid item xs>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(5)} disableRipple variant='outlined'  className={classes.golPolje}></Button>
                                </Grid>
                                <Grid item xs>
                                  <Button  disabled={(otkljucanGol)? false : true} onClick={()=>odabraniGol(6)} disableRipple variant='outlined'  className={classes.golPolje}></Button>
                                </Grid>
                            </Grid>
                            <Grid item container direction='row' xs>
                                <Grid item xs>
                                  <Button  disabled={(otkljucanGol)? false : true} onClick={()=>odabraniGol(7)} disableRipple variant='outlined'  className={[classes.golPolje,classes.lijeviGolPolje].join(' ')}></Button>
                                </Grid>
                                <Grid item xs>
                                  <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(8)} disableRipple variant='outlined'  className={classes.golPolje}></Button>
                                </Grid>
                                <Grid item xs>
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
