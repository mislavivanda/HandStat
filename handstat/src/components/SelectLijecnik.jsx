import React,{Fragment} from 'react'
import {Typography,Box,Select,MenuItem,FormControl,InputLabel} from '@material-ui/core'
import {useDispatch,useSelector } from 'react-redux';
import {lijecnikOdabran} from '../redux/slicers/lijecnik';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
function SelectLijecnik({lijecnici}) {
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const lijecnik=useSelector(state=>state.lijecnik.odabraniLijecnik);
    return (
      <Fragment>
           <FormControl style={{width:'80%',margin:'0 auto'}}>
                              <Box align='right'><LocalHospitalIcon/></Box>
                                <InputLabel >LIJEČNIK</InputLabel>
                                <Select disabled={(spremljenGameInfo)? true : false} value={(lijecnik)? lijecnik : ''} renderValue={(lijecnik)=>(lijecnik.maticni_broj+' '+lijecnik.ime+' '+lijecnik.prezime)} onChange={(e)=>dispatch(lijecnikOdabran(e.target.value))} >
                                {lijecnici&&lijecnici.map((lijecnik)=><MenuItem key={lijecnik.maticni_broj} value={lijecnik}><Typography color='secondary'>{lijecnik.maticni_broj+' '+lijecnik.ime+' '+lijecnik.prezime}</Typography></MenuItem>)}
                                </Select>
            </FormControl>
      </Fragment>
    )
}

export default SelectLijecnik
