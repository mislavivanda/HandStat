import React,{Fragment,useState,useEffect} from 'react'
import klub from '../images/zagreb.jpg';
import {Typography,Box,Select,MenuItem,FormControl,InputLabel,Grid} from '@material-ui/core'
import {odabranTimDomaci,odabranTimGosti} from '../redux/slicers/timovi';
import { useSelector,useDispatch } from 'react-redux';
import { useLazyQuery } from '@apollo/client';
import {dohvatiSveKluboveOdNatjecanja} from '../graphql/query';
import Alert from '@material-ui/lab/Alert';
function SelectKlubovi() {
    const dispatch=useDispatch();
    const {timDomaci,timGosti}=useSelector(state=>state.timovi);
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const natjecanje=useSelector(state=>state.natjecanje.odabranoNatjecanje);//DOHVAĆAMO SAMO KLUBOVE IZ ODABRANOG NATJECANJA
    const [timPreostali,setTimPreostali]=useState(null);
    function odabranTim(odabranTim,broj)//broj označava je li riječ o domaćem ili gostujućem timu
    {
      let new_array=timPreostali.filter((tim)=>tim.id!==odabranTim.id);
      if(broj===1)
      {//id=null znaci da nije jos odabran taj tim
        if(timDomaci)//isti princip kao za suce
        {
          setTimPreostali([...new_array,{id:timDomaci.id,naziv:timDomaci.naziv}]);
        }
        else
        {
          setTimPreostali(new_array);
        }
        dispatch(odabranTimDomaci({id:odabranTim.id,naziv:odabranTim.naziv,klub_slika:klub}));
      }
      else
      {
        if(timGosti)
        {
          setTimPreostali([...new_array,{id:timGosti.id,naziv:timGosti.naziv}]);
        }
        else
        {
          setTimPreostali(new_array);
        }
      dispatch(odabranTimGosti({id:odabranTim.id,naziv:odabranTim.naziv,klub_slika:klub}));
      }
  }
   const [dohvatiKlubove,{loading,error,data}]=useLazyQuery(dohvatiSveKluboveOdNatjecanja,{
    onCompleted(data){//POZIVA SE ako se USPJEŠNO IZVRŠI QUERY
      setTimPreostali(data.klubovi);//postavi dohvaćene klubove
    }
   })//ne poziva se odmah nego kad pozovoemo dohvatiKlubove funkciju koju je vratila

   useEffect(()=>{
    if(natjecanje)//osigurat se da je razlicito od null-> ODABRANO
    {
      dohvatiKlubove({//poziva query i onda se izvodi donji dio s loading,error i data
        variables:{natjecanje_id:natjecanje.id}
    });
    console.log('Pozvan query');
    //OČISTI TRENUTNO ODABRANA NATJECANJA AKO IH IMA-> POSTAVIT ODABRANE TIMOVE NA NULL
    dispatch(odabranTimDomaci(null));
    dispatch(odabranTimGosti(null));
    }
   },[natjecanje]);//poziva se kod svake promjene odabira natjecanja-> dohvat novihh klubova

  if(loading) return null;

  if(error) return (<Alert severity="error">{error.message}</Alert>);

  if(data)
  {
    console.log('DATA: '+JSON.stringify(data)+' state: '+JSON.stringify(timPreostali));
    return (
       <Fragment>
             <Grid  item style={{textAlign: 'center'}}  xs={12} md={5}>
                          <FormControl style={{width:'80%',margin:'0 auto'}}>
                                    <InputLabel>DOMAĆI</InputLabel>
                                    <Select disabled={(spremljenGameInfo)? true : false} value={(timDomaci)? timDomaci : ''} renderValue={(value)=>value.naziv } onChange={(e)=>odabranTim(e.target.value,1)} >
                                    {timPreostali&&timPreostali.map((tim)=><MenuItem key={tim.id} value={tim}><Typography color='secondary'>{tim.naziv}</Typography></MenuItem>)}
                                    </Select>
                                  </FormControl>
                          </Grid>
                            <Grid  item style={{textAlign:'center'}} xs={12} md={1}>
                              <Box style={{display:'inline-flex',alignItems:'center'}}><Typography align='center' color='secondary' variant='h5'>VS</Typography></Box>
                            </Grid>
                          <Grid  item style={{textAlign: 'center'}} xs={12} md={5}>
                          <FormControl style={{width:'80%',margin:'0 auto'}}>
                                    <InputLabel>GOSTI</InputLabel>
                                    <Select disabled={(spremljenGameInfo)? true : false} value={(timGosti)? timGosti : ''} renderValue={(value)=> value.naziv} onChange={(e)=>odabranTim(e.target.value,2)} >
                                    {timPreostali&&timPreostali.map((tim)=><MenuItem key={tim.id} value={tim}><Typography color='secondary'>{tim.naziv}</Typography></MenuItem>)}
                                    </Select>
                                </FormControl>
            </Grid>
       </Fragment>
    )
  }
  return null;//ZA SLUČAJ DOK JOŠ NIJE POZVAN QUERY-> VRATIMO NULL TAKO DA SE NE PRIKAŽE MOGUĆNOST ODABIRA KLUBOVA DOK SE NE ODABERE NATJECANJE

}

export default SelectKlubovi
