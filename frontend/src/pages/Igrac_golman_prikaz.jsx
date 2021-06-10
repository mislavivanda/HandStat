import {React,useState,useEffect} from 'react'
import {Box,Typography,AppBar,Grid,GridList,Select,FormControl,MenuItem} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import logo from '../images/handstat_logo.png';
import Rezultat from '../components/Rezultat';
import Povijest from '../components/Povijest'
import GolPrikaz from '../components/Gol_igrac_golman_prikaz';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {Pie,Cell,PieChart,ResponsiveContainer} from 'recharts'
import {dohvatiIgracPrikaz,dohvatiGolmanPrikaz} from '../graphql/query';
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
    }
}))
function Igrac_golman_prikaz({history,match}) {//preko history objekta u URL odlucit jel igrac ili golman-> url ce bit golman/maticni ili igrac/maticni
    const classes=useStyles();
    const [sviMoguciOdabiri,setSviMoguciOdabiri]=useState([//mozemo birat prikaz svih, 7m i ostalih(6m,9m)
        {
            id:1,
            naziv:"Svi"
        },
        {
            id:2,
            naziv:"7m"
        },
        {
            id:3,
            naziv:"6m i 9m"
        }
    ])
    const [odabir,setOdabir]=useState(sviMoguciOdabiri[0]);
    const [isIgrac,setIsIgrac]=useState(null);
    const [maticniBroj,setMaticniBroj]=useState(null);
    const [klubID,setKlubID]=useState(null);
    const [pieChartData,setPieChartData]=useState([{
        name:"Mock",
        value:10
    },
    {
        name:"Mock2",
        value:5
    }]);//niz objekata tipa {name,value}
    function handleOdabirSelect(event){
        setOdabir(event.target.value)
    }
    useEffect(()=>{//vidi je li igrac ili golmana i izvuci maticni broj i klub id kod mountanja
        setMaticniBroj(decodeURIComponent(match.params.maticni_broj).toString());
        setKlubID(parseInt(match.params.klub_id));
        if(match.path==='/igrac/:klub_id/:maticni_broj')
        {
            console.log('Igracc');
            dohvatiIgraca({
                variables:{
                    maticni_broj:decodeURIComponent(match.params.maticni_broj).toString(),
                    klub_id:parseInt(match.params.klub_id)
                }
            })
            setIsIgrac(true);
        }
        else
        {
            dohvatiGolmana({
                variables:{
                    maticni_broj:decodeURIComponent(match.params.maticni_broj).toString(),
                    klub_id:parseInt(match.params.klub_id)
                }
            })
            setIsIgrac(false);
        }
    },[])
    const [dohvatiIgraca,{data:igracData,loading:igracLoading,error:igracError}]=useLazyQuery(dohvatiIgracPrikaz)

    const [dohvatiGolmana,{data:golmanData,loading:golmanLoading,error:golmanError}]=useLazyQuery(dohvatiGolmanPrikaz)

    if(igracLoading||golmanLoading||!maticniBroj||!klubID||!(klubID&&maticniBroj&&(igracData||golmanData)))//dok se loada, dok se ne postave klubID i maticni_broj i dok nije zadovoljen uvjet za data
    {
        return (<CircularProgress className={classes.loadingItem} color='primary'/>)
    }
    if(igracError||golmanError)
    {
        return (<Alert className={classes.alertItem} severity="error">{(igracError)? igracError.message : golmanError.message}</Alert>)
    }
    if(klubID&&maticniBroj&&(igracData||golmanData))//kada dodu podaci ovisno o tome je li golman ili igrac + klubid i maticni se postave
    {
        console.log(igracData.igracinfo.info.ime);
        return (
            <div>
                 <AppBar className={classes.appBar}>
                    <Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography style={{fontWeight:'bold'}} align='center' color='secondary'>HANDSTAT </Typography></Box>
                </AppBar>
                <Grid container direction='column' justify='space-evenly' alignItems='center'>{/*/glavni grid*/}
                    <Grid item container direction='row' justify='center' alignItems='center' xs={12}>{/*container od podataka i slike*/}
                        <Grid item container direction='column' justify='space-evenly' alignItems='center' spacing={3} xs={12} sm={3}>
                            <Grid item xs={12}>
                                <Typography align='center' color='secondary' variant='h5'>{(isIgrac)? igracData.igracinfo.info.ime : golmanData.golmaninfo.info.ime}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align='center' color='secondary' variant='h5'>{(isIgrac)? igracData.igracinfo.info.prezime : golmanData.golmaninfo.info.prezime}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align='center' color='secondary' variant='h5'>{(isIgrac)? igracData.igracinfo.info.nacionalnost : golmanData.golmaninfo.info.nacionalnost}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align='center' color='secondary' variant='h5'>{(isIgrac)? igracData.igracinfo.info.datum_rodenja : golmanData.golmaninfo.info.datum_rodenja}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align='center' color='secondary' variant='h5'>{(isIgrac)? igracData.igracinfo.info.visina : golmanData.golmaninfo.info.visina} cm</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align='center' color='secondary' variant='h5'>{(isIgrac)? igracData.igracinfo.info.tezina : golmanData.golmaninfo.info.tezina} kg</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography align='center' color='secondary' variant='h5'>{(isIgrac)? igracData.igracinfo.info.broj_dresa : golmanData.golmaninfo.info.broj_dresa}</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <img src={"http://localhost:3001/zagreb.jpg"} alt="slika člana" className={classes.clanSlika}/>
                        </Grid>
                    </Grid>
                    <Grid item container direction='row' justify='center' alignItems='center' style={{marginTop:20}} xs={12} sm={6}>{/*select komponeneta za odabir koje golove/obrane prikazati*/}
                        <Grid item xs={12}>
                            <Typography color='secondary' align='center' variant='h4'>{(isIgrac)? 'Golovi' : 'Obrane'}</Typography>
                        </Grid>
                        <FormControl style={{width:'100%'}}>
                            <Select 
                            value={odabir}  
                            onChange={(e)=>handleOdabirSelect(e)} 
                            renderValue={(selected)=> <Typography color='secondary' align='center'>{selected.naziv}</Typography>} >
                            {
                            sviMoguciOdabiri.map((odabir)=><MenuItem key={odabir.id} value={odabir}><Typography color='secondary'>{odabir.naziv}</Typography></MenuItem>)
                            }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item container direction='row' justify='space-evenly' alignItems='center' style={{marginTop:20,marginBottom:20}} xs={12}>{/*container od grafa i slike gola */}
                        <Grid item xs={12} sm={5}>
                            <ResponsiveContainer width='100%' height={200}>
                                <PieChart >
                                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} endAngle={0} startAngle={360}>
                                    {
                                        pieChartData.map((data,index)=>(
                                            <Cell key={data.name} fill={(index===0)? '#008000': '#FF0000'}/>
                                        ))
                                    }
                                </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </Grid>
                        <Grid item container  justify='center' direction='row' xs={12} sm={7} md={3} style={{position:'relative'}}>
                            <GolPrikaz/>
                        </Grid>
                    </Grid>
                    <Grid item container direction='column' justify='center' alignItems='center' xs={12}>{/*container od utakmica*/}
                        <Box className={classes.boxLabels}>
                            <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>UTAKMICE</Typography>
                        </Box>
                        <GridList style={{width:'100%',marginTop:10,marginBottom:10}} cols={1} cellHeight={'auto'} spacing={20}>
                                    {
                                        (isIgrac)?
                                            igracData.igracinfo&&igracData.igracinfo.utakmice.map((rezultat)=>(
                                                <Grid key={rezultat.utakmica.broj_utakmice} item sm={8} xs={12} style={{margin:'auto'}}>
                                                    <Rezultat history={history} broj_utakmice={rezultat.utakmica.broj_utakmice} domaci={rezultat.utakmica.domaci.naziv} gosti={rezultat.utakmica.gosti.naziv} natjecanje={rezultat.utakmica.natjecanje.naziv} golovi_domaci={rezultat.utakmica.rezultat_domaci} golovi_gosti={rezultat.utakmica.rezultat_gosti} golovi_obrane={rezultat.goloviobrane_ukupno} status={6} />
                                                </Grid>)
                                            )
                                        :
                                        golmanData.golmaninfo&&golmanData.golmaninfo.utakmice.map((rezultat)=>(
                                            <Grid key={rezultat.utakmica.broj_utakmice} item sm={8} xs={12} style={{margin:'auto'}}>
                                                <Rezultat history={history} broj_utakmice={rezultat.utakmica.broj_utakmice} domaci={rezultat.utakmica.domaci.naziv} gosti={rezultat.utakmica.gosti.naziv} natjecanje={rezultat.utakmica.natjecanje.naziv}  golovi_domaci={rezultat.utakmica.rezultat_domaci} golovi_gosti={rezultat.utakmica.rezultat_gosti} golovi_obrane={rezultat.goloviobrane_ukupno} status={6} />
                                            </Grid>)
                                        )
                                    }
                        </GridList>
                    </Grid>
                    <Grid item container direction='column' justify='center' alignItems='center' xs={12}>{/*container od povijesti */}
                        <Box className={classes.boxLabels}>
                            <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>POVIJEST</Typography>
                        </Box>
                        <GridList style={{width:'100%',marginTop:10,marginBottom:10}} cols={1} cellHeight={'auto'} spacing={20}>
                                    {
                                        (isIgrac)?
                                        igracData.igracinfo.povijest&&igracData.igracinfo.povijest.map((povijest)=>(//nije 100% siguran key ali je vrlo vjerovatan jer je teško da će igrat isto natjecanje za isiti klub s isitm brojem golova/obrana više puta
                                             <Grid key={(povijest.natjecanje+povijest.klub+povijest.goloviobrane_ukupno).toString()} item sm={8} xs={12} style={{margin:'auto'}}>
                                                <Povijest natjecanje={povijest.natjecanje} klub={povijest.klub} golovi_obrane={povijest.goloviobrane_ukupno}/>
                                            </Grid>)
                                        )
                                        :
                                        golmanData.golmaninfo.povijest&&golmanData.golmaninfo.povijest.map((povijest)=>(
                                            <Grid key={(povijest.natjecanje+povijest.klub+povijest.goloviobrane_ukupno).toString()} item sm={8} xs={12} style={{margin:'auto'}}>
                                               <Povijest natjecanje={povijest.natjecanje} klub={povijest.klub} golovi_obrane={povijest.goloviobrane_ukupno}/>
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

export default Igrac_golman_prikaz
