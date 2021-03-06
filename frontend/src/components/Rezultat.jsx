import React,{useState} from 'react'
import {Typography,IconButton,Box} from '@material-ui/core';
import {makeStyles,useTheme} from '@material-ui/core/styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
        width:'35%',
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
        width:'35%'
    },
    minutaBox:{
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width:'10%'
    },
    goloviObraneBox:{
        display:'flex',
        flexDirection:'row',
        padding:'1%',
        justifyContent: 'center',
        alignItems: 'center',
        width:'10%',
    },
    krugBox:{
        borderRadius:'50%',
        backgroundColor:theme.palette.primary.main,
        [theme.breakpoints.down('md')]: {
            width:'80%',
          },
        [theme.breakpoints.between('md','lg')]:{
            width:'60%'
        },
        [theme.breakpoints.up('lg')]:{
            width:'50%'
        },
        [theme.breakpoints.up('xl')]:{
            width:'40%'
        }
    }
}));
export default function Rezultat({history,broj_utakmice,natjecanje,domaci,gosti,golovi_domaci,golovi_gosti,minuta,status,golovi_obrane}) {//props golovi_obrane je za slucaj prikaza igraca i golmana
    const classes=useStyles();
    const theme=useTheme();
    const [renderDomaciRezultat,setRenderDomaciRezultat]=useState(false);
    const [renderGostiRezultat,setRenderGostiRezultat]=useState(false);
    const [prevRezultatDomaci,setPrevRezultatDomaci]=useState(golovi_domaci);//pamtimo prethodne rezultate kako bi znali koji rezultat treba rerednerat
    const [prevRezultatGosti,setPrevRezultatGosti]=useState(golovi_gosti);//kad se komponeneta tek mounta-> ne znamo prethodni rezultat pa ??emo ga postavit na dobiveni samo
    if(golovi_domaci!==prevRezultatDomaci)
    {
            setRenderDomaciRezultat(true);
            setTimeout(function(){//nakon 2 sekunde vrati na normalnu boju
                setRenderDomaciRezultat(false)
            },2000);
        setPrevRezultatDomaci(golovi_domaci);
    }
    if(golovi_gosti!==prevRezultatGosti)
    {
            setRenderGostiRezultat(true);
            setTimeout(function(){//nakon 2 sekunde vrati na normalnu boju
                setRenderGostiRezultat(false)
            },2000);
        setPrevRezultatGosti(golovi_gosti);
    }
    function odvediNaUtakmicu()/*koristimo .replace jer se rezultat box mo??e nalazit na vi??e razli??itih stranica a treba uvijek vodit na isti page u url pa ne mo??emo samo pushat na history stack*/
    {
        if(status===6)//onda je staticki rezultat-> staticka statistika
        {
            history.push(`${history.location.pathname}`);
            let broj=encodeURIComponent(broj_utakmice);
            history.replace(`/utakmica/${broj}`);
        }
        else {//aktivna utakmica-> live statistika
            history.push(`${history.location.pathname}`);
            let broj=encodeURIComponent(broj_utakmice);
            history.replace(`/utakmica/live/${broj}`);
        }
    }
    return (
        //OVO JE CENTRRIANJE CIJELOG BOXA ZA NASLOVOM-> IME NATJECANJA ??E BIT CENTRIRANO S NASLOVOM
        //box je zapravo div-> blok element-> zauzet ce sav raspolozivi prostor odnosno bit ce sirok ko griditem
        <Box style={{paddingLeft:'15%'}}>{/*pomaknemo element unutar grid boxa za 9% udesno(JER JE SIRINA BOXA=SIRINI GRID ITEM(jer je samo item a ne container) PA JE 9% GRIDA=9%BOXA A TO JE VELICINA STRELICE) -> smanjimo mu lijevi dio za 9% tako da imamo slucaj da je dio koji sadrzi domaci i gostujuci tim + rezultat centriran jer s lijeve stra
        ne ima marginu + 9% i s desne strane marginu i 9% SADR??AJA-> on ce biti centiran u odnosu na gridlist kao i naslov Rezultati uzivo pa ce biti poravnati
        imat cemo centriran dio sa rezultatom u odnosu na naslov Rezultati uzivo i REZULTAT BOX CE IMAT VE??I DESNI KRAJ ZA 9% NA KOJEN CE BIT STRELICA STA NAN PASE*/}
          {
              //za prikaz statickih rezultata nam ne treba naziv natjecanja na rezultatu, vec ga imamo
              /*oduzmemo 9% margine sta zauzima ikona strelice i minuta pa se onda centira u odnosu na 2 kluba i rezultat*/
              (natjecanje)?
              <Typography align='center' style={{marginRight:'15%'}}>{natjecanje}</Typography>
                :
                null
         }
          <Box className={classes.container}>
            <Box className={classes.domaciBox}><Typography align='center' color='secondary'>{domaci}</Typography></Box>
            <Box className={`${classes.rezultatBox}
             ${(()=>{
                 if(status===3)
                 {
                     return classes.poluvremeUtakmica
                 }
                 else if(status===5||status===6)
                 {
                     return classes.krajUtakmica
                 }
                 else return classes.aktivnaUtakmica
                })
                 ()} 
                `}>
                <Typography  align='center' style={{color:(renderDomaciRezultat)?'#1BA236':'#FFFFFF'}}> {golovi_domaci}</Typography>
                <Typography align='center' style={{color:'#FFFFFF'}}>:</Typography>
                <Typography align='center' style={{color:(renderGostiRezultat)?'#1BA236':'#FFFFFF'}}>{golovi_gosti}</Typography>
            </Box>
            <Box className={classes.gostiBox}><Typography  align='center' color='secondary'>{gosti}</Typography></Box>
            {
                (()=>{
                    if(minuta)
                    {
                        return ( <Box className={classes.minutaBox}><Typography align='center' color='primary' style={{fontWeight: 'bold'}}>{minuta+' \''}</Typography></Box>)
                    }
                    else if(golovi_obrane!==undefined)//ako ne poslajemo-> undefined koji se u drugim slucajevima coerca u null -> u nasem slucaju null ce biti umjesto 0 paonda gledamo po undefined jel ima ili nema golova
                    {                                                                                                           //ako je null onda je vrijednost 0
                        return (
                        <Box className={classes.goloviObraneBox}>
                            <Box className={classes.krugBox} ><Typography align='center' style={{color:'#FFFFFF'}}>{(golovi_obrane)? golovi_obrane : 0}</Typography></Box>
                        </Box>)
                    }
                    else {
                        return ( <Box style={{width:'10%'}}></Box>)//vrati samo prazni box da zauzme prostor kako bi strelica ostala na istom mjestu
                    }
                })()
            }
            <IconButton onClick={()=>odvediNaUtakmicu()} size='small' style={{ marginLeft:'auto',width:'5%'}}><ArrowForwardIosIcon/> </IconButton>
          </Box>                       {/*kako .replace mijenja trenutni path na stacku onda ??emo kod povratka nazad se vratiti na pretprethodni dio-> ako se ??elimo vratit na prethodni onda na history stack stavimo dodatni objekt s istim pathom(znamo ga preko history objekta) kojeg ??e zamijneit
                                        .replace funkcija a ovi prvi objekt tog patha ??e ostati na stacku pa ??emo se kod povratka natrag vratiti na pravu prethodnu stranicu */}
        </Box>
    )
}