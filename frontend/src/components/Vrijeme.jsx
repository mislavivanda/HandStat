import React,{Fragment,useState,useEffect} from 'react'
import ScheduleIcon from '@material-ui/icons/Schedule';
import {Box,FormControl} from '@material-ui/core'
import {TimePicker} from '@material-ui/pickers';
import {postaviVrijeme} from '../redux/slicers/vrijeme';
import { useSelector,useDispatch } from 'react-redux';
function Vrijeme() {
    const dispatch=useDispatch();
    const [pozvan,setPozvan]=useState(false);//kada se prvi put ucita komponenta(ne nakon svakog ucitavanja kod promjene stanja nego bas prvi put) postavimo datum na trenutno vrijeme za slucaj da korisnik ne odabere datum i vrijeme jer mu pasu trenutni
    //pozivamo useEffect samo 1([]) nakon svakog rerednera ALI SE ON IZVRSI SAMO PRVI PUT KOD PRVOG UCITAVANJA
    useEffect(()=>{
        if(!pozvan)//ako je pozvan false-> prvi put se mounta komponenta
        {
            setPozvan(true);//neće se više izvršiti ovi dio useEffecta
            dispatch(postaviVrijeme((new Date()).toISOString()));//postavi datum na trenutni kao što je i u pickeru
        }
    },[]);
    const [date,setDate]=useState(new Date());
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const handleTimeChange=(date)=>{
        dispatch(postaviVrijeme(date.toISOString()));
        setDate(date);
      }
    return (
       <Fragment>
            <FormControl style={{width:'80%',margin:'0 auto'}}>
                              <Box align='right'><ScheduleIcon/></Box>
                                <TimePicker
                                    clearable
                                    ampm={false}
                                    label="VRIJEME"
                                    value={date}
                                    onChange={handleTimeChange}
                                    disabled={(spremljenGameInfo)? true : false}
                                  />
            </FormControl>
       </Fragment>
    )
}

export default Vrijeme
