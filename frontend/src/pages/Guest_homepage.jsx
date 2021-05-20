import React from 'react'
import {Grid,Typography,Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import logo from '../images/handstat_logo.png';
import RezultatiUzivo from '../components/RezultatiUzivoBox';
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
export default function Guest_homepage(props) {//props su defaultni propsi koje dobija svakka komponenta u App.js a omgućavaju ih provideri,u našem slučaju nas zanima browserPrvodier u kojem se nalazi history objekt-> pristupamo mu preko props.history
    const classes=useStyles();
    return (
        <Grid container display='column' justify='center' alignItems='center' spacing={3}>
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
                <Grid item container xs={12} justify='center' >
                    <Grid item sm={8} xs={12} >{/*naslov REZULTATI UŽIVO nestamo u ove grid i box iteme da ga uskladimo sa rezultatima u gridlisti kako bi ga mogli realtivno dobro centrirat u odnosu na centar rezultata-> tamo mičemo za 9% ovde za 10% pošto je veći grid(jer nije unutar grid liste) pa treba malo više i pomaknit */}
                        <Box>
                            <Typography align='center'  variant='h6'style={{fontWeight:'bold',fontSize:'1.5rem',marginRight:'10%'}} color='secondary'>REZULTATI UŽIVO</Typography>
                        </Box>
                    </Grid>
                </Grid>
                <RezultatiUzivo history={props.history}/>
            </Grid>
        </Grid>
    )
}
