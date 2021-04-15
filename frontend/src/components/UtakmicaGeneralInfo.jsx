import React,{Fragment,useState} from 'react'
import {Grid,Box,Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import utakmica from '../mockdata/utakmica.js';
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
}))//nakon dohvata podataka utakmice salju se ko propsovi i postavljaju se u state
function UtakmicaGeneralInfo(props) {//za dohvat nam treba samo broj utakmice kojeg imamo iz URL
    const classes=useStyles();
    const [utakmicaInfo,setUtakmicaInfo]=useState({ 
        datum:props.datum,
        vrijeme:props.vrijeme,
        gledatelji:props.gledatelji,
        lokacija:props.lokacija
    });
    return (
       <Fragment>
         
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
                                   <Box className={classes.leftInfo}><Typography style={{color:'#FFFFFF'}} align='center' variant='h6'>{utakmicaInfo.lokacija.dvorana +' '+utakmicaInfo.lokacija.mjesto}</Typography></Box>
                                </Box>
                            </Grid>
                        </Grid>
       </Fragment>
    )
}

export default UtakmicaGeneralInfo
