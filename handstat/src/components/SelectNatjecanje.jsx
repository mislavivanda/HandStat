import React,{Fragment} from 'react'
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import {Typography,Box,Select,MenuItem,FormControl,InputLabel} from '@material-ui/core'
import {natjecanjeOdabir} from '../redux/slicers/natjecanje';
import {useDispatch,useSelector } from 'react-redux';
function SelectNatjecanje({natjecanja}) {//zasad saljemo props najtecanja inace cemo ih dobijat preko useeffecta
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const natjecanje=useSelector(state=>state.natjecanje.odabranoNatjecanje);
    return (
        <Fragment>
              <FormControl style={{width:'80%',margin:'0 auto'}}>
                    <Box align='right'><SportsHandballIcon/></Box>
                        <InputLabel >NATJECANJE</InputLabel>
                        <Select disabled={(spremljenGameInfo)? true : false} value={(natjecanje)? natjecanje : ''}  onChange={(e)=>dispatch(natjecanjeOdabir(e.target.value))} renderValue={(selected)=> selected.naziv} >
                        {natjecanja&&natjecanja.map((natjecanje)=><MenuItem key={natjecanje.id} value={natjecanje}><Typography color='secondary'>{natjecanje.naziv}</Typography></MenuItem>)}
                        </Select>
            </FormControl>
        </Fragment>
    )
}

export default SelectNatjecanje
