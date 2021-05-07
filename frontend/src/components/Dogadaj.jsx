import {React,Fragment} from 'react'
import {Box, Typography,IconButton} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import {useDispatch,useSelector} from 'react-redux';
import {izbrisiDogadaj,promjenaRezultataDogadaja} from '../redux/slicers/dogadajiUtakmice';
import { useMutation } from '@apollo/client';
import {ukloniDogadaj} from '../graphql/mutation';
import ErrorDialog from './ErrorDialog';
import {postaviError} from '../redux/slicers/error';
import {decrementDomaci,decrementGosti} from '../redux/slicers/rezultat';
const useStyles=makeStyles((theme)=>({
    dogadajGlavniBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'stretch',
        justifyContent:'space-between',
        width:'100%',
        backgroundColor:'#FFFFFF',
        borderRadius:3,
        margin:'0.3rem auto'
    },
    dogadajKlubSlika:{
        width:'100%',
        height:'auto'
    },
    dogadajRezultatBox:{
        display:'flex',
        justifyContent:'center',
        width:'15%',
        alignItems:'center',
        backgroundColor:theme.palette.primary.main,
        borderColor:theme.palette.secondary.main,
        borderStyle:'solid',
        borderWidth:1
    },
    dogadajImePrezimeDogadajBox:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    }
}))
function Dogadaj(props) {
    const classes=useStyles();
    const dispatch=useDispatch();
    const {timDomaci,timGosti}=useSelector(state=>state.timovi);
    const [brisiDogadaj,{error}]=useMutation(ukloniDogadaj,{
        onCompleted:(data)=>{//u data je vraćen id dogadaja koji je izbrisan
            //nakon što je uklonjen u bazi možemo ga ukloniti iz statea
            //ako je dogadaj tipa 1 onda je potrebno umanjit rezultat i SVIM OSTALIM DOGAĐAJIMA S PROMJENOM REZULTATA UMANJIT REZULTAT ZA 1
            if(data.izbrisidogadaj.dogadaj.tip===1)//potrebno smanjit rezultat
            {
                if(data.izbrisidogadaj.tim===1)//smanji rezultat od domaceg tima
                {
                    dispatch(decrementDomaci());
                }
                else dispatch(decrementGosti());
                //pozovi action za smanjivanje rezultata svih rezultatskih dogadaja nakon ovog
                dispatch(promjenaRezultataDogadaja({
                    id:data.izbrisidogadaj.id,
                    tim:data.izbrisidogadaj.tim,
                }));//saljemo mu id dogadaja da ga pronade U NIZU DOGADAJA + oznaku tima da zna čiji rezultat treba smanjiti
            }
            //svakako izbrisi dogadaj
            dispatch(izbrisiDogadaj(data.izbrisidogadaj.id));
        },
        onError:(error)=>{
            dispatch(postaviError(true));
        }
    })
function izbrisDogadaj(dogadaj_id)//ID JE ID IZ BAZE KOJI DOBIJEMO NAKON ŠTO SE DOGAĐAJ SPREMI U BAZU,TEK NAKON USPJEŠNOG SPREMANJA U BAZI ĆEMO GA RENDERAT
{
   //IZBACI DOGAĐAJ KOJI ŽELIMO IZBRISATI ODNOSNO ONAJ NA KOJI SMO KLIKNULI REMOVE IKONU
   brisiDogadaj({
       variables:{
           dogadaj_id:dogadaj_id
       }
   });
}
    return (
      <Fragment>
         {
            (()=>{
                if(props.tip===1)//dogadaji s akterom i promjenom rezultata-> golovi
                {//ako je prop aktivan=true-> onda se dogadaj prikazuje live dok traje utakmica i moze se brisati-> prikazi remove icon button
                                    //ako je false-> prikzuje se kod pregleda utakmice,nema remove icon buttona
                if(props.aktivan)
                {
               return (
                    <Box className={classes.dogadajGlavniBox} >
                        <Box style={{width:'12%',display:'flex',alignItems:'center'}}><Typography color='secondary' align='center'>{props.vrijeme}</Typography></Box>
                        <Box style={{width:'15%',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                            <img className={classes.dogadajKlubSlika} src={(props.klubikona==1)? timDomaci.klub_slika : timGosti.klub_slika} alt='klub grb'/>
                        </Box>
                        <Box className={classes.dogadajRezultatBox}><Typography align='center' style={{color:'#FFFFFF'}}>{props.domaci+':'+props.gosti}</Typography></Box>
                        <Box style={{width:'53%',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                          <Box className={classes.dogadajImePrezimeDogadajBox}><Typography align='center' color='secondary'>{props.ime+' '+props.prezime}</Typography></Box>
                          <Box className={classes.dogadajImePrezimeDogadajBox}><Typography align='center' color='secondary'>{props.dogadaj}</Typography></Box>
                        </Box>
                        <IconButton onClick={()=>izbrisDogadaj(props.id)} style={{width:'5%',height:'auto'}} align='right' size='small' title='Ukloni' color='secondary'  disableRipple><RemoveCircleIcon/></IconButton>
                    </Box>
                )
                }
                else
                 return (
                    <Box className={classes.dogadajGlavniBox} >
                    <Box style={{width:'12%',display:'flex',alignItems:'center'}}><Typography color='secondary' align='center'>{props.vrijeme}</Typography></Box>
                    <Box style={{width:'15%',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <img className={classes.dogadajKlubSlika} src={(props.klubikona==1)? timDomaci.klub_slika : timGosti.klub_slika} alt='klub grb'/>
                    </Box>
                    <Box className={classes.dogadajRezultatBox}><Typography align='center' style={{color:'#FFFFFF'}}>{props.domaci+':'+props.gosti}</Typography></Box>
                    <Box style={{width:'58%',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                      <Box className={classes.dogadajImePrezimeDogadajBox}><Typography align='center' color='secondary'>{props.ime+' '+props.prezime}</Typography></Box>
                      <Box className={classes.dogadajImePrezimeDogadajBox}><Typography align='center' color='secondary'>{props.dogadaj}</Typography></Box>
                    </Box>
                </Box>
                )
                }
                else if(props.tip===2)//dogadaji bez promjene rezultata i bez aktera-> npr timeout domaci,gosti
                {
                if(props.aktivan)
                {
                return(
                <Box className={classes.dogadajGlavniBox}>
                    <Box style={{width:'12%',display:'flex',alignItems:'center'}}><Typography color='secondary' align='center'>{props.vrijeme}</Typography></Box>
                    <Box style={{width:'15%',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <img className={classes.dogadajKlubSlika} src={(props.klubikona==1)? timDomaci.klub_slika : timGosti.klub_slika} alt='klub grb'/>
                    </Box>
                    <Box style={{width:'15%',height:'95%',backgroundColor:'#FFFFFF'}}></Box>
                    <Box style={{width:'53%',display:'flex',alignItems:'center',justifyContent:'space-around'}}><Typography align='center' color='secondary'>{props.dogadaj}</Typography></Box>
                    <IconButton onClick={()=>izbrisDogadaj(props.id)} style={{width:'5%',height:'auto'}} align='right' size='small' title='Ukloni' color='secondary'  disableRipple><RemoveCircleIcon/></IconButton>
                </Box>
                )
                }
                else return(
                    <Box className={classes.dogadajGlavniBox}>
                    <Box style={{width:'12%',display:'flex',alignItems:'center'}}><Typography color='secondary' align='center'>{props.vrijeme}</Typography></Box>
                    <Box style={{width:'15%',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <img className={classes.dogadajKlubSlika} src={(props.klubikona==1)? timDomaci.klub_slika : timGosti.klub_slika} alt='klub grb'/>
                    </Box>
                    <Box style={{width:'15%',height:'95%',backgroundColor:'#FFFFFF'}}></Box>
                    <Box style={{width:'58%',display:'flex',alignItems:'center',justifyContent:'space-around'}}><Typography align='center' color='secondary'>{props.dogadaj}</Typography></Box>
                </Box>
                )
                }
                else {//dogadaji bez promjene rezultata npr iskljucenje,asistencija ali s akterom
                if(props.aktivan)
                {
                return (
                <Box className={classes.dogadajGlavniBox}>
                    <Box style={{width:'12%',display:'flex',alignItems:'center'}}><Typography color='secondary' align='center'>{props.vrijeme}</Typography></Box>
                    <Box style={{width:'15%',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <img className={classes.dogadajKlubSlika} src={(props.klubikona==1)? timDomaci.klub_slika : timGosti.klub_slika} alt='klub grb'/>
                    </Box>
                    <Box style={{width:'15%',height:'95%',backgroundColor:'#FFFFFF'}}></Box>
                    <Box style={{width:'53%',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                          <Box><Typography align='center' color='secondary'>{props.ime+' '+props.prezime}</Typography></Box>
                          <Box><Typography align='center' color='secondary'>{props.dogadaj}</Typography></Box>
                    </Box>
                    <IconButton onClick={()=>izbrisDogadaj(props.id)} style={{width:'5%',height:'auto'}} align='right' size='small' title='Ukloni' color='secondary'  disableRipple><RemoveCircleIcon/></IconButton>
                </Box>
                )
                }else return(
                    <Box className={classes.dogadajGlavniBox}>
                    <Box style={{width:'12%',display:'flex',alignItems:'center'}}><Typography color='secondary' align='center'>{props.vrijeme}</Typography></Box>
                    <Box style={{width:'15%',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <img className={classes.dogadajKlubSlika} src={(props.klubikona==1)? timDomaci.klub_slika : timGosti.klub_slika} alt='klub grb'/>
                    </Box>
                    <Box style={{width:'15%',height:'95%',backgroundColor:'#FFFFFF'}}></Box>
                    <Box style={{width:'58%',display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                          <Box><Typography align='center' color='secondary'>{props.ime+' '+props.prezime}</Typography></Box>
                          <Box><Typography align='center' color='secondary'>{props.dogadaj}</Typography></Box>
                    </Box>
                </Box>
                )
                }
            })()
         }
         {
             (error&&error.message)?
             <ErrorDialog errorText={error.message}/>
             :
             null
         }
      </Fragment>
    )
  }

export default Dogadaj