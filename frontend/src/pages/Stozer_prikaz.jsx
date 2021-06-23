import {React,useState,useEffect} from 'react'
import {Box,Typography,AppBar,Grid,GridList,Select,FormControl,MenuItem} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import logo from '../images/handstat_logo.png';
import Rezultat from '../components/Rezultat';
import Povijest from '../components/Povijest'
import GolPrikaz from '../components/Gol_igrac_golman_prikaz';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {dohvatiStozerPrikaz} from '../graphql/query';
import { useLazyQuery } from '@apollo/client';
const useStyles = makeStyles((theme)=>({
    appBar:{
        color:'primary',
        display:'flex',
        position:'fixed',
        marginTop:0,
        flexDirection:'row',
        alignItems:'stretch',
        minHeight:50
    },
    logoBox:{
        display: 'inline-flex',//ovako ga iscrtavamo kao inline element pa zauzima onoliko koliko mu zauzimaju djeca dok kod display:flex zauzima koliko god može mjesta odnosno koliko je velik grid
        flexDirection:'row',
        marginLeft:0,
        alignItems:'center',
        justifyContent:'flex-start',
        backgroundColor:'#FFFFFF',
    },
    logo:{
        height:'auto',
        width:'25%',
        maxWidth:50,
    },
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
    clanSlika:{
        width:'90%',
        height:'auto'
    },
    boxLabels:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        backgroundColor:theme.palette.secondary.main
    },
    infoGlavniBox:{
        backgroundColor:theme.palette.secondary.main,
    },
    infoBox:{
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
    info:{
        width:'50%',
        borderColor:theme.palette.primary.main,
        borderStyle:'solid'
    }
}))
function Stozer_prikaz({history,match}) {
    const classes=useStyles();
    const [maticniBroj,setMaticniBroj]=useState(null);
    const [klubID,setKlubID]=useState(null);
    useEffect(()=>{//vidi je li igrac ili golmana i izvuci maticni broj i klub id kod mountanja
        setMaticniBroj(decodeURIComponent(match.params.maticni_broj).toString());
        setKlubID(parseInt(match.params.klub_id));
        dohvatiStozer({
            variables:{
                maticni_broj:decodeURIComponent(match.params.maticni_broj).toString(),
                klub_id:parseInt(match.params.klub_id)
            }
        })
    },[])
    const [dohvatiStozer,{data,loading,error}]=useLazyQuery(dohvatiStozerPrikaz);

    if(loading||!maticniBroj||!klubID||!(klubID&&maticniBroj&&data))
    {
        return (<CircularProgress className={classes.loadingItem} color='primary'/>)
    }
    if(error)
    {
        return (<Alert className={classes.alertItem} severity="error">{error.message}</Alert>)
    }
    if(klubID&&maticniBroj&&data)
    {
        return (
            <div>
                <AppBar className={classes.appBar}>
                    <Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography style={{fontWeight:'bold'}} align='center' color='secondary'>HANDSTAT </Typography></Box>
                </AppBar>
                <Grid container direction='column' justify='space-evenly' alignItems='center' style={{marginTop:70}}>{/*/glavni grid*/}
                    <Grid item container direction='row' justify='center' alignItems='center' style={{marginTop:20}} xs={12}>{/*container od podataka i slike*/}
                            <Grid item container direction='column' justify='center' alignItems='center'  xs={12} sm={5}>
                                <Typography style={{fontWeight:'bold'}} align='center' color='secondary' variant='h4'>{data.stozerinfo.info.ime+' '+data.stozerinfo.info.prezime}</Typography>
                                <img src={"http://localhost:3001/playerimage.jpg"} alt="slika člana" className={classes.clanSlika}/>
                            </Grid>
                            <Grid className={classes.infoGlavniBox} item container direction='column' justify='space-evenly' alignItems='flex-start' xs={12} sm={4}>{/*container od informacija igraca*/}
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>IME</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>{data.stozerinfo.info.ime}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>PREZIME</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>{data.stozerinfo.info.prezime}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>NACIONALNOST</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>{data.stozerinfo.info.nacionalnost}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>DATUM ROĐENJA</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>{data.stozerinfo.info.datum_rodenja}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                    </Grid>
                    <Grid item container direction='column' justify='center' alignItems='center' xs={12}>{/*container od utakmica*/}
                        <Box className={classes.boxLabels}>
                            <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>UTAKMICE</Typography>
                        </Box>
                        <GridList style={{width:'100%',marginTop:10,marginBottom:10, height:300}} cols={1} cellHeight={'auto'} spacing={20}>
                                    {
                                            data.stozerinfo.utakmice&&data.stozerinfo.utakmice.map((rezultat)=>(
                                                <Grid key={rezultat.utakmica.broj_utakmice} item sm={8} xs={12} style={{margin:'auto'}}>
                                                    <Rezultat history={history} broj_utakmice={rezultat.utakmica.broj_utakmice} domaci={rezultat.utakmica.domaci.naziv} gosti={rezultat.utakmica.gosti.naziv} natjecanje={rezultat.utakmica.natjecanje.naziv} golovi_domaci={rezultat.utakmica.rezultat_domaci} golovi_gosti={rezultat.utakmica.rezultat_gosti} status={6} />
                                                </Grid>)
                                            )
                                    }
                        </GridList>
                    </Grid>
                    <Grid item container direction='column' justify='center' alignItems='center' xs={12}>{/*container od povijesti */}
                        <Box className={classes.boxLabels}>
                            <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>POVIJEST</Typography>
                        </Box>
                        <GridList style={{width:'100%',marginTop:10,marginBottom:10, height:300,}} cols={1} cellHeight={'auto'} spacing={20}>
                                    {
                                        data.stozerinfo.povijest&&data.stozerinfo.povijest.map((povijest)=>(//nije 100% siguran key ali je vrlo vjerovatan jer je teško da će igrat isto natjecanje za isiti klub s isitm brojem golova/obrana više puta
                                             <Grid key={(povijest.natjecanje+povijest.klub+povijest.goloviobrane_ukupno).toString()} item sm={8} xs={12} style={{margin:'auto'}}>
                                                <Povijest natjecanje={povijest.natjecanje} klub={povijest.klub} />
                                            </Grid>)
                                        )
                                    }
                        </GridList>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Stozer_prikaz
