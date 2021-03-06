import React from 'react'
import {Grid,Typography,Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
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
    return (
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
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{props.nadzornik.maticni_broj+' '+props.nadzornik.ime+' '+props.nadzornik.prezime}</Typography></Box>
                                </Grid>
                                <Grid item xs={5}>
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{(props.lijecnik)? (props.lijecnik.maticni_broj+' '+props.lijecnik.ime+' '+props.lijecnik.prezime) : ''}</Typography></Box>
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
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{props.zapisnicar.maticni_broj+' '+props.zapisnicar.ime+' '+props.zapisnicar.prezime}</Typography></Box>
                                </Grid>
                                <Grid item xs={5}>
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{(props.mjeracVremena)? (props.mjeracVremena.maticni_broj+' '+props.mjeracVremena.ime+ ' '+props.mjeracVremena.prezime) : ''}</Typography></Box>
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
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{props.sudac1.maticni_broj+' '+props.sudac1.ime+' '+props.sudac1.prezime}</Typography></Box>
                                </Grid>
                                <Grid item xs={5}>
                                    <Box className={classes.desniInfoBox}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{(props.sudac2)? (props.sudac2.maticni_broj+' '+props.sudac2.ime+' '+props.sudac2.prezime) : ''}</Typography></Box>
                                </Grid>
                            </Grid> 
                        </Grid>
    )
}

export default UtakmicaInfoOsoblje
