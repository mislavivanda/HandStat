import React,{Fragment,useState} from 'react'
import {Box,FormControl} from '@material-ui/core'
import { useSelector,useDispatch } from 'react-redux';
import {postaviDatum} from '../redux/slicers/datum';
import {KeyboardDatePicker} from '@material-ui/pickers';
import EventIcon from '@material-ui/icons/Event';
function Datum() {
    const dispatch=useDispatch();
    const [date,setDate]=useState(new Date());
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const handleDateChange = (date) => {          /*kod datePickera se u onchange prosljeđuje (null,date) a inace se u materialUI prosljeđuje samo event objekt a vrijednosti pristupamo preko event.target.value*/
        dispatch(postaviDatum(date));
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
