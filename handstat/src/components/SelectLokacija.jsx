import React,{Fragment} from 'react'
import {Typography,Box,Select,MenuItem,FormControl,InputLabel} from '@material-ui/core'
import {lokacijaOdabrana} from '../redux/slicers/lokacija';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {useDispatch,useSelector } from 'react-redux';
function SelectLokacija({dvorane}) { //zasad saljemo props inace cemo ih dobijat preko useeffecta nakon odabira najtecanja
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const dvorana=useSelector(state=>state.lokacija.mjestoDvorana);
    return (
        <Fragment>
           <FormControl style={{width:'80%',margin:'0 auto'}}>
                              <Box align='right'><LocationOnIcon/></Box>
                                <InputLabel >MJESTO I DVORANA</InputLabel>
                                <Select disabled={(spremljenGameInfo)? true : false} value={(dvorana)? dvorana : ''} onChange={(e)=>dispatch(lokacijaOdabrana(e.target.value))} renderValue={(selected)=>selected.naziv} >
                                {dvorane&&dvorane.map((dvorana)=><MenuItem key={dvorana.id} value={dvorana} ><Typography color='secondary'>{dvorana.naziv}</Typography></MenuItem>)}
                                </Select>
            </FormControl>
        </Fragment>
    )
}

export default SelectLokacija
