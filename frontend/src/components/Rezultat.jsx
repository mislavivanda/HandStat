import React,{useState} from 'react'
import {Typography,IconButton,Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const useStyles=makeStyles((theme)=>({
    container:{
        display:'flex',
        flexDirection:'row',
        margin:'auto',//centriranje,
        height:'100%',
        borderStyle:'solid',
        borderColor:theme.palette.secondary.main,
        borderWidth:2,
    },
    domaciBox:{
        display:'flex',
        width:'38%',
        justifyContent: 'center',//horizontalno centriranje
        alignItems: 'center',//vertikalno centriranje
    },
    rezultatBox:{
        display:'flex',
        width:'15%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aktivnaUtakmica:{
        backgroundColor:theme.palette.primary.main
    },
    poluvremeUtakmica:{
        backgroundColor:'#fa9905'
    },
    krajUtakmica:{
        backgroundColor:theme.palette.secondary.main
    },
    gostiBox:{
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width:'38%'
    },
    minutaBox:{
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width:'4%'
    }
}));
export default function Rezultat({history,broj_utakmice,natjecanje,domaci,gosti,golovi_domaci,golovi_gosti,minuta,status}) {
    const classes=useStyles();
    const [renderDomaciRezultat,setRenderDomaciRezultat]=useState(false);
    const [renderGostiRezultat,setRenderGostiRezultat]=useState(false);
    const [prevRezultatDomaci,setPrevRezultatDomaci]=useState(null);//pamtimo prethodne rezultate kako bi znali koji rezultat treba rerednerat
    const [prevRezultatGosti,setPrevRezultatGosti]=useState(null);//kad se komponeneta tek mounta-> ne znamo prethodni rezultat pa ćemo ga postavit na dobiveni samo
    if(golovi_domaci!==prevRezultatDomaci)
    {
        if(prevRezultatDomaci)//ako nije null-> postavljen na neki broj-> promijenio se rezultat
        {
            setRenderDomaciRezultat(true);
            setTimeout(function(){//nakon 1 sekunde vrati na normalnu boju
                setRenderDomaciRezultat(false)
            },2000);
        }//ako je null-> prvi put se mounta komponeneta-> postavi na dobiveni rezultat u propsu
        //u oba slucaja postavljamo novi rezultat za prethodni
        setPrevRezultatDomaci(golovi_domaci);
    }
    if(golovi_gosti!==prevRezultatGosti)
    {
        if(prevRezultatGosti)
        {
            setRenderGostiRezultat(true);
            setTimeout(function(){//nakon 1 sekunde vrati na normalnu boju
                setRenderGostiRezultat(false)
            },2000);
        }
        setPrevRezultatGosti(golovi_gosti);
    }
    function odvediNaUtakmicu()
    {
        {history.push(`${history.location.pathname}`);
        let broj=encodeURIComponent(broj_utakmice);
        history.replace(`utakmica/${broj}`)}
    }
    return (
        <Box>
          <Typography align='center' style={{marginRight:'9%'}}>{natjecanje}</Typography>{/*oduzmemo 9% margine sta zauzima ikona strelice i minuta pa se onda centira u odnosu na 2 kluba i rezultat*/ }
          <Box className={classes.container}>
            <Box className={classes.domaciBox}><Typography align='center' color='secondary'>{domaci}</Typography></Box>
            <Box className={`${classes.rezultatBox}
             ${(()=>{
                 if(status===3)
                 {
                     return classes.poluvremeUtakmica
                 }
                 else if(status===5)
                 {
                     return classes.krajUtakmica
                 }
                 else return classes.aktivnaUtakmica
                })
                 ()} 
                `}>
                <Typography  align='center' style={{color:(renderDomaciRezultat)?'#f7ea00':'#FFFFFF'}}> {golovi_domaci}</Typography>
                <Typography align='center' style={{color:'#FFFFFF'}}>:</Typography>
                <Typography align='center' style={{color:(renderGostiRezultat)?'#f7ea00':'#FFFFFF'}}>{golovi_gosti}</Typography>
            </Box>
            <Box className={classes.gostiBox}><Typography  align='center' color='secondary'>{gosti}</Typography></Box>{/*koristimo .replace jer se rezultat box može nalazit na više različitih stranica a treba uvijek vodit na isti page u url pa ne možemo samo pushat na history stack*/}
            <Box className={classes.minutaBox}><Typography align='center' color='primary' style={{fontWeight: 'bold'}}>{minuta}'</Typography></Box>
            <IconButton onClick={()=>odvediNaUtakmicu()} size='small' style={{ marginLeft:'auto',width:'5%'}}><ArrowForwardIosIcon/> </IconButton>
          </Box>                       {/*kako .replace mijenja trenutni path na stacku onda ćemo kod povratka nazad se vratiti na pretprethodni dio-> ako se želimo vratit na prethodni onda na history stack stavimo dodatni objekt s istim pathom(znamo ga preko history objekta) kojeg će zamijneit
                                        .replace funkcija a ovi prvi objekt tog patha će ostati na stacku pa ćemo se kod povratka natrag vratiti na pravu prethodnu stranicu */}
        </Box>
    )
}
