import React,{Fragment} from 'react'
import {Typography,Box,Select,MenuItem,FormControl,InputLabel} from '@material-ui/core'
import {lokacijaOdabrana} from '../redux/slicers/lokacija';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {useDispatch,useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import {dohvatiSveDvorane} from '../graphql/query';
import Alert from '@material-ui/lab/Alert';
function SelectLokacija() { //zasad saljemo props inace cemo ih dobijat preko useeffecta nakon odabira najtecanja
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const dvorana=useSelector(state=>state.lokacija.mjestoDvorana);
    const {loading,error,data}=useQuery(dohvatiSveDvorane);//nema varijabli querya,opcionalno dodat odabrano natjecanja pa dohvatit samo dvorane klubova iz tog natjecanja-> POTREBNO POVEZAT KLUBOVE I DVORANE U BAZI

    if(loading) return null;

    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(data)
    {
        return (
            <Fragment>
            <FormControl style={{width:'80%',margin:'0 auto'}}>
                                <Box align='right'><LocationOnIcon/></Box>
                                    <InputLabel >MJESTO I DVORANA</InputLabel>
                                    <Select disabled={(spremljenGameInfo)? true : false} value={(dvorana)? dvorana : ''} onChange={(e)=>dispatch(lokacijaOdabrana(e.target.value))} renderValue={(selected)=>(selected.dvorana+' '+selected.mjesto)} >
                                    {data.dvorane&&data.dvorane.map((dvorana)=><MenuItem key={dvorana.id} value={dvorana} ><Typography color='secondary'>{dvorana.dvorana+' '+dvorana.mjesto}</Typography></MenuItem>)}
                                    </Select>
                </FormControl>
            </Fragment>
        )
    }
}

export default SelectLokacija
