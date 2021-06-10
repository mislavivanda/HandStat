import React, {useState,useEffect} from 'react'
import {makeStyles,useTheme} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import logo from '../images/handstat_logo.png';
import {AppBar,Button,Box,Typography,Grid,Tabs,Tab} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
export default function Navbar({history,match}) {//propsi od razlicitih providera prosljeđeni preko guest homepagea
    const classes=useStyles();
    const theme=useTheme();
    const media=useMediaQuery('(max-width:420px)');// including the screen size given by the breakpoint key.
    const [selected,setSelected]=useState(0);//koja je inicijalno po defaultu sleektirana-> prva->označimo po indeksima dijelove navbara i na svaki klik reagiramo//kod mountanja provjerit na kojoj smo trenutnoj stranici-> NIJE UVIJEK DEFAULT STATE NA 0 JER ako refreshamo dok smo na stranici /rezultati onda će krivi tab biti označen ko aktivan
    useEffect(()=>{
        if(match.path==='/')
        {
          setSelected(0);
        }
        else if(match.path==='/rezultati')
        {
           setSelected(1);
        }
        else if(match.path==='/klubovi'||match.path==='/klub/:klub_id')
        {
           setSelected(2);
        }
        else {
          setSelected(3);
        }
    },[])
    function handleChange(event, newSelected){
        setSelected(newSelected);
      };
    return (
            <AppBar className={classes.appBar}>
                <Grid container direction='row' justify='space-between' alignItems='stretch'>
                    <Grid  item container xs={12}  md={2}>{/*grid od handstat labela*/}
                        <Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography variant='h6'style={{fontWeight:'bold'}} align='center' color='secondary'>HANDSTAT </Typography></Box>
                    </Grid>
                    <Grid item xs={12} md={8}>{/*grid od tabova*/}
                        <Tabs 
                        value={selected} 
                        centered={(!media)? true : false}//cenriramo na sirinama iznad 420px a ispod koristimo strelice za skroliranje jer ne smimo istvremeno koristit centered i scrollable props
                        onChange={handleChange}
                        variant={(media)? "scrollable" : "standard"}
                        scrollButtons={(media)? 'on' : 'off'}
                        >
                           <Tab disableRipple label='POČETNA' component={Link} to='/'/>{/*Link ispod haube zapravo poziva history objekt*/}
                           <Tab disableRipple label='REZULTATI' component={Link} to='/rezultati'/>
                           <Tab disableRipple label='KLUBOVI I IGRAČI' component={Link} to='/klubovi'/>
                           <Tab disableRipple label='TABLICE' component={Link} to='/tablice'/>
                        </Tabs>
                    </Grid>
                    <Grid  item container direction='row' justify='center' alignItems='center' xs={12} md={2}>{/*grid od admin botuna*/}
                        <Box style={{ display:'flex', marginRight:0,  flexDirection:'row',justifyContent:'center',alignContent:'center' }}>
                            <Button onClick={()=>history.push('/login')}  className={classes.adminButton}><Typography  style={{fontWeight:'bold'}} color='secondary'>Vodi utakmicu!</Typography></Button>
                            </Box>
                    </Grid>
               </Grid>
            </AppBar>
    )
}