import React,{Fragment} from 'react'
import {Typography,Box,Select,MenuItem,FormControl,InputLabel} from '@material-ui/core'
import {mjeracOdabran} from '../redux/slicers/mjeracVremena';
import {useDispatch,useSelector } from 'react-redux';
import TimerIcon from '@material-ui/icons/Timer';
function SelectMjeracVremena({mjeraciVremena}) {
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const mjeracVremena=useSelector(state=>state.mjerac.odabraniMjerac);
    return (
        <Fragment>
             <FormControl style={{width:'80%',margin:'0 auto'}}>
                              <Box align='right'><TimerIcon/></Box>
                                <InputLabel> MJERAČ VREMENA</InputLabel>
                                <Select disabled={(spremljenGameInfo)? true : false} value={(mjeracVremena)? mjeracVremena : ''} renderValue={(mjeracVremena)=>(mjeracVremena.maticni_broj+' '+mjeracVremena.ime+' '+mjeracVremena.prezime)} onChange={(e)=>dispatch(mjeracOdabran(e.target.value))} >
                                {mjeraciVremena&&mjeraciVremena.map((mjerac)=><MenuItem key={mjerac.maticni_broj} value={mjerac}><Typography color='secondary'>{mjerac.maticni_broj+' '+mjerac.ime+' '+mjerac.prezime}</Typography></MenuItem>)}
                                </Select>
            </FormControl>
        </Fragment>
    )
}

export default SelectMjeracVremena
