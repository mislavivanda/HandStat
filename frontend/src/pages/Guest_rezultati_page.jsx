import React,{useState} from 'react'
import {Grid,Box,Typography,Select,MenuItem,FormControl,ListItemText,Checkbox,Chip} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useLazyQuery } from '@apollo/client';
import {dohvatiSvaNatjecanja} from '../graphql/query';
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import ErrorDialog from '../components/ErrorDialog'
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import LigaRezultati from '../components/LigaRezultatiBox';
import {dohvatiRezultateOdabranihNatjecanja} from '../graphql/query';
import {postaviError} from '../redux/slicers/error';
const useStyles=makeStyles((theme)=>({
    loadingItem:{
        position:'fixed',
        top:'50%',
        left:'50%',//centrira na način da stavi margin top 50% visine ekrana od vrha i 50% od sirine ekrana ALI OD BORDERA/EDGEA ELEMENTA-> NEĆE BITI CENTRIRANO JER
        //NPR AKO JE ELEENT SIROK 10% ONDA ĆE MU LIJEVI RUB BITI NA 50% OD LIJEVOG RUBA EKRANA A DESNI 40%->nije centrirano-> rješenje:
        //KADA POMAKNEMO ELEMENT ZA 50% OD RUBA EKRANA ONDA GA MAKNEMO ZA POLOVICU NJEGOVE SIRINE NAZAD->
        //1) ŠIRINA EKRANA= 50%+ŠIRINA ELEMENTA + 50% - ŠIRINA ELEMENTA
        //NAKON POMAKA:
        //ŠIRINA EKRANA=50%-ŠIRINAELEMENTA/2+ŠIRINA ELEMENTA +50%-ŠIRINAELEMENTA/2-> VIDIMO DA SU LIJEVE I DESNE MARGINE JEDNAKE S OBIZROM NA RUB ELEMENTA
        transform: 'translate(-50%, -50%)'//TRANSLATIRAMO PO X I Y OSI U SUPROTNOM SMJERU
    },
    alertItem:{
        position:'fixed',
        top:'50%',
        left:'50%',//centrira na način da stavi margin top 50% visine ekrana od vrha i 50% od sirine ekrana ALI OD BORDERA/EDGEA ELEMENTA-> NEĆE BITI CENTRIRANO JER
        //NPR AKO JE ELEENT SIROK 10% ONDA ĆE MU LIJEVI RUB BITI NA 50% OD LIJEVOG RUBA EKRANA A DESNI 40%->nije centrirano-> rješenje:
        //KADA POMAKNEMO ELEMENT ZA 50% OD RUBA EKRANA ONDA GA MAKNEMO ZA POLOVICU NJEGOVE SIRINE NAZAD->
        //1) ŠIRINA EKRANA= 50%+ŠIRINA ELEMENTA + 50% - ŠIRINA ELEMENTA
        //NAKON POMAKA:
        //ŠIRINA EKRANA=50%-ŠIRINAELEMENTA/2+ŠIRINA ELEMENTA +50%-ŠIRINAELEMENTA/2-> VIDIMO DA SU LIJEVE I DESNE MARGINE JEDNAKE S OBIZROM NA RUB ELEMENTA
        transform: 'translate(-50%, -50%)'//TRANSLATIRAMO PO X I Y OSI U SUPROTNOM SMJERU
    },
    chipListBox:{
        display:'flex',
        flexWrap:'wrap'//da se wrapaju u novi red
    },
    rezultatiContainerBox:{
        borderColor:theme.palette.secondary.main,
        borderStyle:'solid',
        marginTop:50
    }
}))
function Guest_rezultati_page(props) {
    const classes=useStyles();
    const [odabranaNatjecanja,setOdabranaNatjecanja]=useState(null);//prazan dok se ne dohvate sve
    const [errorMessage,setErrorMessage]=useState('');
    const isError=useSelector((state)=>state.error);
    const dispatch=useDispatch();
    //u slucaju errora u ovom dijelu on će proći u glavni return dio jer će uvjet svaNatjecanjaData&&odabranaNatjecanja morat bitit zadovoljen da bi se pozva lazyquery pa ćemo tamo ishandleat u renderu sa error popup
    const [dohvatiRezultate,{data:rezultatiData,loading:rezultatiLoading}]=useLazyQuery(dohvatiRezultateOdabranihNatjecanja,{
        onError:(error)=>{
            setErrorMessage(error.message);
            dispatch(postaviError(true));
        }
    });//dodat novi query koji prima niz idova odabranih natjecanja
    const {data:svaNatjecanjaData,error:svaNatjecanjaError,loading:svaNatjecanjaLoading}=useQuery(dohvatiSvaNatjecanja,{
        onCompleted:(data)=>{
            setOdabranaNatjecanja(data.natjecanja);
            dohvatiRezultate({
                variables:{
                    natjecanja_id:data.natjecanja.map((natjecanje)=>natjecanje.id)//formatirat u niz idova
                }
            });
        }
    });

    function handleSelect(event)
    {
        /*event.target objekt kod multiple seleecta AKO JE NATIVE=FALSE(a po defaultu je, native je implenentirana za html nativnim seelect elementom i za nju trebamo drukcije handleat multiple seleect ALI ima manji bundle size)
        sadrzavati value od seleect elementa u kojem se nalaze 
        svi odabrani clanovi niza-> klik na neki clan koji je selektrian će ga automatski izbacit u event.target.value nizu, ponovni klik ce ga vratit( to radi materialui u pozadini usporeduje trenutni niz sa odabranin elementom pa odlucuje oce ga izbacit ili ostavit ovisno o tome je li vec postoji u nizu value) */
        //pozovi dohvat novih rezultata za novo odabrana natjecanja
        dohvatiRezultate({
            variables:{
                natjecanja_id:event.target.value.map((natjecanje)=>natjecanje.id)//formatirat u niz idova
            }
        });
        setOdabranaNatjecanja(event.target.value);//niz trenutno odabranih natjecanja
    }
    if(svaNatjecanjaLoading||rezultatiLoading||!odabranaNatjecanja)//ako su odabranaNatjecanja null onda se i dalje ucitava komponeneta
    {
        return  (<CircularProgress className={classes.loadingItem} color='primary'/>)
    }
    if(svaNatjecanjaError)
    {
        return (<Alert className={classes.alertItem} severity="error">{svaNatjecanjaError.message}</Alert>)
    }
    if(svaNatjecanjaData&&odabranaNatjecanja)
    {
        return (
            <div>
                <Grid style={{marginTop:100}} container direction='column' alignItems='center' justify='space-around'>{/*parent glavni container */}
                    <Grid style={{marginTop:100}} item container direction='column' alignItems='center' justify='space-between' sm={6} xs={12}  >{/*container od natjecanje selectora*/}
                        <Grid item xs={12}>
                            <Typography align='center' variant='h4' color='secondary'>NATJECANJE</Typography>
                        </Grid>
                        <Grid item container direction='row'>
                            <FormControl style={{width:'100%'}}>
                                    <Box align='right'><SportsHandballIcon/></Box>
                                        <Select
                                        multiple 
                                        value={odabranaNatjecanja} //po defaultu će biti svi idovi u njemu nakon sta ih dohvati
                                        onChange={(e)=>handleSelect(e)} 
                                        renderValue={(odabrana)=>//isa vrijednost kao value u Select komponeneti
                                         (<div className={classes.chipListBox}>
                                                 {
                                                   odabrana.map((natjecanje)=>(
                                                        <Chip style={{margin:3}} key={natjecanje.id} label={natjecanje.naziv+' '+natjecanje.sezona}/>
                                                    ))
                                                }
                                         </div>)
                                        }>
                                            {
                                           svaNatjecanjaData.natjecanja&&svaNatjecanjaData.natjecanja.map((natjecanje)=> 
                                            (<MenuItem key={natjecanje.id} value={natjecanje}>
                                                <Checkbox checked={odabranaNatjecanja.find((odabrani)=>odabrani.id===natjecanje.id)!==undefined} />
                                                <ListItemText primary={natjecanje.naziv+' '+natjecanje.sezona} />
                                            </MenuItem>))
                                            }
                                        </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {
                        (()=>{
                            if(rezultatiLoading)
                            {
                                return (<CircularProgress className={classes.loadingItem} color='primary'/>)
                            }
                            if(rezultatiData)
                            {
                                return (
                                    <Grid item container direction='column' alignItems='center' justify='space-around' xs={12}>{/*container od gridlistova od pojedinih natjecanja*/}
                                        {
                                              rezultatiData.rezultatinatjecanja&&rezultatiData.rezultatinatjecanja.map((natjecanje_rezultati,index)=>{
                                                if(natjecanje_rezultati.kola&&natjecanje_rezultati.kola.length>0)// u slucaju da nema nijedno aktivno kolo sa zavrsenim utakmicama ne vraćamo nikakve rezultate od te lige
                                                {
                                                     return <LigaRezultati key={natjecanje_rezultati.natjecanje.id} natjecanje={natjecanje_rezultati.natjecanje} kola={natjecanje_rezultati.kola} history={props.history}/>
                                                }
                                            })
                                        }
                                    </Grid>
                                )
                            }
                        })()
                    }
                </Grid>
                  {
                    (isError&&errorMessage)?//u slucaju errora pozivamo poopup
                    <ErrorDialog errorText={errorMessage}/>
                    :
                    null
                  }
            </div>)
    }
}

export default Guest_rezultati_page
