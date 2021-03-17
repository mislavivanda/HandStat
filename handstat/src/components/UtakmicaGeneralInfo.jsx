import React,{Fragment,useEffect,useState} from 'react'
import {Grid,Box,Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import utakmica from '../mockdata/utakmica.js';
import { useDispatch } from 'react-redux';
import {odabranoKolo} from '../redux/slicers/kolo';
import {natjecanjeOdabir} from '../redux/slicers/natjecanje';
const useStyles=makeStyles((theme)=>({
    lijeviInfoGlavniBox:{
        backgroundColor:theme.palette.secondary.main,
    },
    leftInfoBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:theme.palette.primary.main,
        borderRightColor:theme.palette.secondary.main,
        borderRightStyle:'solid',
        borderLeftColor:theme.palette.secondary.main,
        borderLeftStyle:'solid',
        margin:'1rem 0 1rem 0'
    },
    leftInfo:{
        width:'100%',
        borderColor:theme.palette.primary.main,
        borderStyle:'solid'
    },
}))
function UtakmicaGeneralInfo() {//za dohvat nam treba samo broj utakmice kojeg imamo iz URL
    const classes=useStyles();
    const dispatch=useDispatch();
    const [utakmicaInfo,setUtakmicaInfo]=useState(null);
    useEffect(()=>{
        setUtakmicaInfo({//ovo će sve nalaziti u jednom retku u bazi u tablici UTAKMICA osim lokacije i najtecanja koju ćemo dobiti joinom
            kolo:utakmica.kolo,
            natjecanje:utakmica.natjecanje,
            datum:utakmica.datum,
            vrijeme:utakmica.vrijeme,
            gledatelji:utakmica.gledatelji,
            lokacija:utakmica.lokacija
        })
        dispatch(odabranoKolo(utakmica.kolo));
        dispatch(natjecanjeOdabir(utakmica.natjecanje));

    },[])
    return (
       <Fragment>
           {
            (utakmicaInfo)?
            (
            <Grid item className={classes.lijeviInfoGlavniBox} container direction='column' justify='space-evenly' alignItems='flex-start' xs={12} sm={8} md={4}>{/*container sa podacima LIJEVO*/}
                            <Grid item style={{width:'100%'}}>
                                <Box className={classes.leftInfoBox}>
                                   <Typography style={{color:'#FFFFFF'}} variant='h6'>DATUM:</Typography>
                                   <Box className={classes.leftInfo}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaInfo.datum}</Typography></Box>
                                </Box>
                            </Grid>
                            <Grid item style={{width:'100%'}}>
                                <Box className={classes.leftInfoBox}>
                                   <Typography style={{color:'#FFFFFF'}}  variant='h6'>VRIJEME:</Typography>
                                   <Box className={classes.leftInfo}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaInfo.vrijeme}</Typography></Box>
                                </Box>
                            </Grid>
                            <Grid item style={{width:'100%'}}>
                                <Box className={classes.leftInfoBox}>
                                   <Typography style={{color:'#FFFFFF'}}  variant='h6'>GLEDATELJA:</Typography>
                                   <Box className={classes.leftInfo}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaInfo.gledatelji}</Typography></Box>
                                </Box>
                            </Grid>
                            <Grid item style={{width:'100%'}}>
                                <Box className={classes.leftInfoBox}>
                                   <Typography style={{color:'#FFFFFF'}}  variant='h6'>LOKACIJA:</Typography>
                                   <Box className={classes.leftInfo}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaInfo.lokacija}</Typography></Box>
                                </Box>
                            </Grid>
                        </Grid>
            )
            :
            null
            }
       </Fragment>
    )
}

export default UtakmicaGeneralInfo
