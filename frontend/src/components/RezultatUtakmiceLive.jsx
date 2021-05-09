import React,{useState,useEffect,Fragment} from 'react'
import {Box,Typography,Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import {dohvatiLiveRezultatUtakmice} from '../graphql/query';
import {rezultatUtakmice,statusUtakmice,minutaUtakmice} from '../graphql/subscription';
import {useQuery} from '@apollo/client';
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
    },
    aktivnaUtakmica:{
        backgroundColor:theme.palette.primary.main
    },
    poluvremeUtakmica:{
        backgroundColor:'#fa9905'
    },
    krajUtakmica:{
        backgroundColor:theme.palette.secondary.main
    }
}));
function RezultatUtakmiceLive(props) {
    const classes=useStyles();
    const [renderDomaci,setRenderDomaci]=useState(false);
    const [renderGosti,setRenderGosti]=useState(false);
    // Whenever the GraphQL server pushes NEW DATA to the client, the component re-renders
    const {data,loading,error,subscribeToMore,refetch}=useQuery(dohvatiLiveRezultatUtakmice,{
        variables:{
            broj_utakmice:props.brojUtakmice
        }
    });

    const subscribePromjenaStatusa=()=>subscribeToMore({
        document:statusUtakmice,
        variables:{
            broj_utakmice:props.brojUtakmice
        },
        updateQuery:(prev,{subscriptionData})=>{
            if(!subscriptionData.data) return prev;
            return {
                rezultatutakmice:{
                ...prev.rezultatutakmice,
                status:subscriptionData.data.statusutakmice.status
                }
            }
        }
    });

    const subscribePromjenaVremena=()=>subscribeToMore({
        document:minutaUtakmice,
        variables:{
            broj_utakmice:props.brojUtakmice
        },
        updateQuery:(prev,{subscriptionData})=>{
            if(!subscriptionData.data) return prev;
            return {
                rezultatutakmice:{
                ...prev.rezultatutakmice,
                minuta:subscriptionData.data.minutautakmice.minuta
                }
            }
        }
    });

    const subscribePromjenaRezultata=()=>subscribeToMore({
        document:rezultatUtakmice,
        variables:{
            broj_utakmice:props.brojUtakmice
        },
        updateQuery:(prev,{subscriptionData})=>{
            if(!subscriptionData.data) return prev;
            if(subscriptionData.data.rezultatutakmice.rezultat_domaci!==prev.rezultatutakmice.rezultat_domaci)
            {
                setRenderDomaci(true);
                setTimeout(function(){
                    setRenderDomaci(false);
                },2000);
            }
            else {//inače je promjena gostujućeg rezultata
                setRenderGosti(true);
                setTimeout(function(){
                    setRenderGosti(false);
                },2000);
            }
            //update stanje u cacheu
            return {
                rezultatutakmice:{
                    ...prev.rezultatutakmice,
                    rezultat_domaci:subscriptionData.data.rezultatutakmice.rezultat_domaci,
                    rezultat_gosti:subscriptionData.data.rezultatutakmice.rezultat_gosti
                }
            }
        }

    });
    useEffect(()=>{
        refetch();//isti princip kao kod rezultatuzivo box
        subscribePromjenaStatusa();
        subscribePromjenaVremena();
        subscribePromjenaRezultata();
    },[])
//kad bi radili tako da stavimo if(data) i tu radili sve stvari što radimo u onSubscriptionsData onda bi usli u beskonačnu petlja rerendera jer kada
//bi stigli prvi podaci onda data više ne bi bio null-> nakon svakog rerednera bi ušli u taj dio i svaki put postavili state u elseu(jer bi domaci rezultat bio isti nakon prvog rerednera)-> to bi opet reredneralo i 
//uslo u setanje statea i tako ukrug-> zato to obavljamo u onSubscriptionsData
    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(loading) return null;

    if(data)
    {
        return (
            <Fragment>
                <Grid item container direction='row' justify='center' alignItems='center' xs={12} style={{marginTop:50}}>
                    <Box>
                        <Typography align='center' variant='h5' color='primary'>{data.rezultatutakmice.minuta}'</Typography>
                    </Box>
                </Grid>
                <Grid item container direction='row' justify='space-evenly' alignItems='stretch' xs={12}>{/*container od rezultata*/}
                        <Grid item container direction='row' justify='center' alignItems='center' xs={12} md={5}>
                                <Box  className={classes.ekipaBox}>
                                    <Typography variant='h5' style={{color:'#FFFFFF'}}>{props.domaciNaziv}</Typography>
                                </Box>
                        </Grid>
                            <Grid item container direction='row' justify='center' alignItems='center'  xs={12} md={2}>
                                <Box className={`${classes.rezultatBox}
                                ${(()=>{
                                    if(data.rezultatutakmice.status===3)
                                    {
                                        return classes.poluvremeUtakmica
                                    }
                                    else if(data.rezultatutakmice.status===5)
                                    {
                                        return classes.krajUtakmica
                                    }
                                    else return classes.aktivnaUtakmica
                                    })
                                    ()} 
                                    `} >
                                    <Typography  align='center' variant='h5' style={{color:(renderDomaci)?'#f7ea00':'#FFFFFF'}}> {data.rezultatutakmice.rezultat_domaci}</Typography>
                                    <Typography align='center'  variant='h5' style={{color:'#FFFFFF'}}>:</Typography>
                                    <Typography align='center'  variant='h5' style={{color:(renderGosti)?'#f7ea00':'#FFFFFF'}}>{data.rezultatutakmice.rezultat_gosti}</Typography>
                                </Box>
                            </Grid>
                            <Grid item container direction='row' justify='space-around' alignItems='center' xs={12} md={5}>
                            <Box className={classes.ekipaBox}>
                                    <Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>{props.gostiNaziv}</Typography>
                                </Box>
                            </Grid>
                </Grid>
            </Fragment>
        )
    }

}

export default RezultatUtakmiceLive
