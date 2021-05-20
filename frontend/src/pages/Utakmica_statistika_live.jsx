import {React,Fragment,useEffect} from 'react'
import {Box,Typography,AppBar,Grid} from '@material-ui/core';
import {makeStyles,useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import logo from '../images/handstat_logo.png';
import TimStatistika from '../components/TimStatistika';
import DogadajiUtakmice from '../components/DogadajiStatistika';
import GeneralInfo from '../components/UtakmicaGeneralInfo';
import OsobljeInfo from '../components/UtakmicaInfoOsoblje';
import RezultatLiveBox from '../components/RezultatUtakmiceLive';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {odabranTimDomaci,odabranTimGosti,resetirajTimove} from '../redux/slicers/timovi';
import { useDispatch } from 'react-redux';
import {prikazUtakmice} from '../graphql/query';
import { useQuery } from '@apollo/client';//hook za poziv querya
const useStyles = makeStyles((theme)=>({
    appBar:{
        color:'primary',
        display:'flex',
        position:'fixed',
        marginTop:0,
        flexDirection:'row',
        alignItems:'stretch',
        minHeight:50
    },
    logoBox:{
        display: 'inline-flex',//ovako ga iscrtavamo kao inline element pa zauzima onoliko koliko mu zauzimaju djeca dok kod display:flex zauzima koliko god može mjesta odnosno koliko je velik grid
        flexDirection:'row',
        marginLeft:0,
        alignItems:'center',
        justifyContent:'flex-start',
        backgroundColor:'#FFFFFF',
    },
    logo:{
        height:'auto',
        width:'25%',
        maxWidth:50,
    },
    utakmicaPodaciBox:{
        backgroundColor:theme.palette.primary.main
    },
    ligaBox:{
        display:'flex',
        width:'100%',
        flexDirection:'row',
        justifyContent:'center'
    },
    lijeviDesniBoxContainer:{
        marginTop:10
    },
    ekipaBox:{
        display:'flex',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:theme.palette.secondary.main,
        height:60
    },
    rezultatBox:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:theme.palette.primary.main,
        width:'100%',
        height:60
    },
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
    }
}));
function Utakmica_statistika_live(props) {
    const classes=useStyles();
    const dispatch=useDispatch();
    const theme=useTheme();
    const media=useMediaQuery(theme.breakpoints.down('sm'));//za centriranje game info i osoblje info kada dođe na razinu sm
    const brojUtakmice=decodeURIComponent(props.match.params.broj_utakmice).toString();
    const { loading, error, data } = useQuery(prikazUtakmice,{
        variables:{
            broj_utakmice:brojUtakmice
        }
    });
    //kod unmountanja resetirat odabrane timove na null
    useEffect(()=>{
        return ()=>{
           dispatch(resetirajTimove());
        }
    },[]);

    if(loading) return <CircularProgress className={classes.loadingItem} color='primary'/>
    
    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(data)//kada stignu podaci
    {
       //postavi odabrane timove kako bi znali rednera dogadaje utakmice
       dispatch(odabranTimDomaci({id:data.utakmica.domaci.id,naziv:data.utakmica.domaci.naziv,klub_slika:data.utakmica.domaci.image_path}));
       dispatch(odabranTimGosti({id:data.utakmica.gosti.id,naziv:data.utakmica.gosti.naziv,klub_slika:data.utakmica.gosti.image_path}));
        return (
            <div>
            <AppBar className={classes.appBar}>
                <Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography style={{fontWeight:'bold'}} align='center' color='secondary'>HANDSTAT </Typography></Box>
                <Box style={{ flexGrow:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Typography align='center' variant='h6' style={{color:'#FFFFFF'}}>{'UTAKMICA BROJ: '+ brojUtakmice}</Typography></Box>
            </AppBar>
            <Grid  container direction='column' justify='space-evenly' alignItems='center' style={{marginTop:100}}>{/*glavni container*/}
                <Grid item className={classes.utakmicaPodaciBox} container direction='column' justify='space-evenly' alignItems='center' xs={12}>{/*gornji box sa podacima*/}
                    <Grid item container direction='row' justify='center' xs={12}>                                                    {/*tek kada se postave najtecanje i kolo u gameInfo komponenti ih ispisujemo*/}
                        <Box className={classes.ligaBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h5'>{(data.utakmica.kolo+'. KOLO '+data.utakmica.natjecanje.naziv)}</Typography></Box>
                    </Grid>
                    <Grid item className={classes.lijeviDesniBoxContainer} container direction='row' justify={(media)?'center':'space-between'} alignItems='stretch' xs={12}>{/*container od retka koji sadrži 2 stupca podataka*/}
                            <GeneralInfo vrijeme={data.utakmica.vrijeme} gledatelji={data.utakmica.gledatelji} datum={data.utakmica.datum} lokacija={{id:data.utakmica.lokacija.id,dvorana:data.utakmica.lokacija.dvorana,mjesto:data.utakmica.lokacija.mjesto}}/>
                            <OsobljeInfo nadzornik={{maticni_broj:data.utakmica.nadzornik.maticni_broj,ime:data.utakmica.nadzornik.ime,prezime:data.utakmica.nadzornik.prezime}}
                                        lijecnik={(data.utakmica.lijecnik)? {maticni_broj:data.utakmica.lijecnik.maticni_broj,ime:data.utakmica.lijecnik.ime,prezime:data.utakmica.lijecnik.prezime}:null} 
                                        zapisnicar={{maticni_broj:data.utakmica.zapisnicar.maticni_broj,ime:data.utakmica.zapisnicar.ime,prezime:data.utakmica.zapisnicar.prezime}}
                                        mjerac_vremena={(data.utakmica.mjeracvremena)? {maticni_broj:data.utakmica.mjeracvremena.maticni_broj,ime:data.utakmica.mjeracvremena.ime,prezime:data.utakmica.mjeracvremena.prezime}: null}
                                        sudac1={{maticni_broj:data.utakmica.sudac1.maticni_broj,ime:data.utakmica.sudac1.ime,prezime:data.utakmica.sudac1.prezime}}
                                        sudac2={(data.utakmica.sudac2)? {maticni_broj:data.utakmica.sudac2.maticni_broj,ime:data.utakmica.sudac2.ime,prezime:data.utakmica.sudac2.prezime}: null}
                            />
                    </Grid>
                </Grid>
            </Grid>
            <Fragment>
                <RezultatLiveBox domaciNaziv={data.utakmica.domaci.naziv} gostiNaziv={data.utakmica.gosti.naziv} rezultatDomaci={data.utakmica.rezultat_domaci} rezultatGosti={data.utakmica.rezultat_gosti} brojUtakmice={brojUtakmice}/>
                <Grid item  container direction='row' justify='space-evenly' alignItems='center' xs={12}>{/*container koji sadrzi tablice statistike i listu događaja*/}
                    <Grid item  container direction='column' justify='space-evenly' alignItems='center' xs={12} md={7}>{/*container koji sadrzi tablice statistike za oba tima*/}
                        <TimStatistika live={true} tim_id={data.utakmica.domaci.id} broj_utakmice={brojUtakmice} klub_slika={data.utakmica.domaci.image_path} naziv={data.utakmica.domaci.naziv}/>
                        <TimStatistika live={true} tim_id={data.utakmica.gosti.id}  broj_utakmice={brojUtakmice} klub_slika={data.utakmica.gosti.image_path} naziv={data.utakmica.gosti.naziv}/>
                    </Grid>
                    <Grid style={{width:'100%',marginTop:50}} item container direction='row' justify='center' xs={12} md={4}>
                            <DogadajiUtakmice brojUtakmice={brojUtakmice} live={true}/>
                        </Grid>
                </Grid>
            </Fragment>
        </div>
        )
    }
}

export default Utakmica_statistika_live
