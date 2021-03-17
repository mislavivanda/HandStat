import {React,useState,useEffect} from 'react'
import {Box,Typography,IconButton} from '@material-ui/core'
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {makeStyles} from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import {incrementTimer} from '../redux/slicers/timer';//import THUNK FUKCIJE KOJA DISPATCHA INRKEMENT AKCIJU SVAKO 1 SEKUNDU
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
    const time=useSelector(state=>state.timer);//redux hook za dohvat dijela globalnog statea koji nam treba
    const dispatch = useDispatch();//za dispatchanje akcija u redux reducere
  
    useEffect(()=>{
        if(!paused)
        {
            dispatch(incrementTimer());
        }
    },[time.ticks]);/*iako ovisi o paused ne stavljamo ga u dependencies jer se dogodi da se useEffect pozove 2 puta kada se istovremeno promijene i paused i time.ticks pa onda imamo 2 poziv useEffecta i 2 poziva timera pa odborojavamo duplo brže odnosno 2 sekunde za 1 sekundu zbog 2 poziva unutra
        a i kasnije kad idemo zaustaviti i stavimp paused=false ako se nakon toga desi promjena time.ticks to ce ponistit tu promjenu i timer ce nastavit odbrojavati*/
 /*ako je stavljen play onda promijeni stanje vremena-> ta promjena će izazvati poziv gornjeg useEffecta koji će nastaviti odbrojavati sve do sljedeće promjene pause=true koje će sprječiti update vremena u ifu pa se neće 
        mijenjati stanje sve dok se opet ne stisne botun i ovi useEffect promijeni vrijeme koje će opet trigerat gornji useEffect*/
    /*ovaj useEffect se poziva samo kod promjene pause stanja koje će se dgodoiti kod klika na pause ikonu nakon kojeg će se prominit stanje*/
    useEffect(()=>{
        if(!paused)
        {
           dispatch(incrementTimer());
        }
    },[paused]);
    const handlePauseChange=(event)=>{     /*promijeni stanje pause buttona na klik suprotno od onog koje je bilo*/
        setPaused(!paused)
    }   
    return (
        <Box>
            <Box className={classes.timeBox}>
                <Box style={{width:'40%',display:'flex',flexDirection:'row', justifyContent:'center'}}><Typography color='primary' variant='h3'>{time.minutes}</Typography></Box>
                <Box style={{width:'10%',display:'flex',flexDirection:'row', justifyContent:'center'}}><Typography color='primary' variant='h3'>:</Typography></Box>
                <Box style={{width:'40%',display:'flex',flexDirection:'row', justifyContent:'center'}}><Typography color='primary' variant='h3'>{time.seconds}</Typography></Box>
            </Box>
          <Box className={classes.iconBox}> { (paused) ?
        <IconButton title='Pokreni' onClick={handlePauseChange} disableRipple style={{height:'100%'}} color='secondary'><PlayArrowIcon style={{width:50,height:'auto'}}/></IconButton>
        : 
        <IconButton title='Zaustavi' onClick={handlePauseChange} disableRipple style={{height:'100%'}} color='secondary'><PauseIcon style={{width:50,height:'auto'}}/></IconButton>
        } </Box>  {/*conditional rendering*/}
      </Box>
    )
}