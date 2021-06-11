import {React,useState,useEffect} from 'react'
import {Box,Typography,AppBar,Grid,GridList,Select,FormControl,MenuItem} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import logo from '../images/handstat_logo.png';
import Rezultat from '../components/Rezultat';
import Povijest from '../components/Povijest'
import GolPrikaz from '../components/Gol_igrac_golman_prikaz';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {Pie,Cell,PieChart,ResponsiveContainer,Legend} from 'recharts'
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
    },
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
    const [pieChartData,setPieChartData]=useState(null);//niz objekata tipa {name,value}-> nakon dobivenih podataka u onCompleted ćemo sumirat za sva 3 moguća odabira i pohranit u matricu(niz nizova) onda ovisno o odabiru slat u piechart određene nizove
    function handleOdabirSelect(event){
        setOdabir(event.target.value)
    }
    useEffect(()=>{//vidi je li igrac ili golmana i izvuci maticni broj i klub id kod mountanja
        setMaticniBroj(decodeURIComponent(match.params.maticni_broj).toString());
        setKlubID(parseInt(match.params.klub_id));
        if(match.path==='/igrac/:klub_id/:maticni_broj')
        {
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
    const [dohvatiIgraca,{data:igracData,loading:igracLoading,error:igracError}]=useLazyQuery(dohvatiIgracPrikaz,{
        onCompleted:(data)=>{
            const niz=[...data.igracinfo.golovi];
            let golovi_ukupno=0,pokusaji_ukupno=0,golovi_7m=0,pokusaji_7m=0,golovi_ostalo=0,pokusaji_ostalo=0;
            for(let pozicija of niz)
            {
                golovi_ukupno+=pozicija.golovibranka7m+pozicija.golovibrankaostali;
                pokusaji_ukupno+=pozicija.pokusajibranka7m+pozicija.pokusajibrankaostali;
                golovi_7m+=pozicija.golovibranka7m;
                pokusaji_7m+=pozicija.pokusajibranka7m;
                golovi_ostalo+=pozicija.golovibrankaostali;
                pokusaji_ostalo+=pozicija.pokusajibrankaostali;
            }
            //niz za svaki od 3 moguća odabira
            setPieChartData([
                [
                    {
                        name:"Golovi ukupno",
                        value:golovi_ukupno
                    },
                    {
                        name:"Promasaji ukupno",
                        value:(pokusaji_ukupno-golovi_ukupno)
                    }
                ],
                [
                    {
                        name:"Golovi 7m",
                        value:golovi_7m
                    },
                    {
                        name:"Promasaji 7m",
                        value:(pokusaji_7m-golovi_7m)
                    }
                ],
                [
                    {
                        name:"Golovi 6m i 9m",
                        value:golovi_ostalo
                    },
                    {
                        name:"Promasaji 6m i 9m",
                        value:(pokusaji_ostalo-golovi_ostalo)
                    }
                ]
            ]);
        }
    })

    const [dohvatiGolmana,{data:golmanData,loading:golmanLoading,error:golmanError}]=useLazyQuery(dohvatiGolmanPrikaz,{
        onCompleted:(data)=>{
            //stvaramo kopiju jer data objekt i state nisu iterable
            const niz=[...data.golmaninfo.obrane];
            let golovi_ukupno=0,pokusaji_ukupno=0,golovi_7m=0,pokusaji_7m=0,golovi_ostalo=0,pokusaji_ostalo=0;
            for(let pozicija of niz)
            {
                golovi_ukupno+=pozicija.golovibranka7m+pozicija.golovibrankaostali;
                pokusaji_ukupno+=pozicija.pokusajibranka7m+pozicija.pokusajibrankaostali;
                golovi_7m+=pozicija.golovibranka7m;
                pokusaji_7m+=pozicija.pokusajibranka7m;
                golovi_ostalo+=pozicija.golovibrankaostali;
                pokusaji_ostalo+=pozicija.pokusajibrankaostali;
            }
            //niz za svaki od 3 moguća odabira
            setPieChartData([
                [
                    {
                        name:"Obrane ukupno",
                        value:golovi_ukupno
                    },
                    {
                        name:"Primljeni ukupno",
                        value:(pokusaji_ukupno-golovi_ukupno)
                    }
                ],
                [
                    {
                        name:"Obrane 7m",
                        value:golovi_7m
                    },
                    {
                        name:"Primljeni 7m",
                        value:(pokusaji_7m-golovi_7m)
                    }
                ],
                [
                    {
                        name:"Obrane 6m i 9m",
                        value:golovi_ostalo
                    },
                    {
                        name:"Primljeni 6m i 9m",
                        value:(pokusaji_ostalo-golovi_ostalo)
                    }
                ]
            ]);
        }
    })

    if(igracLoading||golmanLoading||!maticniBroj||!klubID||!(klubID&&maticniBroj&&pieChartData&&(igracData||golmanData)))//dok se loada, dok se ne postave klubID i maticni_broj i dok nije zadovoljen uvjet za data
    {
        return (<CircularProgress className={classes.loadingItem} color='primary'/>)
    }
    if(igracError||golmanError)
    {
        return (<Alert className={classes.alertItem} severity="error">{(igracError)? igracError.message : golmanError.message}</Alert>)
    }
    if(klubID&&maticniBroj&&pieChartData&&(igracData||golmanData))//kada dodu podaci ovisno o tome je li golman ili igrac + klubid i maticni se postave
    {
        return (
            <div>
                 <AppBar className={classes.appBar}>
                    <Box className={classes.logoBox}><img className={classes.logo} src={logo} alt='HandStat Logo'/> <Typography style={{fontWeight:'bold'}} align='center' color='secondary'>HANDSTAT </Typography></Box>
                </AppBar>
                <Grid container direction='column' justify='space-evenly' alignItems='center' style={{marginTop:70}}>{/*/glavni grid*/}
                    <Grid item container direction='row' justify='center' alignItems='center' style={{marginTop:20}} xs={12}>{/*container od podataka i slike*/}
                            <Grid item container direction='column' justify='center' alignItems='center'  xs={12} sm={5}>
                                <Typography style={{fontWeight:'bold'}} align='center' color='secondary' variant='h4'>{(isIgrac)? (igracData.igracinfo.info.ime+' '+igracData.igracinfo.info.prezime) : (golmanData.golmaninfo.info.ime+' '+golmanData.golmaninfo.info.prezime)}</Typography>
                                <img src={"http://localhost:3001/zagreb.jpg"} alt="slika člana" className={classes.clanSlika}/>
                            </Grid>
                            <Grid className={classes.infoGlavniBox} item container direction='column' justify='space-evenly' alignItems='flex-start' xs={12} sm={4}>{/*container od informacija igraca*/}
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>IME</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>{(isIgrac)? igracData.igracinfo.info.ime : golmanData.golmaninfo.info.ime}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>PREZIME</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>{(isIgrac)? igracData.igracinfo.info.prezime : golmanData.golmaninfo.info.prezime}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>NACIONALNOST</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>{(isIgrac)? igracData.igracinfo.info.nacionalnost : golmanData.golmaninfo.info.nacionalnost}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>DATUM ROĐENJA</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>{(isIgrac)? igracData.igracinfo.info.datum_rodenja : golmanData.golmaninfo.info.datum_rodenja}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>VISINA</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography  style={{color:'#FFFFFF'}} variant='h5'>{(isIgrac)? igracData.igracinfo.info.visina : golmanData.golmaninfo.info.visina} cm</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>TEŽINA</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>{(isIgrac)? igracData.igracinfo.info.tezina : golmanData.golmaninfo.info.tezina} kg</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>BROJ DRESA</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>{(isIgrac)? igracData.igracinfo.info.broj_dresa : golmanData.golmaninfo.info.broj_dresa}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
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
                        <Grid item  xs={12} sm={6} md={4}>
                            <ResponsiveContainer width='100%' aspect={1.5748}>{/*stavimo kao kod slike*/}
                                <PieChart width='100%' height='100%' >
                                    <Pie data={pieChartData[odabir.id-1]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} endAngle={0} startAngle={360} label>
                                    {
                                        pieChartData[odabir.id-1].map((data,index)=>(
                                            <Cell key={data.name} fill={(index===0)? '#008000': '#FF0000'}/>
                                        ))
                                    }
                                </Pie>
                                {
                                    ((pieChartData[odabir.id-1][0].value+pieChartData[odabir.id-1][0].value)!==0)?//ako su obe vrijednosti 0 onda neće bit prikazan chart pa nema smisla da bude prikazana legenda
                                    <Legend verticalAlign="bottom" />/*By default, the content of the legend is generated by the name of Line, Bar, Area, etc. Alternatively, if no name has been set, the dataKey will be used to generate legend content.*/
                                    :
                                    null
                                }
                                </PieChart>
                            </ResponsiveContainer>
                        </Grid>
                        <Grid item container  justify='center' direction='row' xs={12} sm={5} md={4} style={{position:'relative'}}>
                            <GolPrikaz goloviobrane={(isIgrac)? igracData.igracinfo.golovi : golmanData.golmaninfo.obrane} odabir={odabir.id}/>
                        </Grid>
                    </Grid>
                    <Grid item container direction='column' justify='center' alignItems='center' xs={12}>{/*container od utakmica*/}
                        <Box className={classes.boxLabels}>
                            <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>UTAKMICE</Typography>
                        </Box>
                        <GridList style={{width:'100%',marginTop:10,marginBottom:10, height:300}} cols={1} cellHeight={'auto'} spacing={20}>
                                    {
                                        (isIgrac)?
                                            igracData.igracinfo.utakmice&&igracData.igracinfo.utakmice.map((rezultat)=>(
                                                <Grid key={rezultat.utakmica.broj_utakmice} item sm={8} xs={12} style={{margin:'auto'}}>
                                                    <Rezultat history={history} broj_utakmice={rezultat.utakmica.broj_utakmice} domaci={rezultat.utakmica.domaci.naziv} gosti={rezultat.utakmica.gosti.naziv} natjecanje={rezultat.utakmica.natjecanje.naziv} golovi_domaci={rezultat.utakmica.rezultat_domaci} golovi_gosti={rezultat.utakmica.rezultat_gosti} golovi_obrane={rezultat.goloviobrane_ukupno} status={6} />
                                                </Grid>)
                                            )
                                        :
                                        golmanData.golmaninfo.utakmice&&golmanData.golmaninfo.utakmice.map((rezultat)=>(
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
                        <GridList style={{width:'100%',marginTop:10,marginBottom:10, height:300,}} cols={1} cellHeight={'auto'} spacing={20}>
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
