import React,{useState,Fragment} from 'react'
import {Typography,Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useDispatch,useSelector } from 'react-redux';
import {odabranDogadaj} from '../redux/slicers/odabraniDogadaj';
const useStyles=makeStyles((theme)=>({
      dogadajButtonSelektiran:{
        backgroundColor:'#fa9905',
        margin:'0.5rem',
        "&:hover":{//da ne radi shadow kad se howera stavimo istu boju ko inače pozadina
          backgroundColor:'#fa9905'
        }
      },
      dogadajButtonNeselektiran:{
        backgroundColor:'#FFFFFF',
        margin:'0.5rem',
        "&:hover":{//da ne radi shadow kad se howera stavimo istu boju ko inače pozadina
          backgroundColor:'#FFFFFF'
        }
      },
      textNeselektiran:{//ostavit ovako u slucaju promjena boje
         color:theme.palette.secondary.main
     },
      textSelektiran:{
         color:'#FFFFFF'
     }
    }));
function MoguciDogadaj(props) {
    const classes=useStyles();
    const odabraniClan=useSelector(state=>state.odabraniClan.clan);
    const odabraniDogadaj=useSelector(state=>state.odabraniDogadaj.dogadaj);
    const {timDomaciSpremljen,timGostiSpremljen}=useSelector(state=>state.timovi);
    const dispatch=useDispatch();
    function dogadajKlik(id,naziv,tip)//poziva se kod odabira dogadaja
    {
            dispatch(odabranDogadaj({
                id:id,
                naziv:naziv,
                tip:tip
                }));
    }
    return (
      <Fragment> {/* dok nisu spremljena oba tima nema klika na dogadaje+za dogadaje timeout gosti i domaci nema aktera pa stoga ako je izabran neki akter njih ne možemo kliknuti      ako je nije odabran nijedna clan onda ne smimo dopustit klik na nijedan događaj koji zahtijeva aktera odnosno samo možemo kliknut na timeout                                            ako nije odabran igrac onda ne dopustamo dogadaje svojestvene samo za igraca: asistencija i tehnicka-> omogucen sedmerac promasaj/pogodak za golmane->*/            }
          <Button disabled={(!(timDomaciSpremljen&&timGostiSpremljen)||(odabraniClan&&(props.id===15 || props.id===16))||(odabraniClan&&((odabraniClan.tip>2)&&((props.id!==12)&&(props.id!==13)&&(props.id!==14))))||((!odabraniClan)&&((props.id!==15)&&(props.id!==16)))||((odabraniClan&&odabraniClan.tip!==2)&&(props.id===2||props.id===4||props.id===6||props.id===8))||((odabraniClan&&odabraniClan.tip!==1)&&(props.id===10||props.id===11)))? true : false } onClick={()=>dogadajKlik(props.id,props.naziv,props.tip)}  disableRipple className={`${classes.dogadajButton} ${(odabraniDogadaj&&odabraniDogadaj.id===props.id)? classes.dogadajButtonSelektiran : classes.dogadajButtonNeselektiran}`} >
              <Typography align='center' variant='h6' className={`${(odabraniDogadaj&&odabraniDogadaj.id===props.id)? classes.textSelektiran : classes.textNeselektiran}`}>{props.naziv}</Typography>                 {/* ako je odabran trener,fizio,tehniko ili predstavnik onda treba omogućit samo događaje žuti,crveni i plavi karton                      ako NIJE odabran golman onda ne dopuštamo događaje tipa obrana i primljeni pogoci  */}
           </Button>                        
      </Fragment>
    )
}

export default MoguciDogadaj                                                   