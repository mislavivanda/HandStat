import React,{useState} from 'react'
import {Box,Typography,Button,Grid,TextField,FormControl,InputLabel} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import SportsIcon from '@material-ui/icons/Sports';
import CancelIcon from '@material-ui/icons/Cancel';
import GradeIcon from '@material-ui/icons/Grade';
import {ponistiZavrsetakUtakmice} from '../redux/slicers/zavrsiUtakmicu';
import { useSelector,useDispatch} from 'react-redux';
const useStyles=makeStyles((theme)=>({
    sudacImeBox:{
        display:'inline'
    }
}))
function SudacOcjena({history}) {
    //primamo history objekt kako bi nakon zavesetka i spremanja utakmice preusmjerili na home page sa history.replace
    const dispatch=useDispatch();
    const {sudac1,sudac2}=useSelector(state=>state.sudci);
    const [ocjena1,setOcjena1]=useState(1);
    const [ocjena2,setOcjena2]=useState(1);
    function handleChangeOcjena1(value)
    {
        setOcjena1(value);
    }
    function handleChangeOcjena2(value)
    {
        setOcjena2(value);
    }
    function spremiZavrsi()
    {
        //poziv useffecta i querya na bazu
        //OČISTI SVE GLOBAL STATEOVE OD STRANICE VOĐENJA STATISTIKE ODNOSNO POSTAVIT NA NULL
        //preusmjeri na homepage nakon uspješnog spremanja
        history.replace('/');
    }
    function ponistiZavrsi()//kada ne zelimo zavrsit utakmicu i unit ocjene sudaca
    {
        dispatch(ponistiZavrsetakUtakmice());
    }
    return (
       <Grid container direction='column' justify='space-evenly' alignItems='center' style={{marginTop:50}}>{/*glavni container od sudaca koji sadrzi 2 retka za unos ocjene*/}
            <Grid item container xs={12} direction='row' justify='space-around' alignItems='center'>
                <Typography color='secondary' align='center'variant='h6'>UNESITE OCJENE SUDACA</Typography>
            </Grid>
            <Grid item container direction='row' justify='space-around' alignItems='center' xs={12} style={{marginTop:20}}>{/*redak prvog suca*/}
                <Grid item container xs={12} sm={6} direction='row' justify='center' > 
                    <FormControl >
                            <Box align='right' ><SportsIcon/></Box>
                             <Box><Typography align='left' color='secondary'>SUDAC1</Typography> </Box>
                        <Typography variant='h6' color='secondary' align='center'>{sudac1.maticni_broj+' '+sudac1.ime+' '+sudac1.prezime}</Typography>
                    </FormControl>
                </Grid>
                <Grid item container xs={12} sm={6} direction='row' justify='center'>
                <FormControl style={{margin:'0 auto'}}>
                            <Box align='right' ><GradeIcon/></Box>
                                <InputLabel >OCJENA</InputLabel>
                                <TextField
                                type="number"
                                inputProps={{min:1,max:5, step:0.1}}
                                label=" "
                                value={ocjena1}
                                onChange={(e)=>handleChangeOcjena1(e.target.value)}
                                />
                </FormControl>
                </Grid>
            </Grid>
            <Grid item container direction='row' justify='space-around' alignItems='center' xs={12} style={{marginTop:20}}>{/*redak drugog suca*/}
                <Grid item container xs={12} sm={6} direction='row' justify='center' >
                    <FormControl >
                            <Box align='right' ><SportsIcon/></Box>
                             <Box><Typography align='left' color='secondary'>SUDAC2</Typography> </Box>
                        <Typography variant='h6' color='secondary' align='center'>{sudac2.maticni_broj+' '+sudac2.ime+' '+sudac2.prezime}</Typography>
                    </FormControl>
                </Grid>
                <Grid item container xs={12} sm={6} direction='row' justify='center'>
                <FormControl style={{margin:'0 auto'}}>
                            <Box align='right' ><GradeIcon/></Box>
                                <InputLabel>OCJENA</InputLabel>
                                <TextField
                                type="number" 
                                inputProps={{min:1,max:5, step:0.1}}
                                label=" "
                                value={ocjena2}
                                onChange={(e)=>handleChangeOcjena2(e.target.value)}
                                />
                </FormControl>
                </Grid>
            </Grid>
            <Grid item container spacing={3}  direction='row' justify='center' alginItems='center' xs={12}>
                <Grid container item direction='row' justify='flex-end' alginItems='center' xs={6}>
                    <Button  onClick={()=>spremiZavrsi()} disableRipple size='large' variant='contained' color='secondary' endIcon={<SaveIcon/>} title='Spremi i završi' >SPREMI</Button>
                </Grid>
                <Grid container item direction='row' justify='flex-start' alginItems='center' xs={6}>
                    <Button  onClick={()=>ponistiZavrsi()} disableRipple size='large' variant='contained' color='primary' endIcon={<CancelIcon/>} title='Otkaži spremanje' >OTKAŽI</Button>
                </Grid>
            </Grid>
       </Grid>
    )
}

export default SudacOcjena
