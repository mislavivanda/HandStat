import React,{Fragment} from 'react'
import {Box, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { useSelector} from 'react-redux';
const useStyles=makeStyles((theme)=>({
    rezultatBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        borderStyle:'solid',
        borderColor:theme.palette.secondary.main,
        borderWidth:2
      }
}))
function RezultatUtakmice() {
    const classes=useStyles();
    const domaciRez=useSelector(state=>state.rezultat.timDomaci);
    const gostiRez=useSelector(state=>state.rezultat.timGosti);
    return (
       <Fragment>
              <Typography align='center' variant='h5'>REZULTAT</Typography>
                <Box className={classes.rezultatBox}>
                      <Typography variant='h3'>{domaciRez}</Typography>
                      <Typography variant='h3'>:</Typography>
                      <Typography variant='h3'>{gostiRez}</Typography>
                </Box>
       </Fragment>
    )
}

export default RezultatUtakmice
