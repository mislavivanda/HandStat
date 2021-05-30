import React,{Fragment} from 'react'
import {Typography,Box,Select,MenuItem,FormControl,InputLabel} from '@material-ui/core'
import {mjeracOdabran} from '../redux/slicers/mjeracVremena';
import {useDispatch,useSelector } from 'react-redux';
import TimerIcon from '@material-ui/icons/Timer';
import { useQuery } from '@apollo/client';
import {dohvatiSveMjerace} from '../graphql/query';
import Alert from '@material-ui/lab/Alert';
function SelectMjeracVremena() {
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const mjeracVremena=useSelector(state=>state.mjerac.odabraniMjerac);
    const {loading,error,data}=useQuery(dohvatiSveMjerace);

    if(loading) return null;

    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(data)
    {
        return (
            <Fragment>
                <FormControl style={{width:'80%',margin:'0 auto'}}>
                                <Box align='right'><TimerIcon/></Box>
                                    <InputLabel> MJERAČ VREMENA</InputLabel>
                                    <Select disabled={(spremljenGameInfo)? true : false} value={(mjeracVremena)? mjeracVremena : ''} renderValue={(mjeracVremena)=><Typography align='center'>{mjeracVremena.maticni_broj+' '+mjeracVremena.ime+' '+mjeracVremena.prezime}</Typography>} onChange={(e)=>dispatch(mjeracOdabran(e.target.value))} >
                                    {data.mjeracivremena&&data.mjeracivremena.map((mjerac)=><MenuItem key={mjerac.maticni_broj} value={mjerac}><Typography color='secondary'>{mjerac.maticni_broj+' '+mjerac.ime+' '+mjerac.prezime}</Typography></MenuItem>)}
                                    </Select>
                </FormControl>
            </Fragment>
        )
    }
}

export default SelectMjeracVremena
