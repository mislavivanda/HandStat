import { makeStyles } from '@material-ui/core/styles'
import React,{Fragment,useState} from 'react'
import {Box,Typography,Grid} from '@material-ui/core';
import { useSelector} from 'react-redux';
import StatistikaBox from '../components/Table_stats_box.jsx';
const useStyles=makeStyles((theme)=>({
    statistikaGlavniBox:{
        borderColor:theme.palette.secondary.main,
        borderStyle:'solid',
        marginTop:50
    },
    klubSlika:{
      height:70,
      width:93
    },
    statistikaBoxKlub:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        backgroundColor:theme.palette.secondary.main,
        height:70,
        borderBottomColor:'#FFFFFF',
        borderBottomStyle:'solid',
        borderBottomWidth:4
    },
    statistikaBoxStupciBox:{
          display:'flex',
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'flex-start',
          width:'100%',
          backgroundColor:theme.palette.primary.main,
          height:60,
          borderBottomColor:'#FFFFFF',
          borderBottomStyle:'solid'
    },
    statistikaBoxStupciZnacenje:{
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center'
    },
    statistikaBoxTitula:{
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      width:'100%',
      backgroundColor:theme.palette.secondary.main,
      height:60
    }
}));
function TimStatistika({tim_id,timStatistika,domaci}) {//da zna za koji tim mora dohvatit podatke kad spojimo s backendom,zasad mu saljemo gotove
    const classes=useStyles();
    const [tim,setTim]=useState(timStatistika);
    const timovi=useSelector(state=>state.timovi);
    return (
      <Fragment>
                <Grid item  className={classes.statistikaGlavniBox}  container direction='column' justify='space-evenly' alignItems='center' xs={12}>{/*container tablice statistike igraca*/}
                        <Box className={classes.statistikaBoxKlub}>
                            <img src={(tim_id===timovi.timDomaci.id)? timovi.timDomaci.grb : timovi.timGosti.grb} alt='ikona_kluba' className={classes.klubSlika}/>
                            <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>{(tim_id===timovi.timDomaci.id)? timovi.timDomaci.naziv : timovi.timGosti.naziv}</Typography>
                        </Box>
                        <Box className={classes.statistikaBoxTitula}><Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>IGRAČI</Typography></Box>
                        <Box className={classes.statistikaBoxStupciBox}>{/*mkanemo tekts za 5% sirine-> kakda ga maknemo za 5% udesno tada će se za centiranje elementa paddgin racunat od ostatka odnosno sve-5% a to će bit isto centriranje ko kod polja ispod-> pomak udesno koliko zauzima dres a to je 12.5% unutarnjeg containera */ }
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'40%'}}><Typography align='center'  style={{color:'#FFFFFF',marginLeft:'12.5%'}}>IGRAČ</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'12%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>GOL</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'12%'}}><Typography align='center' style={{color:'#FFFFFF'}}>2M</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'12%'}}><Typography align='center' style={{color:'#FFFFFF'}}>Ž</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'12%'}}><Typography align='center' style={{color:'#FFFFFF'}}>C</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'12%'}}><Typography align='center' style={{color:'#FFFFFF'}}>P</Typography></Box>
                        </Box>
                        {tim&&tim.Igraci.map((igrac)=><StatistikaBox key={igrac.maticni_broj} dres={igrac.broj_dresa} ime={igrac.ime} prezime={igrac.prezime} golovi={igrac.golovi} iskljucenja={igrac.iskljucenja} zuti={igrac.zuti} crveni={igrac.crveni} plavi={igrac.plavi} tip={1} />)}
                        <Box className={classes.statistikaBoxTitula}><Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>GOLMANI</Typography></Box>
                        <Box className={classes.statistikaBoxStupciBox}>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'40%'}}><Typography align='center'  style={{color:'#FFFFFF',marginLeft:'12.5%'}}>GOLMAN</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'14%'}}><Typography align='center' style={{color:'#FFFFFF'}}>OBR</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'14%'}}><Typography align='center'style={{color:'#FFFFFF'}}>GOL</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center' style={{color:'#FFFFFF'}}>2M</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>Ž</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center' style={{color:'#FFFFFF'}}>C</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center'style={{color:'#FFFFFF'}}>P</Typography></Box>
                        </Box >
                        {tim&&tim.Golmani.map((golman)=><StatistikaBox key={golman.maticni_broj} dres={golman.broj_dresa} ime={golman.ime} prezime={golman.prezime} golovi={golman.golovi} iskljucenja={golman.iskljucenja} zuti={golman.zuti} crveni={golman.crveni} plavi={golman.plavi} obrane={golman.obrane} tip={2}/>)}
                        <Box className={classes.statistikaBoxTitula}><Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>STRUČNI STOŽER</Typography></Box>
                        <Box className={classes.statistikaBoxStupciBox}>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'40%'}}><Typography align='center' style={{color:'#FFFFFF'}}>IME I PREZIME</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'36%'}}><Typography align='center' style={{color:'#FFFFFF'}}> TITULA</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center' style={{color:'#FFFFFF'}}>Ž</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center' style={{color:'#FFFFFF'}}>C</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>P</Typography></Box>
                        </Box>
                        {tim&&tim.Stozer.map((clan)=><StatistikaBox key={clan.maticni_broj} ime={clan.ime} prezime={clan.prezime} zuti={clan.zuti} crveni={clan.crveni} plavi={clan.plavi} titula={clan.titula} tip={3} />)}
                    </Grid>
      </Fragment>
    )
}

export default TimStatistika
