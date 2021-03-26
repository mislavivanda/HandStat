import React,{Fragment} from 'react'
import {Box,TextField,FormControl,InputLabel} from '@material-ui/core'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { useSelector,useDispatch } from 'react-redux';
import {odabranoKolo} from '../redux/slicers/kolo';
function Kolo() {
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const kolo=useSelector(state=>state.kolo);
    return (
        <Fragment>
             <FormControl style={{width:'80%',margin:'0 auto'}}>
             <Box align='right'><RadioButtonUncheckedIcon/></Box>
                                <InputLabel>KOLO</InputLabel>
                                <TextField
                                type="number"
                                inputProps={{min:1}}
                                label=" "
                                value={kolo}
                                onChange={(e)=>dispatch(odabranoKolo(e.target.value))}
                                disabled={(spremljenGameInfo)? true : false}
                                />
            </FormControl>
        </Fragment>
    )
}

export default Kolo
