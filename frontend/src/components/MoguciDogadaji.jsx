import React,{Fragment,useState,useEffect} from 'react'
import {Box,Typography,Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Dogadaj from './MoguciDogadaj.jsx';
import { useSelector, useDispatch } from 'react-redux';
import {otkljucajGol} from '../redux/slicers/otkljucajGol';
import {dodajDogadaj} from '../redux/slicers/dogadajiUtakmice';
import {odabranDogadaj} from '../redux/slicers/odabraniDogadaj';
import {odabranClan} from '../redux/slicers/odabraniClan';
import { useQuery,useMutation } from '@apollo/client';
import {dohvatiSveMoguceDogadaje} from '../graphql/query';
import {spremiDogadaj} from '../graphql/mutation';
import Alert from '@material-ui/lab/Alert';
const useStyles=makeStyles((theme)=>({
dogadajiBox:{
    display:'inline-flex',
    flexDirection:'column',
    backgroundColor:theme.palette.primary.main,
    width:'100%'
  },
  mutationErrorItem:{
    position:'fixed',
    top:'50%',//centrira na način da stavi margin top 50% visine ekrana od vrha i 50% od sirin ekrana
    left:'50%'
}
}));
function MoguciDogadaji() {
    const classes=useStyles();
    const dispatch=useDispatch();
    const brojUtakmice=useSelector(state=>state.brojUtakmice);
    const odabraniDogadaj=useSelector(state=>state.odabraniDogadaj.dogadaj);
    const odabraniClan=useSelector(state=>state.odabraniClan.clan);
    const timDomaciId=useSelector(state=>state.timovi.timDomaci.id);
    const time=useSelector(state=>state.timer);
    const [spremiOdabraniDogadaj,{error:mutationError}]=useMutation(spremiDogadaj,{
      onCompleted:(data)=>{
        dispatch(dodajDogadaj({
          id:data.spremidogadaj.dogadaj.id,
          vrijeme:data.spremidogadaj.vrijeme,
          klubikona:data.spremidogadaj.tim,//ako je domaći->1-> prikazi sliku od odmaćeg tima,inače od gostujućeg NE PSREMAMO SLIKU NEGO SAMO OVI FLAG
          tip:data.spremidogadaj.dogadaj.tip,
          naziv_dogadaja:data.spremidogadaj.dogadaj.naziv,
          ime:(data.spremidogadaj.akter)? data.spremidogadaj.akter.ime : null,
          prezime:(data.spremidogadaj.akter)? data.spremidogadaj.akter.prezime : null,
          domaci:data.spremidogadaj.rez_domaci,
          gosti:data.spremidogadaj.rez_gosti
      }))
      }
    });
    useEffect(()=>{//poziva se kod odabira dogadaja da vidi jel se može branka otključati
        if(odabraniDogadaj)//ako je različit od null onda ima misla to doli provjeravat
        {
        if(odabraniDogadaj.id>=1 && odabraniDogadaj.id<=8)//ovo su događaji za koje otključavamo branku
        {
          console.log('Otključaj branku');
          dispatch(otkljucajGol(true));
        }
        else if(odabraniDogadaj.tip===2)//ovo su dogadaji kao timeout gosti i domaci-> bez aktera samo dogadaj-> spremi ga u niz dogadaja utakmice
        {
          if(odabraniDogadaj.id===15)//timeout domaći,DOGOVORIMO U BAZI KOJE ĆEMO IDOVE PRIDZUTI OVIM DOGADAJIMA
          {
            spremiOdabraniDogadaj({
              variables:{
                broj_utakmice:brojUtakmice,
                vrijeme:(time.minutes.toString()+':'+time.seconds.toString()),
                klubgrb:1,
                dogadaj_id:odabraniDogadaj.id,
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
              }
            })
          }
          dispatch(odabranDogadaj(null));//nema aktera,samo restirat odabrani dogadaj
        }
        else {//dogadaj koji ima aktera i dogadaj samo bez promjene rezultata-> tip=3
          if(odabraniClan)//mora biti prethodno selektiran i clan odnosno akter
          {
            if(timDomaciId === odabraniClan.klub_id)
            {
            spremiOdabraniDogadaj({
              variables:{
                broj_utakmice:brojUtakmice,
                vrijeme:(time.minutes.toString()+':'+time.seconds.toString()),
                klubgrb:1,
                dogadaj_id:odabraniDogadaj.id,
                maticni_broj:odabraniClan.maticni_broj
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
                  maticni_broj:odabraniClan.maticni_broj
                }
              })
          }
          dispatch(odabranDogadaj(null));
          dispatch(odabranClan(null));
          dispatch(otkljucajGol(false));//ako korisnik stisne slucajno dogadaj gol pa onda prebaci na dogdaj iskljucenje onda bi da ovo ne stavimo gol ostao otkljucan
          }
        }
      }//AKO JE NULL-> ILI JE POČETNO STANJE ILI JE VRAĆEN NA NULL NAKON ODRAĐENOG DOGAĐAJA->NE RADI NIŠTA,NEMA DOGAĐAJA ZA SPREMANJE
      },[odabraniDogadaj])//POZIVA SE KOD SVAKOG ODABIRA DOGAĐAJA

    const{loading:queryLoading,error:queryError,data}=useQuery(dohvatiSveMoguceDogadaje);

    if(queryLoading) return null;

    if(queryError) return (<Alert severity="error">{queryError.message}</Alert>);
    
   /* if(mutationError) //pozovi error window*/

    if(data)
    {
      return (
        <Fragment>
              <Typography align='center' variant='h4'>DOGAĐAJ</Typography>
              <Box className={classes.dogadajiBox}>
              {data.dogadaji.map((dogadaj)=>{
                  return  <Dogadaj key={dogadaj.id} id={dogadaj.id} naziv={dogadaj.naziv} tip={dogadaj.tip} id={dogadaj.id}/>
              })}                                   
              </Box>
        </Fragment>
      )
    }
}

export default MoguciDogadaji
