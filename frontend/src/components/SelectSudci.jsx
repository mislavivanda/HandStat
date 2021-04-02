import React,{Fragment,useState} from 'react'
import {Typography,Box,Select,MenuItem,FormControl,InputLabel,Grid} from '@material-ui/core'
import {useDispatch,useSelector } from 'react-redux';
import {sudac1Odabran,sudac2Odabran} from '../redux/slicers/sudci';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SportsIcon from '@material-ui/icons/Sports';
import { useQuery } from '@apollo/client';
import {dohvatiSveSuce} from '../graphql/query';
import Alert from '@material-ui/lab/Alert';
export default function Sudci() {
  const dispatch=useDispatch();
  const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
  const {sudac1,sudac2}=useSelector(state=>state.sudci);
  const [sudacPreostali,setSudacPreostali]=useState(null);//prazno dok ne dohvatimo suce, možd POVEZAT SUDCE SA NATJECANJIMA U BAZI DA MANJE PODATAKA DOHVAĆAMO
  function odabranSudac(odabranSudac,broj)//broj oznacava je li sudac1 ili sudac2
  {
    let new_array=sudacPreostali.filter((sudac)=>sudac.maticni_broj!==odabranSudac.maticni_broj);//izbacit odabranog suca iz niza preostlaih
    if(broj===1)//sudac1
    {
      //ako je odabran neki od 2 suca prethodno onda nakon odabira drugoga moramo vratiti prethodno odabranog(koji postoji ako je sudac1 ili 2 razlicit od null) u niz preostalih
      if(sudac1)//ako je prethodno sudac1= null onda nije bio nijedan odabran-> ne trebamo vraćat ništa u preostale
      {
        setSudacPreostali([...new_array,{maticni_broj:sudac1.maticni_broj,ime:sudac1.ime,prezime:sudac1.prezime,mjesto:sudac1.mjesto}]);
      }
      else
      {
        setSudacPreostali(new_array);
      }
      dispatch(sudac1Odabran(odabranSudac));
  }
  else
  {
    if(sudac2)
    {
      setSudacPreostali([...new_array,{maticni_broj:sudac2.maticni_broj,ime:sudac2.ime,prezime:sudac2.prezime,mjesto:sudac2.mjesto}]);
    }
    else
    {
      setSudacPreostali(new_array);
    }
    dispatch(sudac2Odabran(odabranSudac));
  }
}
const {loading,error,data}=useQuery(dohvatiSveSuce);

if(loading) return null;

if(error) return (<Alert severity="error">{error.message}</Alert>);

if(data)
{
  if(!sudacPreostali)//KADA POSTAVIMO DONJI STATE KOMPONENTA ĆE SE RERENDERAT-> NEĆE PONOVNO POZVATI USEQUERY ALI ĆE PONOVNO POSTAVIT STATE I TSE PONOVO REREDNERAT ITD-> ERROR:TO MANY REREDNERS
  //POSTAVLJAMO STATE SAMO PRVI PUT ODNOSNO KADA JE ON NULL-> TAKO SE ZASITIMO OD BESKONACNOG RERENDERANJA
  {
  setSudacPreostali(data.suci);//postavi ih u state nakon dohvata
  }
    return (
      <Fragment>
                     <Grid item container  direction='row' justify='space-around' alignItems='center' xs={12} > {/* redak sudca*/}
                                  <Grid item  style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}} xs={12} sm={6}>
                                  <FormControl style={{width:'80%',margin:'0 auto'}}>
                                  <Box align='right'><SportsIcon/></Box>
                                    <InputLabel> SUDAC 1</InputLabel>
                                    <Select disabled={(spremljenGameInfo)? true : false} value={(sudac1)? sudac1 : ''} renderValue={(sudac1)=>(sudac1.maticni_broj+' '+sudac1.ime+' '+sudac1.prezime)} onChange={(e)=>odabranSudac(e.target.value,1)}>{/*//da znamo koji je sudac odabran za postavit state*/}
                                    {sudacPreostali&&sudacPreostali.map((sudac)=><MenuItem key={sudac.maticni_broj} value={sudac}><Typography color='secondary'>{sudac.maticni_broj+' '+sudac.ime+' '+sudac.prezime}</Typography></MenuItem>)}
                                    </Select>
                                  </FormControl>
                                  </Grid>
                                  <Grid item container direction='row' xs={12} sm={5}>
                                  <Grid item  xs={12}>
                                      <Box style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                                        <Typography style={{marginTop:'1em'}} align='center' color='secondary' variant='h6'>IZ</Typography>{/*1em je relativna viisna ikone pa da budu u ravnini*/}
                                        <Box>
                                          <Box align='right'><LocationOnIcon/></Box>
                                          <Typography align='center'>{(sudac1)? sudac1.mjesto : ' '}</Typography>
                                        </Box>
                                      </Box>
                                  </Grid>
                                  </Grid>
                        </Grid>
                        <Grid item container  direction='row' justify='space-around' alignItems='center' xs={12} > {/* redak sudca*/}
                                  <Grid item  style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}} xs={12} sm={6}>
                                  <FormControl style={{width:'80%',margin:'0 auto'}}>
                                  <Box align='right'><SportsIcon/></Box>
                                    <InputLabel> SUDAC 2</InputLabel>
                                    <Select disabled={(spremljenGameInfo)? true : false} value={(sudac2)? sudac2 : ''} renderValue={(sudac2)=>(sudac2.maticni_broj+' '+sudac2.ime+' '+sudac2.prezime)} onChange={(e)=>odabranSudac(e.target.value,2)} >
                                    {sudacPreostali&&sudacPreostali.map((sudac)=><MenuItem key={sudac.maticni_broj} value={sudac}><Typography color='secondary'>{sudac.maticni_broj+' '+sudac.ime+' '+sudac.prezime}</Typography></MenuItem>)}
                                    </Select>
                                  </FormControl>
                                  </Grid>
                                  <Grid item container direction='row' xs={12} sm={5}>
                                    <Grid item  xs={12}>
                                      <Box style={{display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
                                        <Typography style={{marginTop:'1em'}} align='center' color='secondary' variant='h6'>IZ</Typography>{/*1em je relativna viisna ikone pa da budu u ravnini*/}
                                        <Box>
                                          <Box align='right'><LocationOnIcon/></Box>
                                          <Typography align='center'>{(sudac2)? sudac2.mjesto : ' '}</Typography>
                                        </Box>
                                      </Box>
                                  </Grid>
                                </Grid>
                        </Grid>
      </Fragment>
    )
}
}
