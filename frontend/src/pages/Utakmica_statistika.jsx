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
import { useSelector,useDispatch } from 'react-redux';
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
    gameInfoBox:{
        borderColor:theme.palette.primary.main,
        borderStyle:'solid',
        borderWidth:3
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
    const [utakmicaUcitana,setUtakmicaUcitana]=useState(false);
    const brojUtakmice=props.match.params.broj_utakmice;//match.params je objekt koji sadrzi djelove URL po key value dijelu-> kod definicije rute za ovaj path stvili smo da se taj dio naziv :broj_utakmice pa ga na taj nacin mozemo i izvadit
    const [domaciGolovi,setDomaciGolovi]=useState(null);
    const [gostiGolovi,setGostiGolovi]=useState(null);
    const timDomaci=useSelector(state=>state.timovi.timDomaci);
    const timGosti=useSelector(state=>state.timovi.timGosti);
    const kolo=useSelector(state=>state.kolo);
    const natjecanje=useSelector(state=>state.natjecanje.odabranoNatjecanje);
    useEffect(()=>{
        dispatch(odabranTimDomaci({id:12685,naziv:'RK PPD ZAGREB',klub_slika:klub}));
        dispatch(odabranTimGosti({id:120185,naziv:'RK BARCELONA',klub_slika:klub2}));
        setDomaciGolovi(utakmica.domaciRez);
        setGostiGolovi(utakmica.gostiRez);
        setUtakmicaUcitana(true);
    },[]);//kada stavimo [] tio znaci da ce se useeeffect pozvati samo 1 put
    return (
        <div>
             
             <AppBar className={classes.appBar}>
                    <Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography style={{fontWeight:'bold'}} align='center' color='secondary'>HANDSTAT </Typography></Box>
                    <Box style={{ flexGrow:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Typography align='center' variant='h6' style={{color:'#FFFFFF'}}>{'UTAKMICA BROJ: '+ brojUtakmice}</Typography></Box>
            </AppBar>
            <Grid  container direction='column' justify='space-evenly' alignItems='center' style={{marginTop:100}}>{/*glavni container*/}
                <Grid item className={classes.gameInfoBox} container direction='column' justify='space-evenly' alignItems='center' xs={12}>{/*gornji box sa podacima*/}
                    <Grid item container direction='row' justify='center' xs={12}>                                                    {/*tek kada se postave najtecanje i kolo u gameInfo komponenti ih ispisujemo*/}
                        <Box className={classes.ligaBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h5'>{((kolo!==0)&&natjecanje)? (kolo+'. KOLO '+natjecanje.naziv) : ''}</Typography></Box>
                    </Grid>
                    <Grid item className={classes.lijeviDesniBoxContainer} container direction='row' justify='space-between' alignItems='stretch' xs={12}>{/*container od retka koji sadrži 2 stupca podataka*/}
                        <GeneralInfo/>
                        <OsobljeInfo/>
                    </Grid>
                </Grid>
            </Grid>
              {
                (utakmicaUcitana)?
                (
                <Fragment>
                <Grid item container direction='row' justify='space-evenly' alignItems='stretch' style={{marginTop:50}} xs={12}>{/*container od rezultata*/}
                   <Grid item container direction='row' justify='center' alignItems='center' xs={12} md={5}>
                        <Box  className={classes.ekipaBox}>
                            <Typography variant='h5' style={{color:'#FFFFFF'}}>{timDomaci.naziv}</Typography>
                        </Box>
                   </Grid>
                    <Grid item container direction='row' justify='center' alignItems='center'  xs={12} md={2}>
                        <Box className={classes.rezultatBox}> <Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>{domaciGolovi+':'+gostiGolovi}</Typography></Box>
                    </Grid>
                    <Grid item container direction='row' justify='space-around' alignItems='center' xs={12} md={5}>
                    <Box className={classes.ekipaBox}>
                            <Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>{timGosti.naziv}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            <Grid item  container direction='row' justify='space-evenly' alignItems='center' xs={12}>{/*container koji sadrzi tablice statistike i listu događaja*/}
                <Grid item  container direction='column' justify='space-evenly' alignItems='center' xs={12} md={7}>{/*container koji sadrzi tablice statistike za oba tima*/}
                    <TimStatistika tim_id={12685} timStatistika={utakmica.timDomaci}/>
                    <TimStatistika tim_id={120185} timStatistika={utakmica.timGosti}/>
                </Grid>
                <Grid style={{width:'100%',marginTop:50}} item container direction='row' justify='center' xs={12} md={4}>
                         <DogadajiUtakmice dogadajiUtakmice={utakmica.dogadaji}/>
                      </Grid>
            </Grid>
            </Fragment>
            )
            :
            null
            }
        </div>
    )
}

export default Utakmica_statistika
