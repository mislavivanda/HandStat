import React from 'react'
import {Grid,Box,Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
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
        width:'60%',
        borderColor:theme.palette.primary.main,
        borderStyle:'solid'
    },
}))//nakon dohvata podataka utakmice salju se ko propsovi i postavljaju se u state
function UtakmicaGeneralInfo(props) {//za dohvat nam treba samo broj utakmice kojeg imamo iz URL
    const classes=useStyles();
    return (
            <Grid item className={classes.lijeviInfoGlavniBox} container direction='column' justify='space-evenly' alignItems='flex-start' xs={12} sm={8} md={4}>{/*container sa podacima LIJEVO*/}
                            <Grid item style={{width:'100%'}}>
                                <Box className={classes.leftInfoBox}>
                                    <Box style={{width:'40%'}}><Typography style={{color:'#FFFFFF'}} variant='h6'>DATUM:</Typography></Box>
                                   <Box className={classes.leftInfo}><Typography style={{color:'#FFFFFF'}} variant='h6'>{props.datum}</Typography></Box>
                                </Box>
                            </Grid>
                            <Grid item style={{width:'100%'}}>
                                <Box className={classes.leftInfoBox}>
                                    <Box style={{width:'40%'}}><Typography style={{color:'#FFFFFF'}}  variant='h6'>VRIJEME:</Typography></Box>
                                   <Box className={classes.leftInfo}><Typography style={{color:'#FFFFFF'}}  variant='h6'>{props.vrijeme}</Typography></Box>
                                </Box>
                            </Grid>
                            <Grid item style={{width:'100%'}}>
                                <Box className={classes.leftInfoBox}>
                                    <Box style={{width:'40%'}}><Typography style={{color:'#FFFFFF'}}  variant='h6'>GLEDATELJA:</Typography></Box>
                                   <Box className={classes.leftInfo}><Typography style={{color:'#FFFFFF'}}  variant='h6'>{props.gledatelji}</Typography></Box>
                                </Box>
                            </Grid>
                            <Grid item style={{width:'100%'}}>
                                <Box className={classes.leftInfoBox}>
                                    <Box style={{width:'40%'}}><Typography style={{color:'#FFFFFF'}}  variant='h6'>LOKACIJA:</Typography></Box>
                                   <Box className={classes.leftInfo} style={{overflow:'break-word'}}><Typography style={{color:'#FFFFFF'}}  variant='h6'>{props.lokacija.dvorana +' '+props.lokacija.mjesto}</Typography></Box>
                                </Box>
                            </Grid>
                </Grid>
    )
}

export default UtakmicaGeneralInfo
