import React,{Fragment,useState,useEffect} from 'react'
import {Grid,Typography,Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import utakmica from '../mockdata/utakmica.js';
const useStyles=makeStyles((theme)=>({
    desniInfoGlavniBox:{
        backgroundColor:theme.palette.secondary.main
    },
    desniInfoBoxContainer:{
        backgroundColor:theme.palette.primary.main,
        borderLeftColor:theme.palette.secondary.main,
        borderLeftStyle:'solid',
        borderRightColor:theme.palette.secondary.main,
        borderRightStyle:'solid'
    },
    desniInfoBoxZadnjiContainer:{
        backgroundColor:theme.palette.primary.main,
        borderLeftColor:theme.palette.secondary.main,
        borderLeftStyle:'solid',
        borderRightColor:theme.palette.secondary.main,
        borderRightStyle:'solid',
        borderBottomColor:theme.palette.secondary.main,
        borderBottomStyle:'solid'
    },
    desniInfoBox:{
        width:'100%',
        margin:'0.5rem 0 0.5rem 0'
    }
}))
function UtakmicaInfoOsoblje(props) {
    const classes=useStyles();
    const [utakmicaOsoblje,setUtakmicaOsoblje]=useState({
        nadzornik:props.nadzornik,
        lijecnik:props.lijecnik,
        zapisnicar:props.zapisnicar,
        mjeracVremena:props.mjerac_vremena,
        sudac1:props.sudac1,
        sudac2:props.sudac2
    });
    return (
       <Fragment>
               <Grid item container className={classes.desniInfoGlavniBox} direction='column' justify='space-evenly' alignItems='center' xs={12} sm={8} md={7}>{/*box sa podacima DESNO*/}
                            <Grid item container direction='row' justify='space-evenly' alignItems='center' xs>{/* redak sa 2 boxa*/}
                                <Grid item xs={5}>
                                        <Typography style={{color:'#FFFFFF'}}  align='center' variant='h6'>NADZORNIK</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                        <Typography style={{color:'#FFFFFF'}}  align='center' variant='h6'>LIJEČNIK</Typography>
                                </Grid>
                            </Grid>
                            <Grid item container className={classes.desniInfoBoxContainer} direction='row' justify='space-evenly' alignItems='center' xs>
                                <Grid item xs={5}>
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaOsoblje.nadzornik.maticni_broj+' '+utakmicaOsoblje.nadzornik.ime+' '+utakmicaOsoblje.nadzornik.prezime}</Typography></Box>
                                </Grid>
                                <Grid item xs={5}>
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaOsoblje.lijecnik.maticni_broj+' '+utakmicaOsoblje.lijecnik.ime+' '+utakmicaOsoblje.lijecnik.prezime}</Typography></Box>
                                </Grid>
                            </Grid> 
                            <Grid item container direction='row' justify='space-evenly' alignItems='center' xs>{/* redak sa 2 boxa*/}
                                <Grid item xs={5}>
                                        <Typography style={{color:'#FFFFFF'}}  align='center' variant='h6'>ZAPISNIČAR</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                        <Typography style={{color:'#FFFFFF'}}  align='center' variant='h6'>MJERAČ VREMENA</Typography>
                                </Grid>
                            </Grid>
                            <Grid item container className={classes.desniInfoBoxContainer} direction='row' justify='space-evenly' alignItems='center' xs>
                                <Grid item xs={5}>
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaOsoblje.zapisnicar.maticni_broj+' '+utakmicaOsoblje.zapisnicar.ime+' '+utakmicaOsoblje.zapisnicar.prezime}</Typography></Box>
                                </Grid>
                                <Grid item xs={5}>
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaOsoblje.mjeracVremena.maticni_broj+' '+utakmicaOsoblje.mjeracVremena.ime+ ' '+utakmicaOsoblje.mjeracVremena.prezime}</Typography></Box>
                                </Grid>
                            </Grid> 
                            <Grid item container direction='row' justify='space-evenly' alignItems='center' xs>{/* redak sa 2 boxa*/}
                                <Grid item xs={5}>
                                        <Typography style={{color:'#FFFFFF'}}  align='center' variant='h6'>SUDAC1</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                        <Typography style={{color:'#FFFFFF'}}  align='center' variant='h6'>SUDAC2</Typography>
                                </Grid>
                            </Grid>
                            <Grid item container className={classes.desniInfoBoxZadnjiContainer} direction='row' justify='space-evenly' alignItems='center' xs>
                                <Grid item xs={5}>
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaOsoblje.sudac1.maticni_broj+' '+utakmicaOsoblje.sudac1.ime+' '+utakmicaOsoblje.sudac1.prezime}</Typography></Box>
                                </Grid>
                                <Grid item xs={5}>
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaOsoblje.sudac2.maticni_broj+' '+utakmicaOsoblje.sudac2.ime+' '+utakmicaOsoblje.sudac2.prezime}</Typography></Box>
                                </Grid>
                            </Grid> 
                        </Grid>
       </Fragment>
    )
}

export default UtakmicaInfoOsoblje
