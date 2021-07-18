import React,{useState,useEffect} from 'react'
import {Dialog,DialogContent,DialogTitle,Typography,Select,FormControl,Grid,MenuItem,IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import GolPrikaz from '../components/Gol_igrac_golman_prikaz';
import PieChart from '../components/PieChartStatistika';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import {dohvatiIgracStatistikaPopup,dohvatiGolmanStatistikaPopup} from '../graphql/query';
import { useLazyQuery } from '@apollo/client';
const useStyles=makeStyles((theme)=>({
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
    dialogPaper:{
        textAlign: 'center',
        borderRadius:"10px",
        height:'100vh'
    },
    dialogTitle:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    }
}));
function StatistikaDialog({open,setOpen,isIgrac,maticni_broj,broj_utakmice}) {
    const classes=useStyles();
    const [isOpen,setIsOpen]=useState(open);//po defaultu otvoren kad se mounta jer ce mountat kad se pozove u conditional renderu nakon klika na igraca
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
    const [pieChartData,setPieChartData]=useState(null);//niz objekata tipa {name,value}-> nakon dobivenih podataka u onCompleted ćemo sumirat za sva 3 moguća odabira i pohranit u matricu(niz nizova) onda ovisno o odabiru slat u piechart određene nizove
    useEffect(()=>{
        if(isIgrac)
        {
            dohvatiStatistikuIgrac({
                variables:{
                    maticni_broj:maticni_broj,
                    broj_utakmice:broj_utakmice
                }
            })
        }
        else
        {
            dohvatiStatistikuGolman({
                variables:{
                    maticni_broj:maticni_broj,
                    broj_utakmice:broj_utakmice
                }
            })
        }
    },[])

    const [dohvatiStatistikuIgrac,{data:igracData,loading:igracLoading,error:igracError}]=useLazyQuery(dohvatiIgracStatistikaPopup,{
        fetchPolicy: "network-only",//APOLLO BUG ZASAD JE ŠTO U SLUČAJU DA UZIMA IZ CACHEA PODATKE NEĆE POZVAT ONCOMPLETED PA SE TAKO NEĆE NI POSTAVIT PIE CHART DATA, ZATO KORISTIMO NETWORK ONLY DA UVIK POZOVE ONCOMPLETED
        onCompleted:(data)=>{
            console.log('Completed');
            const niz=[...data.igracstatistikapopup.statistikapopup];//nisu iterable cisti podaci iz querya
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
            console.log('Settan igrac pie chart data');
        }
    });
    const [dohvatiStatistikuGolman,{data:golmanData,loading:golmanLoading,error:golmanError}]=useLazyQuery(dohvatiGolmanStatistikaPopup,{
        fetchPolicy: "network-only",
        onCompleted:(data)=>{
            //stvaramo kopiju jer data objekt i state nisu iterable
            const niz=[...data.golmanstatistikapopup.statistikapopup];
            let obrane_ostalo=0,obrane_7m=0,primljeni_7m=0,primljeni_ostalo=0;
            for(let pozicija of niz)
            {
                obrane_ostalo+=pozicija.obranebrankaostali;
                obrane_7m+=pozicija.obranebranka7m;
                primljeni_7m+=pozicija.primljenibranka7m;
                primljeni_ostalo+=pozicija.primljenibrankaostali
            }
            //niz za svaki od 3 moguća odabira
            setPieChartData([
                [
                    {
                        name:"Obrane ukupno",
                        value:(obrane_ostalo+obrane_7m)
                    },
                    {
                        name:"Primljeni ukupno",
                        value:(primljeni_ostalo+primljeni_7m)
                    }
                ],
                [
                    {
                        name:"Obrane 7m",
                        value:obrane_7m
                    },
                    {
                        name:"Primljeni 7m",
                        value:primljeni_7m
                    }
                ],
                [
                    {
                        name:"Obrane 6m i 9m",
                        value:obrane_ostalo
                    },
                    {
                        name:"Primljeni 6m i 9m",
                        value:primljeni_ostalo
                    }
                ]
            ]);
        }
    });
    function handleCloseClick()//dialog se unmounta pri zatvaranju
    {
        setOpen(false);//mijenja state i od komponenete tablice statistike koja poziva ovi dialog na otvaranje tako da su u syncu,NE MOŽEMO KORISTIT REDUX ZAJEDNIČKI STATE JER BI SE ONDA OTVARALI OD SVIH POPUPI, TREBAMO IMAT ZA SVAKU KOMPONEENTU POSEBNO NJEN STATE 
        setIsOpen(false)
    }
    function handleOdabirSelect(event){
        setOdabir(event.target.value)
    }
    console.log('statistika dialog '+isOpen);
    console.log('Igrac '+JSON.stringify(igracData));
    console.log('Golmani '+JSON.stringify(golmanData));
    console.log('Pie chart '+JSON.stringify(pieChartData));
    if(igracLoading||golmanLoading||!(pieChartData&&(igracData||golmanData)))
    {
        return (<CircularProgress className={classes.loadingItem} color='primary'/>)
    }
    if(igracError||golmanError)
    {
        return (<Alert className={classes.alertItem} severity="error">{(igracError)? igracError.message : golmanError.message}</Alert>)
    }
    if(pieChartData&&(igracData||golmanData))//kada dodu podaci ovisno o tome je li golman ili igrac
    {
        return (
            <Dialog open={isOpen} classes={{paper: classes.dialogPaper}}  maxWidth={'md'} fullWidth={true}>
                <DialogTitle className={classes.dialogTitle}>
                    <IconButton onClick={()=>handleCloseClick()}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container direction='column' justify='space-evenly' alignItems='center'>
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
                                    <PieChart statistika={pieChartData[odabir.id-1]}/>
                                </Grid>
                                <Grid item container  justify='center' direction='row' xs={12} sm={5} md={4} style={{position:'relative'}}>
                                    <GolPrikaz goloviobrane={(isIgrac)? igracData.igracstatistikapopup.statistikapopup : golmanData.golmanstatistikapopup.statistikapopup} isIgrac={isIgrac} odabir={odabir.id}/>
                                </Grid>
                            </Grid>
                        </Grid>
                </DialogContent>
            </Dialog>
        )
    }
}

export default StatistikaDialog
