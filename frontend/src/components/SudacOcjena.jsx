import React,{useState,Fragment} from 'react'
import {Box,Typography,Button,Grid,TextField,FormControl,InputLabel} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import SportsIcon from '@material-ui/icons/Sports';
import CancelIcon from '@material-ui/icons/Cancel';
import GradeIcon from '@material-ui/icons/Grade';
import {ponistiZavrsetakUtakmice} from '../redux/slicers/zavrsiUtakmicu';
import { useSelector,useDispatch} from 'react-redux';
import { useMutation } from '@apollo/client';
import { zavrsiUtakmicu} from '../graphql/mutation';
import {brojUtakmiceUnesen} from '../redux/slicers/brojUtakmice';
import {postaviDatum} from '../redux/slicers/datum';
import {gledateljiOdabrani} from '../redux/slicers/gledatelji';
import {odabranoKolo} from '../redux/slicers/kolo';
import {lijecnikOdabran} from '../redux/slicers/lijecnik';
import {mjeracOdabran} from '../redux/slicers/mjeracVremena';
import {nadzornikOdabran} from '../redux/slicers/nadzornik';
import {zapisnicarOdabran} from '../redux/slicers/zapisnicar';
import {lokacijaOdabrana} from '../redux/slicers/lokacija';
import {natjecanjeOdabir} from '../redux/slicers/natjecanje';
import {resetirajDogadaje} from '../redux/slicers/dogadajiUtakmice';
import {odabranClan} from '../redux/slicers/odabraniClan';
import {odabranDogadaj} from '../redux/slicers/odabraniDogadaj';
import  {otkljucajGol} from '../redux/slicers/otkljucajGol';
import {resetirajRezultat} from '../redux/slicers/rezultat';
import {spremiUtakmicu} from '../redux/slicers/spremiUtakmicu';
import {sudac1Odabran,sudac2Odabran} from '../redux/slicers/sudci';
import {resetirajTimer} from '../redux/slicers/timer';
import {resetirajTimove} from '../redux/slicers/timovi';
import {postaviVrijeme} from '../redux/slicers/vrijeme';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorDialog from './ErrorDialog';
import {postaviError} from '../redux/slicers/error';
import {adminLoginStatus} from '../redux/slicers/adminLogged';
function SudacOcjena({history}) {
    //primamo history objekt kako bi nakon zavesetka i spremanja utakmice preusmjerili na home page sa history.replace
    const dispatch=useDispatch();
    const {sudac1,sudac2}=useSelector(state=>state.sudci);
    const [ocjena1,setOcjena1]=useState(1);
    const [ocjena2,setOcjena2]=useState(1);
    const brojUtakmice=useSelector(state=>state.brojUtakmice);
    const {timDomaci,timGosti}=useSelector(state=>state.rezultat);
    const [spremiZavrsiUtakmicu,{loading,error}]=useMutation(zavrsiUtakmicu,{
        //nakon spremanja podataka će biti automatski premjesten na home page i ODLOGIRAN-> MAKNUT ĆE MU SE SESSION COOKIE
        onCompleted:(data)=>{
             //preusmjeri na homepage nakon uspješnog spremanja
            history.replace('/');
            //ODLOGIRAJ KORISNIKA-> AKO JE QUER USPJEŠNO COMPLETAN ONDA JE CLEARAN SESSION COOKIE U BROWSERU I IZBRISAN IZ MEMORY STOREA NA SERVERU
            dispatch(adminLoginStatus(false));
            //OČISTI SVE GLOBAL STATEOVE OD STRANICE VOĐENJA STATISTIKE ODNOSNO POSTAVIT IH NAZAD NA DEFAULTNE VRIJEDNOSTI
            dispatch(brojUtakmiceUnesen(''));
            dispatch(postaviDatum(''));
            dispatch(gledateljiOdabrani(0));
            dispatch(odabranoKolo(0));
            dispatch(lijecnikOdabran(null));
            dispatch(mjeracOdabran(null));
            dispatch(nadzornikOdabran(null));
            dispatch(zapisnicarOdabran(null));
            dispatch(lokacijaOdabrana(null));
            dispatch(natjecanjeOdabir(null));
            dispatch(resetirajDogadaje());
            dispatch(odabranClan(null));
            dispatch(odabranDogadaj(null));
            dispatch(otkljucajGol(false));
            dispatch(resetirajRezultat());
            dispatch(spremiUtakmicu(false));
            dispatch(sudac1Odabran(null));
            dispatch(sudac2Odabran(null));
            dispatch(resetirajTimer());
            dispatch(resetirajTimove());
            dispatch(postaviVrijeme(''));
            dispatch(ponistiZavrsetakUtakmice());
        },
        onError:(error)=>{
            dispatch(postaviError(true));
        }
    })
    function handleChangeOcjena1(value)
    {
        setOcjena1(value);
    }
    function handleChangeOcjena2(value)
    {
        setOcjena2(value);
    }
    function spremiZavrsi()
    {
        spremiZavrsiUtakmicu({
            variables:{
                broj_utakmice:brojUtakmice,
                rez_domaci:timDomaci,
                rez_gosti:timGosti,
                sudac1_ocjena:ocjena1,
                sudac2_ocjena:ocjena2
            }
        })
    }
    function ponistiZavrsi()//kada ne zelimo zavrsit utakmicu i unit ocjene sudaca
    {
        dispatch(ponistiZavrsetakUtakmice());
    }
    return (
    <Fragment>
       <Grid container direction='column' justify='space-evenly' alignItems='center' style={{marginTop:50}}>{/*glavni container od sudaca koji sadrzi 2 retka za unos ocjene*/}
            <Grid item container xs={12} direction='row' justify='space-around' alignItems='center'>
                <Typography color='secondary' align='center'variant='h6'>UNESITE OCJENE SUDACA</Typography>
            </Grid>
            <Grid item container direction='row' justify='space-around' alignItems='center' xs={12} style={{marginTop:20}}>{/*redak prvog suca*/}
                <Grid item container xs={12} sm={6} direction='row' justify='center' > 
                    <FormControl >
                            <Box align='right' ><SportsIcon/></Box>
                             <Box><Typography align='left' color='secondary'>SUDAC1</Typography> </Box>
                        <Typography variant='h6' color='secondary' align='center'>{sudac1.maticni_broj+' '+sudac1.ime+' '+sudac1.prezime}</Typography>
                    </FormControl>
                </Grid>
                <Grid item container xs={12} sm={6} direction='row' justify='center'>
                <FormControl style={{margin:'0 auto'}}>
                            <Box align='right' ><GradeIcon/></Box>
                                <InputLabel >OCJENA</InputLabel>
                                <TextField
                                type="number"
                                inputProps={{min:1,max:5, step:0.1}}
                                label=" "
                                value={ocjena1}
                                onChange={(e)=>handleChangeOcjena1(parseFloat(e.target.value))}
                                />
                </FormControl>
                </Grid>
            </Grid>   {/*obavezno je da bude 1 sudac,drugi sudac moze biti opcionalan npr utakmice djece */}
            {
            (sudac2)?

            (<Grid item container direction='row' justify='space-around' alignItems='center' xs={12} style={{marginTop:20}}>{/*redak drugog suca*/}
                <Grid item container xs={12} sm={6} direction='row' justify='center' >
                    <FormControl >
                            <Box align='right' ><SportsIcon/></Box>
                             <Box><Typography align='left' color='secondary'>SUDAC2</Typography> </Box>
                        <Typography variant='h6' color='secondary' align='center'>{sudac2.maticni_broj+' '+sudac2.ime+' '+sudac2.prezime}</Typography>
                    </FormControl>
                </Grid>
                <Grid item container xs={12} sm={6} direction='row' justify='center'>
                <FormControl style={{margin:'0 auto'}}>
                            <Box align='right' ><GradeIcon/></Box>
                                <InputLabel>OCJENA</InputLabel>
                                <TextField
                                type="number" 
                                inputProps={{min:1,max:5, step:0.1}}
                                label=" "
                                value={ocjena2}
                                onChange={(e)=>handleChangeOcjena2(parseFloat(e.target.value))}
                                />
                </FormControl>
                </Grid>
            </Grid>)
            :
            null
            }
            <Grid item container style={{marginTop:10}} spacing={3}  direction='row' justify='center' alignItems='center' xs={12}>
                <Grid container item direction='row' justify='flex-end' alignItems='center' xs={6}>
                    {
                        (()=>{
                            if(loading) return <CircularProgress color='primary'/>

                            return ( <Button  onClick={()=>spremiZavrsi()} disableRipple size='large' variant='contained' color='secondary' endIcon={<SaveIcon/>} title='Spremi i završi' >SPREMI</Button>)
                        })()
                    }
                </Grid>
                <Grid container item direction='row' justify='flex-start' alignItems='center' xs={6}>
                    <Button  onClick={()=>ponistiZavrsi()} disableRipple size='large' variant='contained' color='primary' endIcon={<CancelIcon/>} title='Otkaži spremanje' >OTKAŽI</Button>
                </Grid>
            </Grid>
       </Grid>
       {
           (error&&error.message)?
           <ErrorDialog errorText={error.message}/>
           :
           null
       }
    </Fragment>
    )
}

export default SudacOcjena
