import React,{Fragment} from 'react'
import {Typography,Box,Select,MenuItem,FormControl,InputLabel} from '@material-ui/core'
import {useDispatch,useSelector } from 'react-redux';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import {nadzornikOdabran} from '../redux/slicers/nadzornik';
import { useQuery } from '@apollo/client';
import {dohvatiSveNadzornike} from '../graphql/query';
import Alert from '@material-ui/lab/Alert';
function SelectNadzornik() {
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const nadzornik=useSelector(state=>state.nadzornik.odabraniNadzornik);
    const {loading,error,data}=useQuery(dohvatiSveNadzornike);

    if(loading) return null;

    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(data)
    {
        return (
            <Fragment>
                <FormControl style={{width:'80%',margin:'0 auto'}}>
                                <Box align='right'><SupervisedUserCircleIcon/></Box>
                                    <InputLabel >NADZORNIK</InputLabel>
                                    <Select disabled={(spremljenGameInfo)? true : false} value={(nadzornik)? nadzornik : ''}  onChange={(e)=>dispatch(nadzornikOdabran(e.target.value))} renderValue={(nadzornik)=><Typography align='center'>{nadzornik.maticni_broj+' '+nadzornik.ime+' '+nadzornik.prezime}</Typography>} >
                                    {data.nadzornici&&data.nadzornici.map((nadzornik)=><MenuItem key={nadzornik.maticni_broj} value={nadzornik}><Typography color='secondary'>{nadzornik.maticni_broj+' '+nadzornik.ime+' '+nadzornik.prezime}</Typography></MenuItem>)}
                                    </Select>
                    </FormControl>
            </Fragment>
        )
    }
}

export default SelectNadzornik
