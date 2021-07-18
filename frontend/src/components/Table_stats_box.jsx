import {React,Fragment,useState} from 'react'
import {Box, Typography,Button} from '@material-ui/core';
import StatistikaPopup from './StatistikaDialog';
import {makeStyles} from '@material-ui/core/styles';
const useStyles=makeStyles((theme)=>({
    glavniBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'stretch',
        justifyContent:'space-between',
        width:'100%',
        backgroundColor:theme.palette.primary.main,
        borderBottomColor:'#FFFFFF',
        borderBottomStyle:'solid'
    },
    dres:{
        height:'auto',
        width:'5%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:theme.palette.secondary.main,
        borderRightColor:'#FFFFFF',
        borderRightStyle:'solid',
        borderLeftColor:'#FFFFFF',
        borderLeftStyle:'solid'
    },
    imePrezimeBox:{
        display:'flex',
        width:'35%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRightColor:'#FFFFFF',
        borderRightStyle:'solid'
    },
    button:{//!!!!!button ne moze biti display:flex!!!!!!-> zato ga stavljamo ko parent i width na 100% pa unutar njega nestamo box koji displayamo kao flex
        width:'100%',
        borderRadius:0,
        padding:0
    }
}))
function Table_stats_box(props) {
    const classes=useStyles();
    const [prevGolovi,setPrevGolovi]=useState(props.golovi);
    const [prevPokusaji,setPrevPokusaji]=useState(props.pokusaji);
    const [prevIskljucenja,setPrevIskljucenja]=useState(props.iskljucenja);
    const [prevZuti,setPrevZuti]=useState(props.zuti);
    const [prevCrveni,setPrevCrveni]=useState(props.crveni);
    const [prevPlavi,setPrevPlavi]=useState(props.plavi);
    const [prevObrane,setPrevObrane]=useState(props.obrane);
    const [prevSedmeracGolovi,setPrevSedmeracGolovi]=useState(props.sedmerac_golovi);
    const [prevSedmeracPokusaji,setPrevSedmeracPokusaji]=useState(props.sedmerac_pokusaji);
    const [prevPrimljeni,setPrevPrimljeni]=useState(props.primljeni);
    const [renderGoloviPokusaji,setRenderGoloviPokusaji]=useState(false);//renderamo ih oboje da je uocljivije
    const [renderIskljucenja,setRenderIskljucenja]=useState(false);
    const [renderZuti,setRenderZuti]=useState(false);
    const [renderCrveni,setRenderCrveni]=useState(false);
    const [renderPlavi,setRenderPlavi]=useState(false);
    const [renderObranePrimljeni,setRenderObranePrimljeni]=useState(false);//render oboje
    const [renderSedmeracGoloviPokusaji,setRenderSedmeracGoloviPokusaji]=useState(false);
    const [openPopup,setOpenPopup]=useState(false);//za otvaranje popupa statistike s grafon i rukometnin golom nakon klika
    //gledamo sve zajednicke staitstike za sva 3 tipa-> to su kartoni
        if(props.zuti!==prevZuti)
        {
                setRenderZuti(true);
                setTimeout(function(){
                    setRenderZuti(false);
                },2000);
                setPrevZuti(props.zuti);
        }
        //moze se promijenit samo 1 karton u jednom dogadaju-> zato else if-> ako se promijeni karton ne trebamo gledat dalnje statistike jer ih ne može bit
        //JEDINO DI SE MOŽE U 1 DOGADAJU UVEĆAT VIŠE STAITSTIKA SU GOL SEMDERAC-> UVEĆAVAJU SE 4 POLJA I GOL-> UVEĆAVAJU SE 2 POLJA
        else if(props.crveni!==prevCrveni)
        {
                setRenderCrveni(true);
                setTimeout(function(){
                    setRenderCrveni(false);
                },2000);
            setPrevCrveni(props.crveni);
        }
        else if(props.plavi!==prevPlavi)
        {
                setRenderPlavi(true);
                setTimeout(function(){
                    setRenderPlavi(false);
                },2000);
            setPrevPlavi(props.plavi);
        }
        else if(props.tip===1||props.tip===2)//pogledamo iskljucenja i golove
        {
            if(props.iskljucenja!==prevIskljucenja)
            {
                    setRenderIskljucenja(true);
                    setTimeout(function(){
                        setRenderIskljucenja(false);
                    },2000)
                setPrevIskljucenja(props.iskljucenja);
            }
            else if(props.tip===1&&(props.sedmerac_golovi!==prevSedmeracGolovi||props.sedmerac_pokusaji!==prevSedmeracPokusaji))
            {
                //mijenjaju se 4 parametra odnosno 2 stupca
                setRenderSedmeracGoloviPokusaji(true);
                setRenderGoloviPokusaji(true);
                setTimeout(function(){
                    setRenderSedmeracGoloviPokusaji(false);
                    setRenderGoloviPokusaji(false);
                },2000);
                setPrevSedmeracGolovi(props.sedmerac_golovi);
                setPrevSedmeracPokusaji(props.sedmerac_pokusaji);
            }
            //ovde ubacti else if za promjenu sedmerca + DODATNI UVJET DA JE TIP=1 JER JE SAMO ZA IGRACA TO u kojen ce se rerenderat 2 polja
            else if(props.golovi!==prevGolovi||props.pokusaji!==prevPokusaji)//ako je promijenjen 1 od njih-> renderamo to polje
            {
                    setRenderGoloviPokusaji(true);
                    setTimeout(function(){
                        setRenderGoloviPokusaji(false);
                    },2000);
                setPrevGolovi(props.golovi);
                setPrevPokusaji(props.pokusaji);
            }
            else if(props.tip===2&&(props.obrane!==prevObrane||props.primljeni!==prevPrimljeni))
            {
                    setRenderObranePrimljeni(true);
                    setTimeout(function(){
                        setRenderObranePrimljeni(false);
                    },2000);
                setPrevObrane(props.obrane);
                setPrevPrimljeni(props.primljeni);
            }

        }
    console.log('Table stats box '+ openPopup);
    return (
        <Fragment>
           {(()=>{
            if(props.tip===1)
            {
            return (
            //otvori popup na klik
            <Button className={classes.button}  onClick={()=>setOpenPopup(true)}>
                <Box className={classes.glavniBox}>
                    <Box className={classes.dres}><Typography align='center' style={{color:'#FFFFFF'}}>{props.dres}</Typography></Box>
                    <Box className={classes.imePrezimeBox}><Typography align='center' style={{color:'#FFFFFF'}}>{props.ime + ' '+props.prezime}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'14%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:(renderGoloviPokusaji)? '#1BA236':'#FFFFFF'}}>{(props.golovi>0||props.pokusaji>0)? (props.golovi+'/'+props.pokusaji) : ""}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'14%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:(renderGoloviPokusaji)? '#1BA236':'#FFFFFF'}}>{(props.sedmerac_golovi>0||props.sedmerac_pokusaji>0)? (props.sedmerac_golovi+'/'+props.sedmerac_pokusaji) : ""}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:(renderIskljucenja)? '#1BA236':'#FFFFFF'}}>{props.iskljucenja}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:(renderZuti)? '#1BA236':'#FFFFFF'}}>{props.zuti}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:(renderCrveni)? '#1BA236':'#FFFFFF'}}>{props.crveni}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:(renderPlavi)? '#1BA236':'#FFFFFF'}}>{props.plavi}</Typography></Box>
                </Box>
            </Button>
            )
            }
            else if(props.tip===2)
            {
            return(
            <Button className={classes.button} onClick={()=>setOpenPopup(true)}>
                <Box className={classes.glavniBox}>
                    <Box className={classes.dres}><Typography align='center' style={{color:'#FFFFFF'}}>{props.dres}</Typography></Box>
                    <Box className={classes.imePrezimeBox}><Typography align='center' style={{color:'#FFFFFF'}}>{props.ime + ' '+props.prezime}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'14%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography  align='center' style={{color:(renderObranePrimljeni)? '#1BA236':'#FFFFFF'}}>{(props.obrane>0||props.primljeni>0)? (props.obrane+'/'+(props.obrane+props.primljeni)) : ""}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'14%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography  align='center' style={{color:(renderGoloviPokusaji)? '#1BA236':'#FFFFFF'}}>{(props.golovi>0||props.pokusaji>0)? (props.golovi+'/'+props.pokusaji) : ""}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:(renderIskljucenja)? '#1BA236':'#FFFFFF'}}>{props.iskljucenja}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:(renderZuti)? '#1BA236':'#FFFFFF'}}>{props.zuti}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:(renderCrveni)? '#1BA236':'#FFFFFF'}}>{props.crveni}</Typography></Box>
                    <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:(renderPlavi)? '#1BA236':'#FFFFFF'}}>{props.plavi}</Typography></Box>
                </Box>
            </Button>
            )
            }
            else {
            return (
            <Box className={classes.glavniBox}>
                <Box style={{ display:'flex',width:'40%',flexDirection:'row',justifyContent:'center',alignItems:'center', borderLeftColor:'#FFFFFF',borderLeftStyle:'solid',borderRightColor:'#FFFFFF',borderRightStyle:'solid'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.ime + ' '+props.prezime}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'36%',display:'flex',alignItems:'center',justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.titula}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography  align='center'  style={{color:(renderZuti)? '#1BA236':'#FFFFFF'}}>{props.zuti}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography  align='center' style={{color:(renderCrveni)? '#1BA236':'#FFFFFF'}}>{props.crveni}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography  align='center' style={{color:(renderPlavi)? '#1BA236':'#FFFFFF'}}>{props.plavi}</Typography></Box>
            </Box>
            )
            }
        })()} {/*IIFE FUNCTION JER UNUTRA MORA BITI EXPRESSION*/}
        {
            ((props.tip==1 || props.tip==2)&&openPopup)?//otvara se popup samo za igrace i golmane
            <StatistikaPopup open={openPopup} setOpen={setOpenPopup} isIgrac={(props.tip===1)? true : false} maticni_broj={props.maticni_broj} broj_utakmice={props.broj_utakmice}/>
            :
            null
        }
        </Fragment>
    )
}

export default Table_stats_box
