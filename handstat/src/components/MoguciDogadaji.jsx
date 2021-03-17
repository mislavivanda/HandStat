import React,{Fragment,useState,useEffect} from 'react'
import {Box,Typography,Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import dogadaji from '../mockdata/dogadaji.js';
import Dogadaj from './MoguciDogadaj.jsx';
import { useSelector, useDispatch } from 'react-redux';
import {otkljucajGol} from '../redux/slicers/otkljucajGol';
import {dodajDogadaj} from '../redux/slicers/dogadajiUtakmice';
import {odabranDogadaj} from '../redux/slicers/odabraniDogadaj';
import {odabranClan} from '../redux/slicers/odabraniClan';
const useStyles=makeStyles((theme)=>({
dogadajiBox:{
    display:'inline-flex',
    flexDirection:'column',
    backgroundColor:theme.palette.primary.main,
    width:'100%'
  }
}));
function MoguciDogadaji() {
    const classes=useStyles();
    const dispatch=useDispatch();
    const [moguciDogadaji,setMoguciDogadaji]=useState(dogadaji);
    const odabraniDogadaj=useSelector(state=>state.odabraniDogadaj.dogadaj);
    const odabraniClan=useSelector(state=>state.odabraniClan.clan);
    const timDomaciId=useSelector(state=>state.timovi.timDomaci.id);
    const time=useSelector(state=>state.timer);
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
            dispatch(dodajDogadaj({
                vrijeme:(time.minutes.toString()+':'+time.seconds.toString()),
                klubikona:1,//ako je domaći->1-> prikazi sliku od odmaćeg tima,inače od gostujućeg NE PSREMAMO SLIKU NEGO SAMO OVI FLAG
                tip:2,
                naziv_dogadaja:odabraniDogadaj.naziv
            }))
          }
          else {
            dispatch(dodajDogadaj({
                vrijeme:(time.minutes.toString()+':'+time.seconds.toString()),
                klubikona:2,//ako je domaći->1-> prikazi sliku od odmaćeg tima,inače od gostujućeg NE PSREMAMO SLIKU NEGO SAMO OVI FLAG
                tip:odabraniDogadaj.tip,
                naziv_dogadaja:odabraniDogadaj.naziv
            }))
          }
          dispatch(odabranDogadaj(null));//nema aktera,samo restirat odabrani dogadaj
        }
        else {//dogadaj koji ima aktera i dogadaj samo bez promjene rezultata-> tip=3
          if(odabraniClan)//mora biti prethodno selektiran i clan odnosno akter
          {
            if(timDomaciId === odabraniClan.klub_id)
            {
            dispatch(dodajDogadaj({
                vrijeme:(time.minutes.toString()+':'+time.seconds.toString()),
                klubikona:1,//ako je domaći->1-> prikazi sliku od odmaćeg tima,inače od gostujućeg NE PSREMAMO SLIKU NEGO SAMO OVI FLAG
                tip:odabraniDogadaj.tip,
                naziv_dogadaja:odabraniDogadaj.naziv,
                ime:odabraniClan.ime,
                prezime:odabraniClan.prezime
            }))
          }
            else {
                dispatch(dodajDogadaj({
                    vrijeme:(time.minutes.toString()+':'+time.seconds.toString()),
                    klubikona:2,//ako je domaći->1-> prikazi sliku od odmaćeg tima,inače od gostujućeg NE PSREMAMO SLIKU NEGO SAMO OVI FLAG
                    tip:odabraniDogadaj.tip,
                    naziv_dogadaja:odabraniDogadaj.naziv,
                    ime:odabraniClan.ime,
                    prezime:odabraniClan.prezime
                   }))
          }
          dispatch(odabranDogadaj(null));
          dispatch(odabranClan(null));
          dispatch(otkljucajGol(false));//ako korisnik stisne slucajno dogadaj gol pa onda prebaci na dogdaj iskljucenje onda bi da ovo ne stavimo gol ostao otkljucan
          }
        }
      }//AKO JE NULL-> ILI JE POČETNO STANJE ILI JE VRAĆEN NA NULL NAKON ODRAĐENOG DOGAĐAJA->NE RADI NIŠTA,NEMA DOGAĐAJA ZA SPREMANJE
      },[odabraniDogadaj])//POZIVA SE KOD SVAKOG ODABIRA DOGAĐAJA
    return (
       <Fragment>
            <Typography align='center' variant='h4'>DOGAĐAJ</Typography>
            <Box className={classes.dogadajiBox}>
            {moguciDogadaji.map((dogadaj)=>{
                return  <Dogadaj key={dogadaj.id} id={dogadaj.id} naziv={dogadaj.naziv} tip={dogadaj.tip} id={dogadaj.id}/>
            })}                                   
            </Box>
       </Fragment>
    )
}

export default MoguciDogadaji
