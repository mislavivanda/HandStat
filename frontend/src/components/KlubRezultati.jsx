import React,{useState,Fragment} from 'react'
import {Select,MenuItem,FormControl,Typography,Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {dohvatiSveRezultateKluba,dohvatiSvaNatjecanjaKluba} from '../graphql/query';
import { useQuery } from '@apollo/client';
const useStyles=makeStyles((theme)=>({
    loadingItem:{
        position:'fixed',
        top:'50%',
        left:'50%',
        transform: 'translate(-50%, -50%)'
    },
    rezultatiBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around'
    }
}))
function KlubRezultati({klub_id}) {
    const classes=useStyles();
    const [odabranoNatjecanje,setOdabranoNatjecanje]=useState(null);
    const {data:svaNatjecanjaKlubaData,loading:svaNatjecanjaKlubaLoading,error:svaNatjecanjaKlubaError}=useQuery(dohvatiSvaNatjecanjaKluba,{
        variables:{
            klub_id:klub_id
        }
    });
    const {data:sviRezultatiKlubaData,loading:sviRezultatiKlubaLoading,error:sviRezultatiKlubaError}=useQuery(dohvatiSveRezultateKluba,{
        variables:{
            klub_id:klub_id
        }
    })
    function handleNatjecanjeSelect(event){
        setOdabranoNatjecanje(event.target.value);
    }

    if(svaNatjecanjaKlubaLoading||sviRezultatiKlubaLoading)
    {
        return (<CircularProgress color='primary'/>)
    }
    if(svaNatjecanjaKlubaError||sviRezultatiKlubaError)
    {
        return (<Alert severity="error">{(svaNatjecanjaKlubaError)? svaNatjecanjaKlubaError.message : sviRezultatiKlubaError.message}</Alert>)
    }
    if(svaNatjecanjaKlubaData&&sviRezultatiKlubaData)//tek kad stignu svi podaci o natjecanjima i rezultatima renderamo
    {
        return (
            <Box>
                <Box>
                    <Typography color='secondary' align='center' variant='h5'> NATJECANJE</Typography>
                </Box>
                <Box>
                 <FormControl style={{width:'100%'}}>
                         <Box align='right'><SportsHandballIcon/></Box>
                         <Select 
                         value={(odabranoNatjecanje)? odabranoNatjecanje : ''}  
                         onChange={(e)=>handleNatjecanjeSelect(e)} 
                         renderValue={(selected)=> <Typography color='secondary' align='center'>{selected.naziv+' '+selected.sezona}</Typography>} >
                         {
                         svaNatjecanjaKlubaData.natjecanjakluba&&svaNatjecanjaKlubaData.natjecanjakluba.map((natjecanje)=><MenuItem key={natjecanje.id} value={natjecanje}><Typography color='secondary'>{natjecanje.naziv+' '+natjecanje.sezona}</Typography></MenuItem>)
                         }
                         </Select>
                         {
                             (odabranoNatjecanje)?
                             sviRezultatiKlubaData.rezultatikluba.map((rezultat)=>{
                                 if(rezultat.natjecanje.id===odabranoNatjecanje.id)
                                 {
                                     return (
                                         <Fragment>
                                            <Box className={classes.rezultatiBox}>
                                                    <Typography style={{color:'#54e346'}} variant='h4'>W</Typography>
                                                    <Typography color='secondary' variant='h4'>{rezultat.pobjede}</Typography>
                                         </Box>
                                            <Box className={classes.rezultatiBox}>
                                                    <Typography style={{color:'#ec0101'}} variant='h4'>L</Typography>
                                                    <Typography color='secondary' variant='h4'>{rezultat.porazi}</Typography>
                                            </Box>
                                            <Box className={classes.rezultatiBox}>
                                                    <Typography color='secondary' variant='h4'>X</Typography>
                                                    <Typography color='secondary' variant='h4'>{rezultat.nerjeseni}</Typography>
                                            </Box>
                                         </Fragment>
                                     )
                                 }
                             })
                             :
                             null
                         }
                     </FormControl>
                </Box>
            </Box>
         )
    }
}

export default KlubRezultati
