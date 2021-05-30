import {React,useState,useEffect,Fragment} from 'react'
import {Box,Typography,IconButton,TextField,FormControl,InputLabel,Button} from '@material-ui/core'
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {makeStyles} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import {useMutation } from '@apollo/client';
import {azurirajStatus,azurirajVrijeme} from '../graphql/mutation';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ErrorDialog from './ErrorDialog';
import {postaviError} from '../redux/slicers/error';
import {incrementTimer,disableDispatch} from '../redux/slicers/timer';//import REDUX THUNK FUNCTION
const useStyles=makeStyles((theme)=>({
    timeBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        borderStyle:'solid',
        borderColor:theme.palette.primary.main,
        borderWidth:2
    },
    iconBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center'
    },
    trajanjeBox:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    }

}))
export default function Timer() {
    const classes=useStyles();
    const [paused,setPaused]=useState(true);
    const [poluvremeTrajanje,setPoluvremeTrajanje]=useState(1);//trajanje poluvremena
    const [spremljenoTrajanje,setSpremljenoTrajanje]=useState(false);
    const [disablePausePlay,setDisablePausePlay]=useState(false);//disablea se nakon kraja utakmice
    const [prviPoziv,setPrviPoziv]=useState(true);//da znamo kada prvi put stisne odbrojavanje timera da prominimo status utakmice kkao bi je mogli prikazivati live
    //UVODIMO OVU VARIJABLU ZBOG BUGA U KOJEM SE VIŠE PUTA UNUTAR INTERVALA MANJEG OD 1s stisne pause stop-> problem je što bi se nakon svakog stiskanja continue uvecao timer-> to ne zelimo
    const dispatchEnable=useSelector(state=>state.timer.dispatch);//odreduje jeli omogceno dispatchanje odnosno uvecavanje timera
    const time=useSelector(state=>state.timer);
    const brojUtakmice=useSelector(state=>state.brojUtakmice);
    const {timDomaciSpremljen,timGostiSpremljen}=useSelector(state=>state.timovi);//može započeti timer samo ako su spremljena oba tima-> tek kada spremi oba tima pojavit će mu se pause/continue ikone
    const dispatch = useDispatch();
    const [promijeniStatus,{error:statusError}]=useMutation(azurirajStatus,{//azuriranje statusa utakmice
        onError:(error)=>{
           dispatch(postaviError(true));
        }
    })
    
    const [promijeniVrijeme,{error:vrijemeError}]=useMutation(azurirajVrijeme,{
        onError:(error)=>{
            dispatch(postaviError(true));
        }
    })
  /*ako stisne pause i contineu vise puta unutar intervlala manjeg od 1 sekunde onda će npr ako je stiska continue 3 puta dispatchat se 3 puta timer odnosno proc ce 3 sekunde->
  zato uvodimo dispatch varijablu koja će omogućavati disptachanje tek nakon što prođe 1 selunda odnosno nkon što se promijeni vrime*/
    useEffect(()=>{
        if(time.ticks===(poluvremeTrajanje*60)&&!paused)//ako je doslo na npr 30:00 a korisnik nije pauzira-> paused=false-> automatski zaustavi i ne uvećavaj counter sve dok korisnik ponovo ne pokrene pause button koji će dispatchat increment timera pa će u sljedećem pozivu ticks bit 1801 pa neće uć u ovaj if
        {
            console.log('Kraj poluvremena');
            promijeniStatus({//status=poluvreme pauza
                variables:{
                    broj_utakmice:brojUtakmice,
                    status:3
                }
            });
            setPaused(true);
        }
        else if(time.ticks===(2*poluvremeTrajanje*60)&&!paused)//kraj utakmice-> promijeni status za kraj,stopiraj pause button i disableaj ga
        {
            console.log('Kraj utakmice');
            promijeniStatus({
                variables:{
                    broj_utakmice:brojUtakmice,
                    status:5
                }
            });
            setPaused(true);
            setDisablePausePlay(true);
        }
        else {//ako nije zadovoljen gornji slučaj onda provjeravamo ostale, inače samo gornji jer se preostali mogu dogoditi samo bez prethodnog
            if(!paused)//ako je paused=false-> continue odnosno dozvoljeno odbrojavanje-> uvecaj timer
            {
                    dispatch(incrementTimer());//uvijek uvecaj timer ako je paused=false odnosno continue je omogucen jer ce nakon uvecavanje timera bit omogucen dispatch jer ce se postavit u true
            }
            if(time.ticks===((poluvremeTrajanje*60)+1))//npr 30:01->počelo drugo poluvreme-> nije više pauza
            {
                console.log('Početak drugog poluvremena');
                promijeniStatus({
                    variables:{
                        broj_utakmice:brojUtakmice,
                        status:4
                    }
                });
            }//ne stavljamo %60===0 jer nam se onda ne bi promijenilo u 31. minutu zbog toga što u slučaju sa 1800sekundi neće uć u ovaj dio jer je to kraj poluvremena oznaka ili bi se u slučaju kraja utakmice na 60:00 mijenjala minuta u 61
            if(time.ticks%60===1&&time.ticks>1)//ako je okrugli broj minuta+1 sekunda-> ušli u novu minutu-> promijeni minutu utakmice
            {//ne brojimo slučaj s 1 sekundom jer nam je po defaultu vrijeme postavljeno na 1. minutu
                console.log('Update vremenea');
                promijeniVrijeme({
                    variables:{
                        broj_utakmice:brojUtakmice,
                        minuta:parseInt(time.ticks/60)+1//idemo uvijek minutu naprijed npr 61. sekunda je 2. minuta
                    }
                })
            }
        }
    },[time.ticks]);
    useEffect(()=>{
        if(prviPoziv&&!paused)//ako je prvi put kliknut(paused je pomaknut na iz true na false a prviPoziv je true-> POČELA UTAKMICA I IGRA SE
        {
            console.log('Prvi poziv promjena statusa'+prviPoziv+paused);
            promijeniStatus({
                variables:{
                    broj_utakmice:brojUtakmice,
                    status:2
                }
            });
            setPrviPoziv(false);
        }
        if(!paused)//ako je pauziran=false odnosno ako ga nakon klika idemo pokrenuti(jer se poziva nakon promjene stanja paused odnosno paused ce se prominit iz true u false nakon klika u handle pause change)-> zabrani dispatchanje dok ne prode 1 sekunda jer bi inace pokrenulo dispatch pokrenuo uvecavanje countera više puta kad bi mijenjali vise puta u pause=false i dispatchaloi za svaku promjenu dobili vise poziva dispatcha i vise uvecavanja timera, inace ce se dispatchanje dopsutit nakon sto se promini timer
        {
            if(dispatchEnable)//ako je true( BIT CE TRUE SAMO NAKON STA PRODE SEKUNDA jer ga jedino ona postavlja na true) onda mozemo disptachati odnosno uvecavati timer-> prosla 1 sekunda ILI je prvi put stisnut play
            {
                dispatch(incrementTimer());//uvecaj timer
            }
        }
    },[paused]);
    const handlePauseChange=(event)=>{
        if(!paused)//ako je paused prije klika=false-> zelimo ga zaustavit KLIKANJEM-> dispatch=false-> nema uvecavanja timera-> ZABRANIMO DISPATCHANJE
        {
            dispatch(disableDispatch());//jedino ga ovjde postavljamo na false
        }
        setPaused(!paused);//uvijek to napravi nakon klika
    }
   
    return (
        <Fragment>
            {//kada odaberemo trajanje poluvremena onda se prikazuje timer tek, ukoliko je time.ticks razlicit od nule a nije spremljeno trajanje-> situacija isteka session cookieja-> prikazi mu timer sa spremljenim vremenom-> vec je odabrao duljinu trajanja poluvremena
            (!spremljenoTrajanje&&time.ticks===0)?
                ( 
                <Box className={classes.trajanjeBox}>
                    <FormControl style={{width:'80%',margin:'0 auto'}}>
                    <Box align='right'><ScheduleIcon/></Box>
                                    <InputLabel>TRAJANJE POLUVREMENA</InputLabel>
                                    <TextField
                                    type="number"
                                    inputProps={{min:1,max:30,step:1}}
                                    label=" "
                                    value={poluvremeTrajanje}
                                    onChange={(e)=>setPoluvremeTrajanje(e.target.value)}//JER INAČE ŠALJE INPUT U OBLIKU STRINGA A NE INTEGERA
                                    />
                </FormControl>
                <Button style={{marginTop:10}} color='primary' size='large' variant='contained' title='Spremi oabrano trajanje poluvremena' disableRipple onClick={()=>setSpremljenoTrajanje(true)}>SPREMI</Button>
            </Box>)
           :
            (<Box>
                    <Box className={classes.timeBox}>
                        <Box style={{width:'40%',display:'flex',flexDirection:'row', justifyContent:'center'}}><Typography color='primary' variant='h3'>{time.minutes}</Typography></Box>
                        <Box style={{width:'10%',display:'flex',flexDirection:'row', justifyContent:'center'}}><Typography color='primary' variant='h3'>:</Typography></Box>
                        <Box style={{width:'40%',display:'flex',flexDirection:'row', justifyContent:'center'}}><Typography color='primary' variant='h3'>{time.seconds}</Typography></Box>
                    </Box>
                {
                //pause/continue ikona samo kada se spreme oba tima
                (timDomaciSpremljen&&timGostiSpremljen)?
                    (<Box className={classes.iconBox}> { (paused) ?
                    <IconButton title='Start' disabled={disablePausePlay} onClick={handlePauseChange} disableRipple style={{height:'100%'}} color='secondary'><PlayArrowIcon style={{width:50,height:'auto'}}/></IconButton>
                    : 
                    <IconButton title='Stop' disabled={disablePausePlay} onClick={handlePauseChange} disableRipple style={{height:'100%'}} color='secondary'><PauseIcon style={{width:50,height:'auto'}}/></IconButton>
                    } </Box>)
                    :
                    null
                }
            </Box>)
        }
        {
            ((statusError&&statusError.message)||(vrijemeError&&vrijemeError.message))?
            <ErrorDialog errorText={(statusError)? statusError.message : vrijemeError.message}/>
            :
            null
        }
      </Fragment>
    )
}