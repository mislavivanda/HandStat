import React,{Fragment} from 'react'
import {Box,TextField,FormControl,InputLabel} from '@material-ui/core'
import PeopleIcon from '@material-ui/icons/People';
import {gledateljiOdabrani} from '../redux/slicers/gledatelji';
import { useSelector,useDispatch } from 'react-redux';
function Gledatelji() {
    const dispatch=useDispatch();
    const gledatelji=useSelector(state=>state.gledatelji);
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    return (
        <Fragment>
             <FormControl style={{width:'80%',margin:'0 auto'}}>
                              <Box align='right'><PeopleIcon/></Box>
                                <InputLabel >GLEDATELJI</InputLabel>
                                <TextField
                                type="number"
                                inputProps={{min:0}}
                                label=" "
                                value={gledatelji}
                                onChange={(e)=>dispatch(gledateljiOdabrani(parseInt(e.target.value)))}//JER INAČE ŠALJE INPUT U OBLIKU STRINGA A NE INTEGERA
                                disabled={(spremljenGameInfo)? true : false}
                                />
                </FormControl>
        </Fragment>
    )
}

export default Gledatelji
