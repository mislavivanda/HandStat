import React from 'react'
import {Grid,Typography,Box,GridList} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import Navbar from '../components/Navbar';
import Rezultat from '../components/Rezultat';
import logo from '../images/handstat_logo.png';
const useStyles=makeStyles((theme)=>({
    logoBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-start'
    },
    logo:{
        marginTop:'5vh',
        height:'80%',
        width:'30%'
    },
    rezultatiBox:{
        marginTop:'2vh',
    },
    gridList:{
        width:'100%',
        height:300,
        borderStyle:'solid',
        borderColor:theme.palette.primary.main,
        borderWidth:2,
    },
    gridItem:{
        margin:'auto'
    }
}))
const mockData=[
    {
        broj_utakmice:12698426,
        natjecanje:'Premijer Liga',
        domaci:'RK Nexe',
        gosti:'RK PPD Zagreb',
        golovi_domaci:25,
        golovi_gosti:18
    },
    {
        broj_utakmice:12603426,
        natjecanje:'Premijer Liga',
        domaci:'RK Nexe',
        gosti:'RK PPD Zagreb',
        golovi_domaci:25,
        golovi_gosti:18
    },
    {
        broj_utakmice:127018426,
        natjecanje:'Premijer Liga',
        domaci:'RK Nexe',
        gosti:'RK PPD Zagreb',
        golovi_domaci:25,
        golovi_gosti:18
    },
    {
        broj_utakmice:12408426,
        natjecanje:'Premijer Liga',
        domaci:'RK Nexe',
        gosti:'RK PPD Zagreb',
        golovi_domaci:25,
        golovi_gosti:18
    },
    {
        broj_utakmice:12206898426,
        natjecanje:'Premijer Liga',
        domaci:'RK Nexe',
        gosti:'RK PPD Zagreb',
        golovi_domaci:25,
        golovi_gosti:18
    },
    {
        broj_utakmice:126986,
        natjecanje:'Premijer Liga',
        domaci:'RK Nexe',
        gosti:'RK PPD Zagreb',
        golovi_domaci:25,
        golovi_gosti:18
    },
    {
        broj_utakmice:126426,
        natjecanje:'Premijer Liga',
        domaci:'RK Nexe',
        gosti:'RK PPD Zagreb',
        golovi_domaci:25,
        golovi_gosti:18
    },
    {
        broj_utakmice:1270426,
        natjecanje:'Premijer Liga',
        domaci:'RK Nexe',
        gosti:'RK PPD Zagreb',
        golovi_domaci:25,
        golovi_gosti:18
    },
    {
        broj_utakmice:12426,
        natjecanje:'Premijer Liga',
        domaci:'RK Nexe',
        gosti:'RK PPD Zagreb',
        golovi_domaci:25,
        golovi_gosti:18
    },
    {
        broj_utakmice:16898426,
        natjecanje:'Premijer Liga',
        domaci:'RK Nexe',
        gosti:'RK PPD Zagreb',
        golovi_domaci:25,
        golovi_gosti:18
    }
];
export default function Guest_homepage(props) {//props su defaultni propsi koje dobija svakka komponenta u App.js a omgućavaju ih provideri,u našem slučaju nas zanima browserPrvodier u kojem se nalazi history objekt-> pristupamo mu preko props.history
    const classes=useStyles();
    return (
        <div>
        <Grid container display='column' justify='center' alignItems='center' spacing={3}>
           <Grid item xs={12}>
            <Navbar history={props.history}/>{/* NAVBAR JE POSITION:FIXED PA JE IZBAČEN IZ NORMALNOG FLOWA-> PRVI ČLAN GRIDA ĆE SE POZICIONIRATI KAO DA NJEGA GORE NEMA ODNOSNO PREMA VRHU VIEWPORTA-> STAVIT MARGINU TOP*/}
            </Grid>
            <Grid style={{marginTop:100}} item container display='row' justify='flex-start' alignItems='center' xs={12}>
                <Grid item xs={12} sm={6}>
                <Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography style={{fontWeight:'bold',paddingTop:'4%' ,width:'80%', fontSize:'2.8rem', marginTop:'5vh'}}  color='secondary'>HANDSTAT </Typography></Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant='h6'style={{fontWeight:'bold',fontSize:'1.5rem'}} color='secondary'>Prati rezultate utakmica uživo, detalje o igračima i klubovima i još puno toga....</Typography>
                </Grid>
            </Grid>
            <Grid  item xs={12} style={{marginTop:'2vh'}}>
                <Typography  variant='h6'style={{fontWeight:'bold',fontSize:'1.5rem'}} color='secondary'>Zaljubljenik ste u rukomet, a nikako ne možete pronaći mjesto koje će vam ponuditi detaljne informacije o Vašem najdražem klubu, igračima ili ligi te omogućiti kvalitetno praćenje utakmice uživo?</Typography>
            </Grid>
            <Grid item xs={12} style={{marginTop:'2vh'}}>
            <Typography  variant='h6'style={{ fontWeight:'bold',fontSize:'1.5rem', marginTop:'2vh'}} color='secondary'>Ako ste se pronašli u gornjoj rečenici na pravom ste mjestu. Handstat Vam omogućava detaljno praćenje rezultata uživo, pregled odigranih utakmica, statistike igrača i klubova za pojedina natjecanja . </Typography>
            </Grid>
            <Grid  className={classes.rezultatiBox} item container display='column' justify='center' alignItems='center' spacing={3}>
                <Grid item xs={6} >
                <Typography align='center' variant='h6'style={{fontWeight:'bold',fontSize:'1.5rem'}} color='secondary'>REZULTATI UŽIVO</Typography>
                </Grid>
                <Grid item xs={12}>
                    <GridList  className={classes.gridList} cols={1} cellHeight={50} spacing={20} >
                        {mockData.map((rezultat)=>(
                            <Grid key={rezultat.broj_utakmice} item sm={8} xs={12} className={classes.gridItem}>
                                <Rezultat history={props.history} broj_utakmice={rezultat.broj_utakmice}  natjecanje={rezultat.natjecanje} domaci={rezultat.domaci} gosti={rezultat.gosti} golovi_domaci={rezultat.golovi_domaci} golovi_gosti={rezultat.golovi_gosti}/>
                           </Grid>
                        ))}
                    </GridList>
                </Grid>
            </Grid>
        </Grid>
        </div>
    )
}
