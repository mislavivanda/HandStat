import React,{Fragment,useState} from 'react'
import ScheduleIcon from '@material-ui/icons/Schedule';
import {Box,FormControl} from '@material-ui/core'
import {TimePicker} from '@material-ui/pickers';
import {postaviVrijeme} from '../redux/slicers/vrijeme';
import { useSelector,useDispatch } from 'react-redux';
function Vrijeme() {
    const dispatch=useDispatch();
    const [date,setDate]=useState(new Date());
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const handleTimeChange=(date)=>{
        dispatch(postaviVrijeme(date));
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
