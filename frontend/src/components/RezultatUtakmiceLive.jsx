import React,{useState,useEffect} from 'react'
import {Box,Typography,Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {rezultatUtakmice} from '../graphql/subscription';
import {useSubscription} from '@apollo/client';
const useStyles = makeStyles((theme)=>({
    ekipaBox:{
        display:'flex',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:theme.palette.secondary.main,
        height:60
    },
    rezultatBox:{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:theme.palette.primary.main,
        width:'100%',
        height:60
    }
}));
function RezultatUtakmiceLive(props) {
    const classes=useStyles();
    const [rezultatDomaci,setRezultatDomaci]=useState(props.rezultatDomaci);
    const [rezultatGosti,setRezultatGosti]=useState(props.rezultatGosti);
    const [renderDomaci,setRenderDomaci]=useState(false);
    const [renderGosti,setRenderGosti]=useState(false);
    // Whenever the GraphQL server pushes NEW DATA to the client, the component re-renders
    const {data,loading,error}=useSubscription(rezultatUtakmice,{
        variables:{
            broj_utakmice:props.brojUtakmice
        },
        onSubscriptionData: ({ subscriptionData: { data } }) => {
        //promijeni rezultat i trigeraj rerender
        //promjena domaćeg rezultata
        if(data.rezultatutakmice.rezultat_domaci!==rezultatDomaci)
        {
            setRezultatDomaci(data.rezultatutakmice.rezultat_domaci);
            setRenderDomaci(true);
            setTimeout(function(){
                setRenderDomaci(false);
            },2000);
        }
        else {//inače je promjena gostujućeg rezultata
            setRezultatGosti(data.rezultatutakmice.rezultat_gosti);
            setRenderGosti(true);
            setTimeout(function(){
                setRenderGosti(false);
            },2000);
        }
          }
    });
//kad bi radili tako da stavimo if(data) i tu radili sve stvari što radimo u onSubscriptionsData onda bi usli u beskonačnu petlja rerendera jer kada
//bi stigli prvi podaci onda data više ne bi bio null-> nakon svakog rerednera bi ušli u taj dio i svaki put postavili state u elseu(jer bi domaci rezultat bio isti nakon prvog rerednera)-> to bi opet reredneralo i 
//uslo u setanje statea i tako ukrug-> zato to obavljamo u onSubscriptionsData
    if(error) return (<Alert severity="error">{error.message}</Alert>)

    return (
        <Grid item container direction='row' justify='space-evenly' alignItems='stretch' style={{marginTop:50}} xs={12}>{/*container od rezultata*/}
                   <Grid item container direction='row' justify='center' alignItems='center' xs={12} md={5}>
                        <Box  className={classes.ekipaBox}>
                            <Typography variant='h5' style={{color:'#FFFFFF'}}>{props.domaciNaziv}</Typography>
                        </Box>
                   </Grid>
                    <Grid item container direction='row' justify='center' alignItems='center'  xs={12} md={2}>
                        <Box className={classes.rezultatBox}>
                            <Typography  align='center' variant='h5' style={{color:(renderDomaci)?'#f7ea00':'#FFFFFF'}}> {rezultatDomaci}</Typography>
                            <Typography align='center'  variant='h5' style={{color:'#FFFFFF'}}>:</Typography>
                            <Typography align='center'  variant='h5' style={{color:(renderGosti)?'#f7ea00':'#FFFFFF'}}>{rezultatGosti}</Typography>
                        </Box>
                    </Grid>
                    <Grid item container direction='row' justify='space-around' alignItems='center' xs={12} md={5}>
                    <Box className={classes.ekipaBox}>
                            <Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>{props.gostiNaziv}</Typography>
                        </Box>
                    </Grid>
        </Grid>
    )
}

export default RezultatUtakmiceLive
