import React from 'react'
import {Box,Button} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save';
import {zavrsiUtakmicu} from '../redux/slicers/zavrsiUtakmicu';
import {useSelector,useDispatch} from 'react-redux';
function ZavrsiUtakmicuButton() {
    const dispatch=useDispatch();
    const utakmicaZavrsena=useSelector(state=>state.zavrsiUtakmicu);
    function zavrsetakUtakmice()
    {
    //provjera jeli vrijeme na 60:00 došlo
    //ako jest zavrsi utakmicu odnosno ponudi mu unos ocjene sudaca i disable sve botune za vodenje utakmice
    dispatch(zavrsiUtakmicu());
    }
    return (
        <Box style={{marginTop:50}}>
              <Button disabled={utakmicaZavrsena} onClick={()=>zavrsetakUtakmice()} disableRipple size='large' variant='contained' color='primary' endIcon={<SaveIcon/>} title='Završi utakmicu' > ZAVRŠI</Button>
        </Box>
    )
}

export default ZavrsiUtakmicuButton
