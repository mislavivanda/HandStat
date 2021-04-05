import React,{Fragment,useState,useEffect} from 'react'
import {Box,FormControl} from '@material-ui/core'
import { useSelector,useDispatch } from 'react-redux';
import {postaviDatum} from '../redux/slicers/datum';
import {KeyboardDatePicker} from '@material-ui/pickers';
import EventIcon from '@material-ui/icons/Event';
function Datum() {
    const dispatch=useDispatch();
    const [pozvan,setPozvan]=useState(false);//kada se prvi put ucita komponenta(ne nakon svakog ucitavanja kod promjene stanja nego bas prvi put) postavimo datum na trenutno vrijeme za slucaj da korisnik ne odabere datum i vrijeme jer mu pasu trenutni
    //pozivamo useEffect samo 1([]) nakon svakog rerednera ALI SE ON IZVRSI SAMO PRVI PUT KOD PRVOG UCITAVANJA
    useEffect(()=>{
        if(!pozvan)//ako je pozvan false-> prvi put se mounta komponenta
        {
            setPozvan(true);//neće se više izvršiti ovi dio useEffecta
            dispatch(postaviDatum((new Date()).toISOString()));//postavi datum na trenutni kao što je i u pickeru
        }
    },[]);
    const [date,setDate]=useState(new Date());
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const handleDateChange = (date) => {          /*kod datePickera se u onchange prosljeđuje (null,date) a inace se u materialUI prosljeđuje samo event objekt a vrijednosti pristupamo preko event.target.value*/
        dispatch(postaviDatum(date.toISOString()));
        setDate(date);
    };
    return (
        <Fragment>
             <FormControl style={{width:'80%',margin:'0 auto'}}>
                              <Box align='right'><EventIcon/></Box>
                                <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        label='DATUM'
                                        autoOk
                                        disabled={(spremljenGameInfo)? true : false}
                                        value={date}
                                        onChange={handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
            </FormControl>
        </Fragment>
    )
}

export default Datum
