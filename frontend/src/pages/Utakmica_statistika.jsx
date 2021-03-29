import {React,useState,useEffect,Fragment} from 'react'
import {Box,Typography,AppBar,Grid} from '@material-ui/core';
import klub from '../images/zagreb.jpg';
import klub2 from '../images/barcelona.png';
import {makeStyles} from '@material-ui/core/styles';
import logo from '../images/handstat_logo.png';
import TimStatistika from '../components/TimStatistika';
import DogadajiUtakmice from '../components/DogadajiStatistika';
import GeneralInfo from '../components/UtakmicaGeneralInfo';
import OsobljeInfo from '../components/UtakmicaInfoOsoblje';
import utakmica from '../mockdata/utakmica.js';
import {odabranTimDomaci,odabranTimGosti} from '../redux/slicers/timovi';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
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
    ligaBox:{
        display:'flex',
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor:theme.palette.primary.main
    },
    lijeviDesniBoxContainer:{
        marginTop:5,
        backgroundColor:theme.palette.primary.main
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
    }

}))
function Utakmica_statistika(props) {
    const classes=useStyles();
    const dispatch=useDispatch();
    const brojUtakmice=decodeURIComponent(props.match.params.broj_utakmice).toString();//match.params je objekt koji sadrzi djelove URL po key value dijelu-> kod definicije rute za ovaj path stvili smo da se taj dio naziv :broj_utakmice pa ga na taj nacin mozemo i izvadit
    //appolo sam vodi racuna o promjenama stanja zahtjeva i ceka na zahtjev, oaj query se poziva odmah cim se komponent mounta
    //KOMPONENTA ĆE SE RENDERAT 2 PUTA JER CE SE PROMIJENIT STANJE LOADINGA PA ĆE TO UZROKOVATI DRUGI RERENDER
    const { loading, error, data } = useQuery(prikazUtakmice,{
        variables:{
            broj_utakmice:brojUtakmice
        }
    });
    if(loading) return <CircularProgress color='primary'/>
    
    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(data)//kada stignu podaci
    {
        //postavi timove da druge komponenete znaju koji su timovi odabrani
        dispatch(odabranTimDomaci({id:data.utakmica.domaci.id,naziv:data.utakmica.domaci.naziv,klub_slika:klub}));
        dispatch(odabranTimGosti({id:data.utakmica.gosti.id,naziv:data.utakmica.gosti.naziv,klub_slika:klub2}));
    return (
        <div>
             
             <AppBar className={classes.appBar}>
                    <Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography style={{fontWeight:'bold'}} align='center' color='secondary'>HANDSTAT </Typography></Box>
                    <Box style={{ flexGrow:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Typography align='center' variant='h6' style={{color:'#FFFFFF'}}>{'UTAKMICA BROJ: '+ brojUtakmice}</Typography></Box>
            </AppBar>
            <Grid  container direction='column' justify='space-evenly' alignItems='center' style={{marginTop:100}}>{/*glavni container*/}
                <Grid item  container direction='column' justify='space-evenly' alignItems='center' xs={12}>{/*gornji box sa podacima*/}
                    <Grid item container direction='row' justify='center' xs={12}>                                                    {/*tek kada se postave najtecanje i kolo u gameInfo komponenti ih ispisujemo*/}
                        <Box className={classes.ligaBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h5'>{(data.utakmica.kolo+'. KOLO '+data.utakmica.natjecanje.naziv)}</Typography></Box>
                    </Grid>
                    <Grid item className={classes.lijeviDesniBoxContainer} container direction='row' justify='space-between' alignItems='stretch' xs={12}>{/*container od retka koji sadrži 2 stupca podataka*/}
                        <GeneralInfo vrijeme={data.utakmica.vrijeme} gledatelji={data.utakmica.gledatelji} datum={data.utakmica.datum} lokacija={{id:data.utakmica.lokacija.id,dvorana:data.utakmica.lokacija.dvorana,mjesto:data.utakmica.lokacija.mjesto}}/>
                        <OsobljeInfo nadzornik={{maticni_broj:data.utakmica.nadzornik.maticni_broj,ime:data.utakmica.nadzornik.ime,prezime:data.utakmica.nadzornik.prezime}}
                                     lijecnik={{maticni_broj:data.utakmica.lijecnik.maticni_broj,ime:data.utakmica.lijecnik.ime,prezime:data.utakmica.lijecnik.prezime}} 
                                     zapisnicar={{maticni_broj:data.utakmica.zapisnicar.maticni_broj,ime:data.utakmica.zapisnicar.ime,prezime:data.utakmica.zapisnicar.prezime}}
                                     mjerac_vremena={{maticni_broj:data.utakmica.mjeracvremena.maticni_broj,ime:data.utakmica.mjeracvremena.ime,prezime:data.utakmica.mjeracvremena.prezime}}
                                     sudac1={{maticni_broj:data.utakmica.sudac1.maticni_broj,ime:data.utakmica.sudac1.ime,prezime:data.utakmica.sudac1.prezime}}
                                     sudac2={{maticni_broj:data.utakmica.sudac2.maticni_broj,ime:data.utakmica.sudac2.ime,prezime:data.utakmica.sudac2.prezime}}
                        />
                    </Grid>
                </Grid>
            </Grid>
                <Fragment>
                <Grid item container direction='row' justify='space-evenly' alignItems='stretch' style={{marginTop:50}} xs={12}>{/*container od rezultata*/}
                   <Grid item container direction='row' justify='center' alignItems='center' xs={12} md={5}>
                        <Box  className={classes.ekipaBox}>
                            <Typography variant='h5' style={{color:'#FFFFFF'}}>{data.utakmica.domaci.naziv}</Typography>
                        </Box>
                   </Grid>
                    <Grid item container direction='row' justify='center' alignItems='center'  xs={12} md={2}>
                        <Box className={classes.rezultatBox}> <Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>{data.utakmica.rezultat_domaci+':'+data.utakmica.rezultat_gosti}</Typography></Box>
                    </Grid>
                    <Grid item container direction='row' justify='space-around' alignItems='center' xs={12} md={5}>
                    <Box className={classes.ekipaBox}>
                            <Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>{data.utakmica.gosti.naziv}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            <Grid item  container direction='row' justify='space-evenly' alignItems='center' xs={12}>{/*container koji sadrzi tablice statistike i listu događaja*/}
                <Grid item  container direction='column' justify='space-evenly' alignItems='center' xs={12} md={7}>{/*container koji sadrzi tablice statistike za oba tima*/}
                    <TimStatistika tim_id={12685} timStatistika={utakmica.timDomaci}/>
                    <TimStatistika tim_id={120185} timStatistika={utakmica.timGosti}/>
                </Grid>
                <Grid style={{width:'100%',marginTop:50}} item container direction='row' justify='center' xs={12} md={4}>
                         <DogadajiUtakmice broj_utakmice={brojUtakmice}/>
                      </Grid>
            </Grid>
            </Fragment>
        </div>
    )
    }
}

export default Utakmica_statistika
