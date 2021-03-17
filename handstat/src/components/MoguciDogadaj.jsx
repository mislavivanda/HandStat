import React,{useState,Fragment} from 'react'
import {Typography,Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {useDispatch,useSelector } from 'react-redux';
import {odabranDogadaj} from '../redux/slicers/odabraniDogadaj';
import {otkljucajGol} from '../redux/slicers/otkljucajGol';
const useStyles=makeStyles((theme)=>({
      dogadajButton:{
        backgroundColor:'#FFFFFF',
        margin:'0.5rem',
        "&:hover":{//da ne radi shadow kad se howera stavimo istu boju ko inače pozadina
          backgroundColor:'#FFFFFF'
        }
      },
      dogadaj:{
        color:theme.palette.secondary.main
      }
    }));
function MoguciDogadaj(props) {
    const classes=useStyles();
    const [selected,setSelected]=useState(false);
    const odabraniClan=useSelector(state=>state.odabraniClan.clan);
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
      <Fragment> {/* dok nisu spremljena oba tima nema klika na dogadaje+za dogadaje timeout gosti i domaci nema aktera pa stoga ako je izabran neki akter njih ne možemo kliknuti      ako je nije odabran nijedna clan onda ne smimo dopustit klik na nijedan događaj koji zahtijeva aktera odnosno samo možemo kliknut na timeout*/            }
          <Button disabled={(!(timDomaciSpremljen&&timGostiSpremljen)||(odabraniClan&&(props.id===15 || props.id===16))||(odabraniClan&&((odabraniClan.tip>2)&&((props.id!==12)&&(props.id!==13)&&(props.id!==14))))||((!odabraniClan)&&((props.id!==15)&&(props.id!==16))))? true : false } onClick={()=>dogadajKlik(props.id,props.naziv,props.tip)}  disableRipple className={classes.dogadajButton}>
              <Typography align='center' variant='h6' className={classes.dogadaj}>{props.naziv}</Typography>                 {/* ako je odabran trener,fizio,tehniko ili predstavnik onda treba omogućit samo događaje žuti,crveni i plavi karton*/}
           </Button>                        
      </Fragment>
    )
}

export default MoguciDogadaj                                                   