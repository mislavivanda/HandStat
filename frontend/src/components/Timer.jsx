import {React,useState,useEffect} from 'react'
import {Box,Typography,IconButton} from '@material-ui/core'
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {makeStyles} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
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
    }

}))
export default function Timer() {
    const classes=useStyles();
    const [paused,setPaused]=useState(true);
    //UVODIMO OVU VARIJABLU ZBOG BUGA U KOJEM SE VIŠE PUTA UNUTAR INTERVALA MANJEG OD 1s stisne pause stop-> problem je što bi se nakon svakog stiskanja continue uvecao timer-> to ne zelimo
    const dispatchEnable=useSelector(state=>state.timer.dispatch);//odreduje jeli omogceno dispatchanje odnosno uvecavanje timera
    const time=useSelector(state=>state.timer);
    const dispatch = useDispatch();
  {/*ako stisne pause i contineu vise puta unutar intervlala manjeg od 1 sekunde onda će npr ako je stiska continue 3 puta dispatchat se 3 puta timer odnosno proc ce 3 sekunde->
  zato uvodimo dispatch varijablu koja će omogućavati disptachanje tek nakon što prođe 1 selunda odnosno nkon što se promijeni vrime*/}
    useEffect(()=>{
        if(!paused)//ako je paused=false-> continue odnosno dozvoljeno odbrojavanje-> uvecaj timer
        {
                dispatch(incrementTimer());//uvijek uvecaj timer ako je paused=false odnosno continue je omogucen jer ce nakon uvecavanje timera bit omogucen dispatch jer ce se postavit u true
        }
    },[time.ticks]);
    useEffect(()=>{
        if(!paused)//ako je pauziran=false odnosno ako ga nakon klika idemo pokrenuti(jer se poziva nakon promjene stanja paused)-> zabrani dispatchanje dok ne prode 1 sekunda jer bi inace pokrenulo dispatch pokrenuo uvecavanje countera više puta kad bi mijenjali vise puta u pause=false i dispatchaloi za svaku promjenu dobili vise poziva dispatcha i vise uvecavanja timera, inace ce se dispatchanje dopsutit nakon sto se promini timer
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
        <Box>
            <Box className={classes.timeBox}>
                <Box style={{width:'40%',display:'flex',flexDirection:'row', justifyContent:'center'}}><Typography color='primary' variant='h3'>{time.minutes}</Typography></Box>
                <Box style={{width:'10%',display:'flex',flexDirection:'row', justifyContent:'center'}}><Typography color='primary' variant='h3'>:</Typography></Box>
                <Box style={{width:'40%',display:'flex',flexDirection:'row', justifyContent:'center'}}><Typography color='primary' variant='h3'>{time.seconds}</Typography></Box>
            </Box>
          <Box className={classes.iconBox}> { (paused) ?
        <IconButton title='Start' onClick={handlePauseChange} disableRipple style={{height:'100%'}} color='secondary'><PlayArrowIcon style={{width:50,height:'auto'}}/></IconButton>
        : 
        <IconButton title='Stop' onClick={handlePauseChange} disableRipple style={{height:'100%'}} color='secondary'><PauseIcon style={{width:50,height:'auto'}}/></IconButton>
        } </Box> 
      </Box>
    )
}