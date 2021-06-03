import React,{useState} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import {Snackbar} from '@material-ui/core'
import { useSelector} from 'react-redux';
const useStyles=makeStyles((theme)=>({
    snackbarContent:{
        backgroundColor:theme.palette.primary.main,
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    }
}))
function Welcome_component() {
    const classes=useStyles();
    const [open,setOpen]=useState(true);
    const user=useSelector((state)=>state.user);
    return (
      <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={()=>setOpen(false)}
      anchorOrigin={{vertical: 'top', horizontal: 'center'}}
      message={'Dobrodosli. Ispunite zapisnik utakmice i slijedite tok stranice.'}
      ContentProps={{
          className:classes.snackbarContent
      }}
      />
    )
}

export default Welcome_component
