import React from 'react'
import {Typography,IconButton,Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const useStyles=makeStyles((theme)=>({
    container:{
        display:'flex',
        flexDirection:'row',
        margin:'auto',//centriranje,
        height:'100%',
        borderStyle:'solid',
        borderColor:theme.palette.secondary.main,
        borderWidth:2,
    },
    domaciBox:{
        display:'flex',
        width:'40%',
        justifyContent: 'center',//horizontalno centriranje
        alignItems: 'center',//vertikalno centriranje
    },
    rezultatBox:{
        display:'flex',
        width:'15%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:theme.palette.primary.main
    },
    gostiBox:{
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width:'40%'
    }
}));
export default function Rezultat({history,broj_utakmice,natjecanje,domaci,gosti,golovi_domaci,golovi_gosti}) {
    const classes=useStyles();
    function odvediNaUtakmicu()
    {
        {history.push(`${history.location.pathname}`);
        let broj=encodeURIComponent(broj_utakmice);
        console.log('Enkodirani: '+broj);
        history.replace(`utakmica/${broj}`)}
    }
    return (
        <Box>
          <Typography align='center' style={{marginRight:'5%'}}>{natjecanje}</Typography>{/*oduzmemo 5% margine sta zauzima ikona strelice pa se onda centira u odnosu na 2 kluba i rezultat*/ }
          <Box className={classes.container}>
            <Box className={classes.domaciBox}><Typography align='center' color='secondary'>{domaci}</Typography></Box>
            <Box className={classes.rezultatBox}><Typography  align='center' style={{color:'#FFFFFF'}}> {golovi_domaci} : {golovi_gosti}</Typography></Box>
            <Box className={classes.gostiBox}><Typography  align='center' color='secondary'>{gosti}</Typography></Box>{/*koristimo .replace jer se rezultat box može nalazit na više različitih stranica a treba uvijek vodit na isti page u url pa ne možemo samo pushat na history stack*/}
            <IconButton onClick={()=>odvediNaUtakmicu()} size='small' style={{ marginLeft:'auto',width:'5%'}}><ArrowForwardIosIcon/> </IconButton>
          </Box>                       {/*kako .replace mijenja trenutni path na stacku onda ćemo kod povratka nazad se vratiti na pretprethodni dio-> ako se želimo vratit na prethodni onda na history stack stavimo dodatni objekt s istim pathom(znamo ga preko history objekta) kojeg će zamijneit
                                        .replace funkcija a ovi prvi objekt tog patha će ostati na stacku pa ćemo se kod povratka natrag vratiti na pravu prethodnu stranicu */}
        </Box>
    )
}
