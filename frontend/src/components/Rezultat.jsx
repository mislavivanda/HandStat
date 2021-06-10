import React,{useState,useRef} from 'react'
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
    },
    goloviObraneBox:{
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width:'4%',
        backgroundColor:theme.palette.primary.main,
        borderRadius:'50%'
    }
}));
export default function Rezultat({history,broj_utakmice,natjecanje,domaci,gosti,golovi_domaci,golovi_gosti,minuta,status,golovi_obrane}) {//props golovi_obrane je za slucaj prikaza igraca i golmana
    const classes=useStyles();
    const [renderDomaciRezultat,setRenderDomaciRezultat]=useState(false);
    const [renderGostiRezultat,setRenderGostiRezultat]=useState(false);
    const [prevRezultatDomaci,setPrevRezultatDomaci]=useState(golovi_domaci);//pamtimo prethodne rezultate kako bi znali koji rezultat treba rerednerat
    const [prevRezultatGosti,setPrevRezultatGosti]=useState(golovi_gosti);//kad se komponeneta tek mounta-> ne znamo prethodni rezultat pa ćemo ga postavit na dobiveni samo
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
    function odvediNaUtakmicu()
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
        //box je zapravo div-> blok element-> zauzet ce sav raspolozivi prostor odnosno bit ce sirok ko griditem
        <Box style={{paddingLeft:'9%'}}>{/*pomaknemo element unutar grid boxa za 9% udesno(JER JE SIRINA BOXA=SIRINI GRID ITEM(jer je samo item a ne container) PA JE 9% GRIDA=9%BOXA A TO JE VELICINA STRELICE) -> smanjimo mu lijevi dio za 9% tako da imamo slucaj da je dio koji sadrzi domaci i gostujuci tim + rezultat centriran jer s lijeve stra
        ne ima marginu + 9% i s desne strane marginu i 9%-> on ce biti centiran u odnosu na gridlist kao i naslov Rezultati uzivo pa ce biti poravnati
        imat cemo centriran dio sa rezultatom u odnosu na naslov Rezultati uzivo i REZULTAT BOX CE IMAT VEĆI DESNI KRAJ ZA 9% NA KOJEN CE BIT STRELICA STA NAN PASE*/}
          {
              //za prikaz statickih rezultata nam ne treba naziv natjecanja na rezultatu, vec ga imamo
              /*oduzmemo 9% margine sta zauzima ikona strelice i minuta pa se onda centira u odnosu na 2 kluba i rezultat*/
              (natjecanje)?
              <Typography align='center' style={{marginRight:'9%'}}>{natjecanje}</Typography>
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
                <Typography  align='center' style={{color:(renderDomaciRezultat)?'#f7ea00':'#FFFFFF'}}> {golovi_domaci}</Typography>
                <Typography align='center' style={{color:'#FFFFFF'}}>:</Typography>
                <Typography align='center' style={{color:(renderGostiRezultat)?'#f7ea00':'#FFFFFF'}}>{golovi_gosti}</Typography>
            </Box>
            <Box className={classes.gostiBox}><Typography  align='center' color='secondary'>{gosti}</Typography></Box>{/*koristimo .replace jer se rezultat box može nalazit na više različitih stranica a treba uvijek vodit na isti page u url pa ne možemo samo pushat na history stack*/}
            {
                (()=>{
                    if(minuta)
                    {
                        return ( <Box className={classes.minutaBox}><Typography align='center' color='primary' style={{fontWeight: 'bold'}}>{minuta+' \''}</Typography></Box>)
                    }
                    else if(golovi_obrane!==undefined)//ako ne poslajemo-> undefined koji se u drugim slucajevima coerca u null -> u nasem slucaju null ce biti umjesto 0 paonda gledamo po undefined jel ima ili nema golova
                    {                                                                                                           //ako je null onda je vrijednost 0
                        return (<Box className={classes.goloviObraneBox}><Typography align='center' style={{color:'#FFFFFF'}}>{(golovi_obrane)? golovi_obrane : 0}</Typography></Box>)
                    }
                    else {
                        return ( <Box style={{width:'4%'}}></Box>)//vrati samo prazni box da zauzme prostor kako bi strelica ostala na istom mjestu
                    }
                })()
            }
            <IconButton onClick={()=>odvediNaUtakmicu()} size='small' style={{ marginLeft:'auto',width:'5%'}}><ArrowForwardIosIcon/> </IconButton>
          </Box>                       {/*kako .replace mijenja trenutni path na stacku onda ćemo kod povratka nazad se vratiti na pretprethodni dio-> ako se želimo vratit na prethodni onda na history stack stavimo dodatni objekt s istim pathom(znamo ga preko history objekta) kojeg će zamijneit
                                        .replace funkcija a ovi prvi objekt tog patha će ostati na stacku pa ćemo se kod povratka natrag vratiti na pravu prethodnu stranicu */}
        </Box>
    )
}