import { makeStyles} from '@material-ui/core/styles'
import React,{Fragment,useEffect} from 'react'
import {Box,Typography,Grid} from '@material-ui/core';
import StatistikaBox from '../components/Table_stats_box.jsx';
import {promjenaStatistikeIgrac,promjenaStatistikeGolman,promjenaStatistikeStozer} from '../graphql/subscription';
import { useQuery } from '@apollo/client';//hook za poziv querya
import {dohvatiStatistikuTima} from '../graphql/query';
import Alert from '@material-ui/lab/Alert';
const useStyles=makeStyles((theme)=>({
    statistikaGlavniBox:{
        borderBottomColor:theme.palette.secondary.main,
        borderBottomStyle:'solid',
        borderLeftColor:theme.palette.secondary.main,
        borderLeftStyle:'solid',
        borderRightColor:theme.palette.secondary.main,
        borderRightStyle:'solid',
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
function TimStatistika({tim_id,broj_utakmice,klub_slika,naziv,live}) {//parametri potrebni za dohvat stati
    const classes=useStyles();
    function odrediTitulu(rola)
    {
        if(rola===3)
        {
            return "Trener";
        }
        else if(rola===4)
        {
            return "Službeni predstavnik";
        }
        else if(rola===5)
        {
            return "Tehniko"
        }
        else return "Fiziotarapeut";
    }
    const {data,loading,error,subscribeToMore,refetch}=useQuery(dohvatiStatistikuTima,{
        variables:{
            broj_utakmice:broj_utakmice,
            klub_id:tim_id
        }
    });

    const subscribePromjenaStatistikeIgraca=()=>subscribeToMore({
        document:promjenaStatistikeIgrac,
        variables:{
            broj_utakmice:broj_utakmice,
            klub_id:tim_id
        },
        updateQuery:(prev,{subscriptionData})=>{
            if(!subscriptionData.data) return prev;
            let noviNiz=[];
            noviNiz=prev.timstatistika.igraci.map((statistika)=>{
                if(statistika.igrac.maticni_broj===subscriptionData.data.statistikaigrac.igrac.maticni_broj)
                {
                    return {
                        ...statistika,
                        golovi:subscriptionData.data.statistikaigrac.golovi,
                        pokusaji:subscriptionData.data.statistikaigrac.pokusaji,
                        sedmerac_golovi:subscriptionData.data.statistikaigrac.sedmerac_golovi,
                        sedmerac_pokusaji:subscriptionData.data.statistikaigrac.sedmerac_pokusaji,
                        iskljucenja:subscriptionData.data.statistikaigrac.iskljucenja,
                        zuti:subscriptionData.data.statistikaigrac.zuti,
                        crveni:subscriptionData.data.statistikaigrac.crveni,
                        plavi:subscriptionData.data.statistikaigrac.plavi,
                        tehnicke:subscriptionData.data.statistikaigrac.tehnicke,
                        asistencije:subscriptionData.data.statistikaigrac.asistencije
                    }
                }
                else return statistika;
            });
            return {
                timstatistika:{
                    ...prev.timstatistika,
                    igraci:noviNiz//azurirani niz igraca, ostalo ostavit isto
                }
            }
        }
    });

    const subscribePromjenaStatistikeGolmana=()=>subscribeToMore({
        document:promjenaStatistikeGolman,
        variables:{
            broj_utakmice:broj_utakmice,
            klub_id:tim_id
        },
        updateQuery:(prev,{subscriptionData})=>{
            if(!subscriptionData.data) return prev;
            let noviNiz=[];
            noviNiz=prev.timstatistika.golmani.map((statistika)=>{
                if(statistika.golman.maticni_broj===subscriptionData.data.statistikagolman.golman.maticni_broj)
                {
                    return {
                        ...statistika,
                        obrane_ukupno:subscriptionData.data.statistikagolman.obrane_ukupno,
                        primljeni_ukupno:subscriptionData.data.statistikagolman.primljeni_ukupno,
                        sedmerac_obrane:subscriptionData.data.statistikagolman.sedmerac_obrane,
                        sedmerac_primljeni:subscriptionData.data.statistikagolman.sedmerac_primljeni,
                        iskljucenja:subscriptionData.data.statistikagolman.iskljucenja,
                        zuti:subscriptionData.data.statistikagolman.zuti,
                        crveni:subscriptionData.data.statistikagolman.crveni,
                        plavi:subscriptionData.data.statistikagolman.plavi,
                        golovi:subscriptionData.data.statistikagolman.golovi,
                        pokusaji:subscriptionData.data.statistikagolman.pokusaji
                    }
                }
                else return statistika;
            });
            return {
                timstatistika:{
                    ...prev.timstatistika,
                    golmani:noviNiz//azurirani niz igraca, ostalo ostavit isto
                }
            }
        }
    })

    const subscribePromjenaStatistikeStozera=()=>subscribeToMore({
        document:promjenaStatistikeStozer,
        variables:{
            broj_utakmice:broj_utakmice,
            klub_id:tim_id
        },
        updateQuery:(prev,{subscriptionData})=>{
            if(!subscriptionData.data) return prev;
            let noviNiz=[];
            noviNiz=prev.timstatistika.stozer.map((statistika)=>{
                if(statistika.clan.maticni_broj===subscriptionData.data.statistikastozer.clan.maticni_broj)
                {
                    return {
                        ...statistika,
                        zuti:subscriptionData.data.statistikastozer.zuti,
                        crveni:subscriptionData.data.statistikastozer.crveni,
                        plavi:subscriptionData.data.statistikastozer.plavi
                    }
                }
                else return statistika;
            });
            return {
                timstatistika:{
                    ...prev.timstatistika,
                    stozer:noviNiz//azurirani niz igraca, ostalo ostavit isto
                }
            }
        }
    })
    useEffect(()=>{
        if(live)
        {
            refetch();
            subscribePromjenaStatistikeIgraca();
            subscribePromjenaStatistikeGolmana();
            subscribePromjenaStatistikeStozera();
        }
    },[])
    if(loading) return null

    if(error) return (<Alert severity="error">{error.message}</Alert>);

    if(data)
    {
    return (
      <Fragment>
                <Grid item  className={classes.statistikaGlavniBox}  container direction='column' justify='space-evenly' alignItems='center' xs={12}>{/*container tablice statistike igraca*/}
                        <Box className={classes.statistikaBoxKlub}>
                            <img src={klub_slika} alt='ikona_kluba' className={classes.klubSlika}/>
                            <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>{naziv}</Typography>
                        </Box>
                        <Box className={classes.statistikaBoxTitula}><Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>IGRAČI</Typography></Box>
                        <Box className={classes.statistikaBoxStupciBox}>{/*maknemo tekst za 5% sirine-> kakda ga maknemo za 5% udesno tada će se za centiranje elementa paddgin racunat od ostatka odnosno sve-5% a to će bit isto centriranje ko kod polja ispod-> pomak udesno koliko zauzima dres a to je 12.5% unutarnjeg containera */ }
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'40%'}}><Typography align='center'  style={{color:'#FFFFFF',marginLeft:'12.5%'}}>IGRAČ</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'14%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>GOL</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'14%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>7M</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center' style={{color:'#FFFFFF'}}>2M</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center' style={{color:'#FFFFFF'}}>Ž</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center' style={{color:'#FFFFFF'}}>C</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center' style={{color:'#FFFFFF'}}>P</Typography></Box>
                        </Box>
                        {data.timstatistika.igraci&&data.timstatistika.igraci.map((igracstat)=><StatistikaBox key={igracstat.igrac.maticni_broj} broj_utakmice={broj_utakmice} maticni_broj={igracstat.igrac.maticni_broj} dres={igracstat.igrac.broj_dresa} ime={igracstat.igrac.ime} prezime={igracstat.igrac.prezime} golovi={igracstat.golovi} pokusaji={igracstat.pokusaji} iskljucenja={igracstat.iskljucenja} zuti={igracstat.zuti} crveni={igracstat.crveni} plavi={igracstat.plavi} sedmerac_golovi={igracstat.sedmerac_golovi} sedmerac_pokusaji={igracstat.sedmerac_pokusaji} tip={1} />)}
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
                        {data.timstatistika.golmani&&data.timstatistika.golmani.map((golmanstat)=><StatistikaBox key={golmanstat.golman.maticni_broj} broj_utakmice={broj_utakmice} maticni_broj={golmanstat.golman.maticni_broj} dres={golmanstat.golman.broj_dresa} ime={golmanstat.golman.ime} prezime={golmanstat.golman.prezime} golovi={golmanstat.golovi} pokusaji={golmanstat.pokusaji} iskljucenja={golmanstat.iskljucenja} zuti={golmanstat.zuti} crveni={golmanstat.crveni} plavi={golmanstat.plavi} obrane={golmanstat.obrane_ukupno} primljeni={golmanstat.primljeni_ukupno} tip={2}/>)}
                        <Box className={classes.statistikaBoxTitula}><Typography variant='h5' align='center' style={{color:'#FFFFFF'}}>STRUČNI STOŽER</Typography></Box>
                        <Box className={classes.statistikaBoxStupciBox}>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'40%'}}><Typography align='center' style={{color:'#FFFFFF'}}>IME I PREZIME</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'36%'}}><Typography align='center' style={{color:'#FFFFFF'}}> TITULA</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center' style={{color:'#FFFFFF'}}>Ž</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center' style={{color:'#FFFFFF'}}>C</Typography></Box>
                            <Box className={classes.statistikaBoxStupciZnacenje} style={{width:'8%'}}><Typography align='center'  style={{color:'#FFFFFF'}}>P</Typography></Box>
                        </Box>
                        {data.timstatistika.stozer&&data.timstatistika.stozer.map((clanstat)=><StatistikaBox key={clanstat.clan.maticni_broj} ime={clanstat.clan.ime} prezime={clanstat.clan.prezime} zuti={clanstat.zuti} crveni={clanstat.crveni} plavi={clanstat.plavi} titula={odrediTitulu(clanstat.clan.rola)} tip={3} />)}
                    </Grid>
      </Fragment>
    )
    }
}

export default TimStatistika
