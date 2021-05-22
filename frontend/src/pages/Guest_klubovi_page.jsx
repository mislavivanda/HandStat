import React,{useState} from 'react'
import {Grid,Box,Typography,Select,MenuItem,FormControl,Card,CardContent,CardMedia,CardActionArea} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ErrorDialog from '../components/ErrorDialog'
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import {postaviError} from '../redux/slicers/error';
import { useSelector, useDispatch } from 'react-redux';
import {dohvatiSvaNatjecanja} from '../graphql/query';
import { useLazyQuery,useQuery } from '@apollo/client';
import {dohvatiSveKluboveOdNatjecanja} from '../graphql/query'
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
    klubCard:{
        borderColor:theme.palette.primary.main,
        borderStyle:'solid'
    }
}))
function Guest_klubovi_page(props) {
    const dispatch=useDispatch();
    const classes=useStyles();
    const isError=useSelector((state)=>state.error);
    const [odabranoNatjecanje,setOdabranoNatjecanje]=useState(null);
    const {data:svaNatjecanjaData,loading:svaNatjecanjaLoading,error:svaNatjecanjaError}=useQuery(dohvatiSvaNatjecanja);//nema varijabli querya

    const [dohvatiKlubove,{data:kluboviNatjecanjaData,loading:kluboviNatjecanjaLoading,error:kluboviNatjecanjaError}]=useLazyQuery(dohvatiSveKluboveOdNatjecanja,{
        onError:(error)=>{
            dispatch(postaviError(true));
        }
    });

    function handleNatjecanjeSelect(event){
        dohvatiKlubove({
            variables:{
                natjecanje_id:event.target.value.id
            }
        });
        setOdabranoNatjecanje(event.target.value);
    }

    function handleCardClick(klub_id)
    {
        props.history.push(`/klub/${klub_id}`);
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
                                <Typography align='center' variant='h4'>NATJECANJE</Typography>
                            </Grid>
                            <Grid item container direction='row'>
                                <FormControl style={{width:'100%'}}>
                                    <Box align='right'><SportsHandballIcon/></Box>
                                    <Select 
                                    value={(odabranoNatjecanje)? odabranoNatjecanje : ''}  
                                    onChange={(e)=>handleNatjecanjeSelect(e)} 
                                    renderValue={(selected)=> <Typography align='center'>{selected.naziv+' '+selected.sezona}</Typography>} >
                                    {
                                    svaNatjecanjaData.natjecanja&&svaNatjecanjaData.natjecanja.map((natjecanje)=><MenuItem key={natjecanje.id} value={natjecanje}><Typography color='secondary'>{natjecanje.naziv+' '+natjecanje.sezona}</Typography></MenuItem>)
                                    }
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {
                            (()=>{
                                if(kluboviNatjecanjaLoading)
                                {
                                    return (<CircularProgress className={classes.loadingItem} color='primary'/>)
                                }
                                else if(kluboviNatjecanjaData)
                                {
                                return (
                                <Grid style={{marginTop:100}} item container spacing={5} justify='row' xs={12}>
                                    {
                                        kluboviNatjecanjaData.klubovi&&kluboviNatjecanjaData.klubovi.map((klub)=>(
                                            <Grid item key={klub.id} xs={12} sm={6} md={4}>
                                                <Card className={classes.klubCard} onClick={(e)=>handleCardClick(klub.id)}>
                                                    <CardContent>
                                                        <Typography align='center' color='secondary' variant='h5'>{klub.naziv}</Typography>
                                                    </CardContent>
                                                    <CardActionArea>
                                                        <CardMedia
                                                        style={{margin:'auto',paddingBottom:16,height:150,width:'auto'}}
                                                        component='img'
                                                        image={(klub.image_path)? klub.image_path : 'http://localhost:3001/unknownclubimage.jpg'}
                                                        />
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        ))
                                    }
                                </Grid>)
                                }
                                else return null;
                            })()
                        }
                        {
                                //imamo 2 moguca errora-> error dohvata svih rezultata će se ishandleat gore u zasebnom returnu a drugi error(dohvat klubova od natjecanja) cemo ishandleat ovdje sa error popupom, vratit cemo popup a gore će se vratit null jer ce data bit null i nece bit loadinga
                            (isError&&kluboviNatjecanjaError.message)?
                            <ErrorDialog errorText={kluboviNatjecanjaError.message}/>
                            :
                            null
                        }
                    </Grid>
            </div>
        )
    }
}

export default Guest_klubovi_page
