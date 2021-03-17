import React,{Fragment} from 'react'
import {Typography,Box,Select,MenuItem,FormControl,InputLabel} from '@material-ui/core'
import {useDispatch,useSelector } from 'react-redux';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import {nadzornikOdabran} from '../redux/slicers/nadzornik';
function SelectNadzornik({nadzornici}) {
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const nadzornik=useSelector(state=>state.nadzornik.odabraniNadzornik);
    return (
        <Fragment>
              <FormControl style={{width:'80%',margin:'0 auto'}}>
                              <Box align='right'><SupervisedUserCircleIcon/></Box>
                                <InputLabel >NADZORNIK</InputLabel>
                                <Select disabled={(spremljenGameInfo)? true : false} value={(nadzornik)? nadzornik : ''}  onChange={(e)=>dispatch(nadzornikOdabran(e.target.value))} renderValue={(nadzornik)=>(nadzornik.maticni_broj+' '+nadzornik.ime+' '+nadzornik.prezime)} >
                                {nadzornici&&nadzornici.map((nadzornik)=><MenuItem key={nadzornik.maticni_broj} value={nadzornik}><Typography color='secondary'>{nadzornik.maticni_broj+' '+nadzornik.ime+' '+nadzornik.prezime}</Typography></MenuItem>)}
                                </Select>
                </FormControl>
        </Fragment>
    )
}

export default SelectNadzornik
