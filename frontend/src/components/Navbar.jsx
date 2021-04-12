import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import logo from '../images/handstat_logo.png';
import {AppBar,Button,Box,Typography,Grid,Tabs,Tab} from '@material-ui/core';
const useStyles=makeStyles((theme)=>({
    appBar:{
        color:'primary',
        display:'flex',
        flexDirection:'row',
        position:'fixed',
        alignItems:'stretch',
        minHeight:50,
        marginTop:0,
    },
    adminButton:{
        "&:hover":{//da ne radi shadow kad se howera stavimo istu boju ko inače pozadina
            backgroundColor:'#FFFFFF'
        },
        borderRadius:10,
        margin:'auto',
        backgroundColor:'#FFFFFF'
    },
    logo:{
        height:'auto',
        width:'25%',
        maxWidth:50
    },
    logoBox:{
            display: 'inline-flex',//ovako ga iscrtavamo kao inline element pa zauzima onoliko koliko mu zauzimaju djeca dok kod display:flex zauzima koliko god može mjesta odnosno koliko je velik grid
            flexDirection:'row',
            marginLeft:0,
            alignItems:'center',
            justifyContent:'flex-start',
            backgroundColor:'#FFFFFF',
    },
    link:{
        color:'#FFFFFF'
    }
}));
export default function Navbar({history}) {//propsi od razlicitih providera prosljeđeni preko guest homepagea
    const classes=useStyles();
    const [selected,setSelected]=useState(0);//koja je inicijalno po defaultu sleektirana-> prva->označimo po indeksima dijelove navbara i na svaki klik reagiramo
    const handleChange = (event, newSelected) => {
        setSelected(newSelected);
      };
    return (
            <AppBar className={classes.appBar}>
                <Grid container direction='row' justify='space-between' alignItems='stretch'>
                    <Grid  item container xs={12}  md={2}>{/*grid od handstat labela*/}
                        <Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography variant='h6'style={{fontWeight:'bold'}} align='center' color='secondary'>HANDSTAT </Typography></Box>
                    </Grid>
                    <Grid item xs={12} md={8}>{/*grid od tabova*/}
                        <Tabs value={selected} onChange={handleChange}>
                           <Tab disableRipple label='POČETNA' component={Link} to='/'/>{/*Link ispod haube zapravo poziva history objekt*/}
                           <Tab disableRipple label='REZULTATI'/>
                           <Tab disableRipple label='IGRAČI'/>
                            <Tab disableRipple label='KLUBOVI'/>
                        </Tabs>
                    </Grid>
                    <Grid  item container direction='row' justify='center' alignItems='center' xs={12} md={1}>{/*grid od admin botuna*/}
                        <Box style={{ display:'flex', marginRight:0,  flexDirection:'row',justifyContent:'center',alignContent:'center' }}>
                            <Button onClick={()=>history.push('/login')}  className={classes.adminButton}><Typography  style={{fontWeight:'bold'}} color='secondary'>Admin</Typography></Button>
                            </Box>
                    </Grid>
               </Grid>
            </AppBar>
    )
}
/* <Toolbar>
                    <Grid container direction='row' justify='flex-start' alignItems="center" spacing={1}>
                    <Grid item xs={6} sm={3}><Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography variant='h6'style={{fontWeight:'bold',paddingTop:'4%'}} align='center' color='secondary'>HANDSTAT </Typography></Box></Grid>
                    <Grid item xs={3} sm={2}> <Box className={classes.pocetna}><Typography align='center' variant='h6'><Link onClick={handleNavbarClick(1,classes)}>Početna</Link></Typography> </Box></Grid>
                    <Grid item xs={3} sm={2}> <Box><Typography align='center' variant='h6'><Link onClick={handleNavbarClick(2)}>Rezultati</Link></Typography> </Box></Grid>
                    <Grid item xs={4} sm={2}>  <Box><Typography align='center' variant='h6'><Link onClick={handleNavbarClick(3)}>Igrači</Link></Typography> </Box></Grid>
                    <Grid item xs={4} sm={2}> <Box><Typography align='center' variant='h6'> <Link onClick={handleNavbarClick(4)}>Klubovi</LInk></Typography> </Box></Grid>
                    <Grid item xs={4} sm={1}> <Button  className={classes.adminButton}><Typography  variant='h6' style={{fontWeight:'bold'}} color='secondary'>Admin</Typography></Button></Grid>
                    </Grid>
                </Toolbar> */