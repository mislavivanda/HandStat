import React from 'react'
import {Box,Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
const useStyles = makeStyles((theme)=>({
    container:{
        display:'flex',
        flexDirection:'row',
        margin:'auto',//centriranje,
        height:'100%',
        borderStyle:'solid',
        borderColor:theme.palette.secondary.main,
        borderWidth:2
    },
    natjecanjeBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'45.5%',
        backgroundColor:theme.palette.primary.main
    },
    klubBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'45.5%'
    },
    goloviObraneBox:{
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width:'4%',
        backgroundColor:theme.palette.primary.main,
        borderRadius:'50%'
    }
}))
function Povijest({natjecanje,klub,golovi_obrane}) {
    const classes=useStyles();
    console.log(natjecanje+klub+golovi_obrane);
    return (
         //box je zapravo div-> blok element-> zauzet ce sav raspolozivi prostor odnosno bit ce sirok ko griditem,dodamo vanjski box da uskladimo prikaz i sirinu s rezultatima
        //dodajemo padding i glavni container da uskaldimo s prikazom rezultata
        <Box style={{paddingLeft:'9%'}}>
            <Box className={classes.container}>
            <Box className={classes.natjecanjeBox}><Typography align='center' style={{color:'#FFFFFF'}}>{natjecanje}</Typography></Box>
            <Box className={classes.klubBox}><Typography align='center' color='secondary'>{klub}</Typography></Box>
            {//za strucni stozer nema prikaza golova, vratit samo box bez icega da zauzima prostor
                (golovi_obrane)?
                (<Box className={classes.goloviObraneBox}><Typography align='center' style={{color:'#FFFFFF'}}>{golovi_obrane}</Typography></Box>)
                :
                ( <Box style={{width:'4%'}} ></Box>)

            }
            <Box style={{width:'5%'}}></Box>{/*kod rezultata je to strelica pa stavljamo ovdje taj box kako bi bili iste sirine ko rezultati i u syncu */}
            </Box>
       </Box>
    )
}

export default Povijest
