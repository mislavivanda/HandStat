import React from 'react'
import {Box,Typography,Hidden,IconButton} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
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
        flexDirection:'row',
        padding:'1%',
        justifyContent: 'center',
        alignItems: 'center',
        width:'10%'
    },
    krugBox:{
        borderRadius:'50%',
        backgroundColor:theme.palette.primary.main,
        [theme.breakpoints.down('md')]: {
            width:'80%',
          },
        [theme.breakpoints.between('md','lg')]:{
            width:'60%'
        },
        [theme.breakpoints.up('lg')]:{
            width:'50%'
        },
        [theme.breakpoints.up('xl')]:{
            width:'40%'
        }
    }
}))
function Povijest({natjecanje,klub,golovi_obrane}) {
    const classes=useStyles();
    return (
         //box je zapravo div-> blok element-> zauzet ce sav raspolozivi prostor odnosno bit ce sirok ko griditem,dodamo vanjski box da uskladimo prikaz i sirinu s rezultatima
        //dodajemo padding i glavni container da uskaldimo s prikazom rezultata
        <Box style={{paddingLeft:'15%'}}>
            <Box className={classes.container}>
            <Box className={classes.natjecanjeBox}><Typography align='center' style={{color:'#FFFFFF'}}>{natjecanje}</Typography></Box>
            <Box className={classes.klubBox}><Typography align='center' color='secondary'>{klub}</Typography></Box>
            {//za strucni stozer nema prikaza golova, vratit samo box bez icega da zauzima prostor
                (golovi_obrane)?
                (<Box className={classes.goloviObraneBox}>
                    <Box className={classes.krugBox} ><Typography align='center' style={{color:'#FFFFFF'}}>{golovi_obrane}</Typography></Box>
                </Box>)
                :
                ( <Box style={{width:'10%'}} ></Box>)

            }
            <Box style={{width:'5%'}}>{/*kod rezultata je to strelica pa stavljamo ovdje taj box kako bi bili iste VISINE ko rezultati i u syncu ALI JE NE PRIKAZUJEMO */}
                    <IconButton style={{visibility:'hidden'}} size='small'><ArrowForwardIosIcon/></IconButton>
            </Box>
            </Box>
       </Box>
    )
}

export default Povijest
