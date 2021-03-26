import {React,Fragment} from 'react'
import tim from '../mockdata/tim.js';
import gameInfo from '../mockdata/gameInfo.js';
import {Grid,Typography,Box, AppBar} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import logo from '../images/handstat_logo.png';
import Timer from '../components/Timer';
import TimVerticalBox from '../components/TimVerticalBox';
import TijekUtakmiceBox from '../components/TijekUtakmiceBox';
import MoguciDogadaji from '../components/MoguciDogadaji';
import Gol from '../components/Gol.jsx';
import Rezultat from '../components/RezultatUtakmice.jsx';
import Natjecanje from '../components/SelectNatjecanje.jsx';
import Spremi from '../components/SpremiUtakmicuButton';
import BrojUtakmice from '../components/BrojUtakmice';
import Lokacija from '../components/SelectLokacija';
import Kolo from '../components/Kolo';
import Gledatelji from '../components/Gledatelji';
import Vrijeme from '../components/Vrijeme';
import Datum from '../components/Datum';
import Nadzornik from '../components/SelectNadzornik';
import Lijecnik from '../components/SelectLijecnik';
import Zapisnicar from '../components/SelectZapisnicar';
import MjeracVremena from '../components/SelectMjeracVremena';
import Sudci from '../components/SelectSudci';
import Klubovi from '../components/SelectKlubovi';
import ZavrsiUtakmicu from '../components/ZavrsiUtakmicuButton';
import OcjenaSudaca from '../components/SudacOcjena';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {useSelector} from 'react-redux';
import DateFnsUtils from '@date-io/date-fns'; /*funkcije za manipulaciju s dateovima*/
const useStyles=makeStyles((theme)=>({
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
        maxWidth:50
    },
    gameInfoBox:{
        borderStyle:'solid',
        borderColor:theme.palette.primary.main,
        borderWidth:2
    },
    iconsBox:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between'
    },
}));
export default function Vodenje_statistike(props) {
const classes=useStyles();
const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
const utakmicaZavrsena=useSelector(state=>state.zavrsiUtakmicu);
    return (
        <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>{/*za date picker provider*/}
            <AppBar className={classes.appBar}>
                    <Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography style={{fontWeight:'bold'}} align='center' color='secondary'>HANDSTAT </Typography></Box>
                    <Box style={{ flexGrow:1,display:'flex',alignItems:'center',justifyContent:'center'}}><Typography align='center' variant='h6' style={{color:'#FFFFFF'}}>STATISTIKA UTAKMICE</Typography></Box>
            </AppBar>
            <Grid container style={{ margin:'100 auto', marginTop:100}} direction='column' justify='space-evenly' alignItems='center'>{/*container svega ispod navbara*/}
                  {
                    (!spremljenGameInfo)?
                  (<Grid className={classes.gameInfoBox} item container xs={12} direction='column' justify='flex-start' alignItems='flex-start'>{/* glavni container= cili box*/ }
                        <Grid item container   direction='column' justify='flex-start' alignItems='flex-start' xs={12}>{/* container koji sadrži 2 retka */}
                            <Grid container item direction='row' >{/*Container koji sadrži 3 dropboxa u retku */}
                            <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}} xs={12} sm={5} md >
                                <Natjecanje natjecanja={gameInfo.Natjecanja}/>
                              </Grid>
                              <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}} xs={12} sm={5} md>
                                <BrojUtakmice/>
                              </Grid>
                              <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}} xs={12} sm={12} md>
                                <Lokacija dvorane={gameInfo.Dvorane}/>
                              </Grid>
                            </Grid>
                            <Grid  container item direction='row'  >{/*Container koji sadrži 4 dropboxa u retku */}
                              <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}} xs={3} sm={5} md >
                              <Kolo/>
                              </Grid>
                              <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}}  xs={5} sm={5} md>
                              <Gledatelji/>
                              </Grid>
                              <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}}  xs={2} sm={5} md>
                              <Vrijeme/>
                              </Grid>
                              <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}}  xs={6} sm={5} md>
                              <Datum/>
                              </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container direction='column' justify='flex-start' alignItems='flex-start' xs={12}>{/* container koji sadrži 4 dropboxa */}
                            <Grid container item direction='row'  >{/*Container koji sadrži 2 dropboxa u retku */}
                              <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}} xs={12} sm>{/*ako ocemo da automatski dijele raspolozvii prostor samo stavimo xs */}
                              <Nadzornik nadzornici={gameInfo.Nadzornici}/>
                              </Grid>
                              <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}} xs={12} sm>
                              <Lijecnik lijecnici={gameInfo.Lijecnici}/>
                              </Grid>
                            </Grid>
                            <Grid container item direction='row'  >{/*Container koji sadrži 2 dropboxa u retku */}
                              <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}} xs={12} sm>{/*ako ocemo da automatski dijele raspolozvii prostor samo stavimo xs */}
                              <Zapisnicar zapisnicari={gameInfo.Zapisnicari}/>
                              </Grid>
                              <Grid item style={{textAlign: 'center',margin:'0.5rem 1.5rem 1.5rem 1.5rem'}} xs={12} sm>
                                <MjeracVremena mjeraciVremena={gameInfo.MjeraciVremena}/>
                              </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container direction='column' justify='center' alignItems='center' xs={12}>{/*Container sudaca*/}
                        <Sudci sudacSvi={gameInfo.Suci}/>
                      </Grid>
                  <Grid item container direction='row'  alignItems='center' justify='space-around' xs={12}>  {/* container domaći vs gosti*/}
                        <Klubovi timoviSvi={gameInfo.Timovi}/>
                </Grid>
                <Grid style={{marginTop:20,marginBottom:5}} item container direction='row' alignItems='center' justify='center' xs={12}> {/*SAVE button*/}
                      <Spremi/>{/*stavljen u posebnu komponenetu jer je taj state globalan i potreban ostalim komponentama*/}
                </Grid>                {/*ako su spremljeni podaci o utakmici nema više klikanja*/}
            </Grid>)
            : 
            null
            }
            {
            (spremljenGameInfo)?//ako je spremljen game info onda prikazujemo donji dio za vođenje utakmice
           (
            <Fragment>
           <Grid style={{marginTop:100}} item container direction='row' alignItems='center' justify='space-around'>{/*redak od rezultata i vremena*/}
              <Grid item xs={12} md={5}>
                  <Rezultat/>
                </Grid>
              <Grid item xs={12} md={3}>
              <Typography align='center' color='primary' variant='h5'>VRIJEME</Typography>
                <Timer/>
              </Grid>
            </Grid>
            <Grid style={{marginTop:50}} item container direction='row' alignItems='flex-start' justify='space-evenly'>{/*container od 4 stupca-> stupac domaće ekipe,gostujuće događaji i gol+dogadaji utakmice*/}
              <Grid  style={{borderColor:'#000000',borderStyle:'solid'}}item container direction='column' alignItems='center' justify='space-evenly' xs={12} sm={6} md={3}>{/* vertikalni box od domaćeg tima*/ }
                <TimVerticalBox tim={tim[0]} tim_id={1}/>
               </Grid>
               <Grid  style={{borderColor:'#000000',borderStyle:'solid'}}item container direction='column' alignItems='center' justify='space-evenly' xs={12} sm={6} md={3}>{/* vertikalni box od gostujućeg tima*/ }
                   <TimVerticalBox tim={tim[1]} tim_id={2}/>
               </Grid>
               <Grid  style={{borderColor:'#000000',borderStyle:'solid'}}item container direction='column' alignItems='center' justify='space-evenly' xs={12} sm={6} md={2}>{/* vertikalni box od događaja*/ }
                   <MoguciDogadaji/>
               </Grid>
               <Grid  style={{minHeight:800}} item container direction='column' alignItems='center' justify='space-evenly' xs={12} sm={7} md={3}>{/*container od gola i liste događaja*/}
                      <Grid item container justify='center' direction='row' style={{position:'relative'}} xs={12}>{/* gol*/}
                        <Gol/>
                      </Grid>
                      <Grid style={{ borderColor:'#000000',
      borderStyle:'solid',width:'100%',marginTop:50}} item container direction='row' justify='center' xs>
                          <TijekUtakmiceBox/>
                      </Grid>
               </Grid>
            </Grid>
            <ZavrsiUtakmicu/>
            </Fragment>
            )
            :
            null
            }
            {
              (utakmicaZavrsena)?
              <OcjenaSudaca history={props.history}/>
              :
              null
            }
            </Grid>
            </MuiPickersUtilsProvider>
        </div>
    )
}

