import React,{Fragment} from 'react'
import {spremiUtakmicu} from '../redux/slicers/spremiUtakmicu';
import {useDispatch,useSelector } from 'react-redux';
import {Button} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save';
function SpremiUtakmicuButton() {
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    function savedGameInfo()
    {
        //provjera svih polja
        //promjena stanja
        dispatch(spremiUtakmicu(true));
    }
    return (
       <Fragment>
           <Button disabled={(spremljenGameInfo)? true : false} onClick={()=>savedGameInfo()} title='Spremi utakmicu' disableRipple size='large' variant='contained' color='secondary' endIcon={<SaveIcon/>}>SAVE</Button> 
       </Fragment>
    )
}

export default SpremiUtakmicuButton
