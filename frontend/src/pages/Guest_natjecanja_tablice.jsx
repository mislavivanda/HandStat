import React,{useState} from 'react'
import {Grid,Box,Typography,Select,MenuItem,FormControl} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ErrorDialog from '../components/ErrorDialog'
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import {postaviError} from '../redux/slicers/error';
import { useSelector, useDispatch } from 'react-redux';
import {dohvatiSvaNatjecanja, dohvatiTablicuNatjecanja} from '../graphql/query';
import { useLazyQuery,useQuery } from '@apollo/client';
const useStyles=makeStyles((theme)=>({
    loadingItem:{
        position:'fixed',
        top:'50%',
        left:'50%',
        transform: 'translate(-50%, -50%)'
    },
    alertItem:{
        position:'fixed',
        top:'50%',
        left:'50%',
        transform: 'translate(-50%, -50%)'
    },
    tablicaStupciBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        width:'100%',
        backgroundColor:theme.palette.primary.main,
        height:60
  },
  tablicaCelijeBox:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  tablicaRedakBox:{
    display:'flex',
    flexDirection:'row',
    alignItems:'stretch',
    justifyContent:'space-between',
    width:'100%',
    backgroundColor:theme.palette.secondary.main,
    height:40
  },
  prvoMjestoBox:{
      backgroundColor:'#fa9905'
  }
}))
function Guest_natjecanja_tablice() {
    const dispatch=useDispatch();
    const classes=useStyles();
    const isError=useSelector((state)=>state.error);
    const [odabranoNatjecanje,setOdabranoNatjecanje]=useState(null);
    const {data:svaNatjecanjaData,loading:svaNatjecanjaLoading,error:svaNatjecanjaError}=useQuery(dohvatiSvaNatjecanja);

    const [dohvatiTablicu,{data:tablicaData,loading:tablicaLoading,error:tablicaError}]=useLazyQuery(dohvatiTablicuNatjecanja,{
        onError:(error)=>{
            dispatch(postaviError(true));
        }
    })

    function handleNatjecanjeSelect(event){
        dohvatiTablicu({
            variables:{
                natjecanje_id:event.target.value.id
            }
        })
        setOdabranoNatjecanje(event.target.value);
    }
    if(svaNatjecanjaLoading)
    {
        return (<CircularProgress className={classes.loadingItem} color='primary'/>)
    }
    if(svaNatjecanjaError)
    {
        return (<Alert className={classes.alertItem} severity="error">{svaNatjecanjaError.message}</Alert>)
    }
    if(svaNatjecanjaData)
    {
        return (
            <div>
                <Grid style={{marginTop:100}} container direction='column' alignItems='center' justify='space-around'>{/*parent glavni container */}
                        <Grid style={{marginTop:100}} item container direction='column' alignItems='center' justify='space-between' sm={6} xs={12}  >{/*container od natjecanje selectora*/}
                            <Grid item xs={12}>
                                <Typography color='secondary' align='center' variant='h4'>NATJECANJE</Typography>
                            </Grid>
                            <Grid item container direction='row' xs={12}>
                                <FormControl style={{width:'100%'}}>
                                    <Box align='right'><SportsHandballIcon/></Box>
                                    <Select 
                                    value={(odabranoNatjecanje)? odabranoNatjecanje : ''}  
                                    onChange={(e)=>handleNatjecanjeSelect(e)} 
                                    renderValue={(selected)=> <Typography color='secondary' align='center'>{selected.naziv+' '+selected.sezona}</Typography>} >
                                    {
                                    svaNatjecanjaData.natjecanja&&svaNatjecanjaData.natjecanja.map((natjecanje)=><MenuItem key={natjecanje.id} value={natjecanje}><Typography color='secondary'>{natjecanje.naziv+' '+natjecanje.sezona}</Typography></MenuItem>)
                                    }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {
                            (()=>{
                                if(tablicaLoading)
                                {
                                    return (<CircularProgress color='primary'/>)
                                }
                                if(tablicaData)
                                {
                                    return (
                                        <Grid item  style={{marginTop:100}}  container direction='column' justify='space-evenly' alignItems='center' xs={12}>
                                            <Box className={classes.tablicaStupciBox}>
                                                <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>#</Typography> </Box>
                                                <Box className={classes.tablicaCelijeBox} style={{width:'44%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>KLUB</Typography> </Box>
                                                <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>PG</Typography> </Box>
                                                <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>W</Typography> </Box>
                                                <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>L</Typography> </Box>
                                                <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>X</Typography> </Box>
                                                <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>+/-</Typography> </Box>
                                                <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>P</Typography> </Box>
                                            </Box>
                                            {
                                                tablicaData.natjecanjetablica&&tablicaData.natjecanjetablica.map((redak,index)=>(
                                                    <Box key={redak.klub.id} className={classes.tablicaRedakBox}>
                                                        <Box className={`${classes.tablicaCelijeBox} ${(index===0)? classes.prvoMjestoBox : ''}`} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>{index+1}</Typography> </Box>
                                                        <Box className={classes.tablicaCelijeBox} style={{width:'44%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>{redak.klub.naziv}</Typography> </Box>
                                                        <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>{redak.pobjede+redak.porazi+redak.nerjeseni}</Typography> </Box>
                                                        <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>{redak.pobjede}</Typography> </Box>
                                                        <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>{redak.porazi}</Typography> </Box>
                                                        <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>{redak.nerjeseni}</Typography> </Box>
                                                        <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>{redak.gol_razlika}</Typography> </Box>
                                                        <Box className={classes.tablicaCelijeBox} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>{redak.bodovi}</Typography> </Box>
                                                    </Box>
                                                ))
                                            }
                                        </Grid>)
                                }
                            })()
                        }
                        {
                              (isError&&tablicaError.message)?
                              <ErrorDialog errorText={tablicaError.message}/>
                              :
                              null
                        }
                </Grid>
            </div>)
    }
}

export default Guest_natjecanja_tablice
