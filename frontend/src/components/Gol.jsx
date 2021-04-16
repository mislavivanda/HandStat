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
    gol:{               /*image je sa auto uvik na oko 95% pa stavimo visinu girda 90% + gornja margina 5% i pratit će se responzivno*/ 
        marginTop:'4%',
        height:'auto',
        width:'100%'
      },
      golGrid:{
        borderTopWidth:4,
        borderTopColor:theme.palette.secondary.main,
        borderTopStyle:'solid',
        borderLeftWidth:4,
        borderLeftColor:theme.palette.secondary.main,
        borderLeftStyle:'solid',
        borderRadius:0,
        position:'absolute',
        marginTop:'7%',//odbijemo visinu prećke oko 3% visine i marginu od 4% 
        width:'92%',/*kada odbijemo sirine 2 stative dobijemo oko 92% sirinu grida-> sirina 2 stative uzima 8% jer je slika sira ,a sirina prećke zauzima 10% jer je visina manja*/
        height:'90%'/*slika gola se prikazuje uvik sa  oko 96% height pa kad odbijemo visinu prećke oko 6% visine dobijemo oko 90%*/
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
      mutationErrorItem:{
        position:'fixed',
        top:'50%',//centrira na način da stavi margin top 50% visine ekrana od vrha i 50% od sirin ekrana
        left:'50%'
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
    const timDomaciId=useSelector(state=>state.timovi.timDomaci.id);
    const timGostiId=useSelector(state=>state.timovi.timGosti.id);
    const time=useSelector(state=>state.timer);
    let domaciRez=useSelector(state=>state.rezultat.timDomaci);
    let gostiRez=useSelector(state=> state.rezultat.timGosti);
    const [spremiOdabraniDogadaj,{error:dogadajError}]=useMutation(spremiDogadaj,{
      onCompleted:(data)=>{
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
      if(odabraniDogadaj.tip===1 && (timDomaciId===odabraniClan.klub_id))//za golove promijenimo i rezultat
      {
        dispatch(incrementDomaci());
        domaciRez+=1;//uvećamo odma jer je setter asinkron pa nam se dolje kod saveanja dogadaja ne stigne saveati prava vrijednost nego kasni za 1 rezultat
      }
      else if(odabraniDogadaj.tip===1 && (timGostiId===odabraniClan.klub_id))
      {
       dispatch(incrementGosti());
       gostiRez+=1;
      }
      //SPREMI DOGAĐAJ I SPREMI U BAZU DIO KOJI SE ODNOSI NA POZICIJU GOLA
      if(timDomaciId=== odabraniClan.klub_id)
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
                                                        <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(1)} disableRipple variant='outlined' className={classes.golPolje}></Button>
                                                      </Grid>
                                                      <Grid item  xs>
                                                      <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(2)} disableRipple variant='outlined'  className={classes.golPolje}></Button>
                                                      </Grid>
                                                      <Grid item xs>
                                                      <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(3)} disableRipple variant='outlined'  className={classes.golPolje}></Button>
                                                      </Grid>
                                                </Grid>
                                                <Grid item container direction='row' xs>
                                                      <Grid item xs>
                                                      <Button  disabled={(otkljucanGol)? false : true}  onClick={()=>odabraniGol(4)} disableRipple variant='outlined'  className={classes.golPolje}></Button>
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
                                                      <Button  disabled={(otkljucanGol)? false : true} onClick={()=>odabraniGol(7)} disableRipple variant='outlined'  className={classes.golPolje}></Button>
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
