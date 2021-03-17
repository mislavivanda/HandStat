import React,{Fragment} from 'react'
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import {Box,TextField,FormControl,InputLabel} from '@material-ui/core'
import {brojUtakmiceUnesen} from '../redux/slicers/brojUtakmice';
import { useSelector,useDispatch } from 'react-redux';
function BrojUtakmice() {
    const dispatch=useDispatch();
    const brojUtakmice=useSelector(state=>state.brojUtakmice);
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    return (
      <Fragment>
            <FormControl style={{width:'80%',margin:'0 auto'}}>
            <Box align='right'><VpnKeyIcon/></Box>
                                <InputLabel >BROJ UTAKMICE</InputLabel>
                                <TextField
                                type="string"
                                label=" "
                                value={brojUtakmice}
                                onChange={(e)=>dispatch(brojUtakmiceUnesen(e.target.value))}
                                disabled={(spremljenGameInfo)? true : false}
                                />
            </FormControl>
      </Fragment>
    )
}

export default BrojUtakmice
