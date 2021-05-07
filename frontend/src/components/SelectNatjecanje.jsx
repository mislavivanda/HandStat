import React,{Fragment} from 'react'
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import {Typography,Box,Select,MenuItem,FormControl,InputLabel} from '@material-ui/core'
import {natjecanjeOdabir} from '../redux/slicers/natjecanje';
import {useDispatch,useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import {dohvatiSvaNatjecanja} from '../graphql/query';
import Alert from '@material-ui/lab/Alert';
function SelectNatjecanje() {
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const natjecanje=useSelector(state=>state.natjecanje.odabranoNatjecanje);
    const {loading,error,data}=useQuery(dohvatiSvaNatjecanja);//nema varijabli querya
    if(loading) return null;

    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(data)
    {
        return (
            <Fragment>
                <FormControl style={{width:'80%',margin:'0 auto'}}>
                        <Box align='right'><SportsHandballIcon/></Box>
                            <InputLabel >NATJECANJE</InputLabel>
                            <Select disabled={(spremljenGameInfo)? true : false} value={(natjecanje)? natjecanje : ''}  onChange={(e)=>dispatch(natjecanjeOdabir(e.target.value))} renderValue={(selected)=> (selected.naziv+' '+selected.sezona)} >
                            {data.natjecanja&&data.natjecanja.map((natjecanje)=><MenuItem key={natjecanje.id} value={natjecanje}><Typography color='secondary'>{natjecanje.naziv+' '+natjecanje.sezona}</Typography></MenuItem>)}
                            </Select>
                </FormControl>
            </Fragment>
        )
    }
}

export default SelectNatjecanje
