import React,{Fragment} from 'react'
import {Typography,Box,Select,MenuItem,FormControl,InputLabel} from '@material-ui/core'
import {useDispatch,useSelector } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import {zapisnicarOdabran} from '../redux/slicers/zapisnicar';
import { useQuery } from '@apollo/client';
import {dohvatiSveZapisnicare} from '../graphql/query';
import Alert from '@material-ui/lab/Alert';
function SelectZapisnicar() {
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const zapisnicar=useSelector(state=>state.zapisnicar.odabraniZapisnicar);
    const {loading,error,data}=useQuery(dohvatiSveZapisnicare);

    if(loading) return null;

    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(data)
    {
        return (
            <Fragment>
                <FormControl style={{width:'80%',margin:'0 auto'}}>
                                <Box align='right'><EditIcon/></Box>
                                    <InputLabel >ZAPISNIČAR</InputLabel>
                                    <Select disabled={(spremljenGameInfo)? true : false} value={(zapisnicar)? zapisnicar : ''} renderValue={(zapisnicar)=>(zapisnicar.maticni_broj+' '+zapisnicar.ime+ ' '+zapisnicar.prezime)} onChange={(e)=>dispatch(zapisnicarOdabran(e.target.value))} >
                                    {data.zapisnicari&&data.zapisnicari.map((zapisnicar)=><MenuItem key={zapisnicar.maticni_broj} value={zapisnicar}><Typography color='secondary'>{zapisnicar.maticni_broj+' '+zapisnicar.ime+' '+zapisnicar.prezime}</Typography></MenuItem>)}
                                    </Select>
                    </FormControl>
            </Fragment>
        )
    }
}

export default SelectZapisnicar
