import React,{useEffect} from 'react'
import {Dialog,DialogContent, Typography,Button,Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import {adminLoginStatus} from '../redux/slicers/adminLogged';
import { useDispatch,useSelector } from 'react-redux';
import {postaviError} from '../redux/slicers/error';
const useStyles=makeStyles((theme)=>({
    naslovBox:{
        display:'flex',
        width:'100%',
        flexDirection:'row',
        alignItems:'center'
    },
    dialogPaper:{
        textAlign: 'center',
        borderRadius:"10px"
    }
}))
function ErrorDialog(props) {
    const classes=useStyles();
    const dispatch=useDispatch();
    const isOpen=useSelector((state)=>state.error);
    useEffect(()=>{//poziv kod mountanja da provjerimo slučaj kada je error vezan za istek session cookieja da setamo globalni state isLogged na false
        console.log('Errro dialog useffect');
        if(props.errorText==='Niste autorizirani za zadanu operaciju')
        dispatch(adminLoginStatus(false));
    },[]);
    return (
       <Dialog open={isOpen} classes={{paper: classes.dialogPaper}}>{/*ovo se primjenjuje na CSS paper komponente */}
           <DialogContent>
                <Box><Typography align='center'>{props.errorText}</Typography></Box>
                <Button style={{marginTop:10}} color='primary' variant='contained' size='large' onClick={()=>dispatch(postaviError(false))}>OK</Button>
           </DialogContent>
       </Dialog>
    )
}

export default ErrorDialog
