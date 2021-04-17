import React,{Fragment,useState} from 'react'
import {spremiUtakmicu} from '../redux/slicers/spremiUtakmicu';
import {useDispatch,useSelector } from 'react-redux';
import {Button} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save';
import { useMutation } from '@apollo/client';
import {dodajUtakmicu} from '../graphql/mutation';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorDialog from './ErrorDialog';
import {postaviError} from '../redux/slicers/error';
function SpremiUtakmicuButton() {
    const dispatch=useDispatch();
    const spremljenGameInfo=useSelector(state=>state.spremiUtakmicu);
    const natjecanje=useSelector(state=>state.natjecanje.odabranoNatjecanje);
    const brojUtakmice=useSelector(state=>state.brojUtakmice);
    const dvorana=useSelector(state=>state.lokacija.mjestoDvorana);
    const kolo=useSelector(state=>state.kolo);
    const datum=useSelector(state=>state.datum);
    const vrijeme=useSelector(state=>state.vrijeme);
    const gledatelji=useSelector(state=>state.gledatelji);
    const nadzornik=useSelector(state=>state.nadzornik.odabraniNadzornik);
    const zapisnicar=useSelector(state=>state.zapisnicar.odabraniZapisnicar);
    const mjeracVremena=useSelector(state=>state.mjerac.odabraniMjerac);//nije obavezna
    const lijecnik=useSelector(state=>state.lijecnik.odabraniLijecnik);//nije obavezan
    const {sudac1,sudac2}=useSelector(state=>state.sudci);//1 sudac obavezan, drugi opcionalan
    const {timDomaci,timGosti}=useSelector(state=>state.timovi);
    const isError=useSelector((state)=>state.error);
    const [errorMessage,setErrorMessage]=useState('');//da znamo koji tekst poslati error dialogu
    const [spremiUtakmicaInfo,{loading,error}]=useMutation(dodajUtakmicu,{
        onCompleted:(data)=>{
            dispatch(spremiUtakmicu(true));
        },
        onError:(error)=>{
            setErrorMessage(error.message);
            dispatch(postaviError(true));
        }
    });
    function savedGameInfo()
    {
        //provjera svih polja
        if(!natjecanje)
        {
            setErrorMessage('Odaberite natjecanje');
            dispatch(postaviError(true));
        }
        else if(!(brojUtakmice.length>0))//jer je inicijalno prazan string
        {
            setErrorMessage('Unesite broj utakmice');
            dispatch(postaviError(true));
        }
        else if(!dvorana)
        {
            setErrorMessage('Odaberite lokaciju');
            dispatch(postaviError(true));
        }
        else if(!(kolo>0))
        {
            setErrorMessage('Odaberite kolo');
            dispatch(postaviError(true));
        }
        else if(!(datum.length>0))
        {
            setErrorMessage('Odaberite datum');
            dispatch(postaviError(true));
        }
        else if(!(vrijeme.length>0))
        {
            setErrorMessage('Odaberite vrijeme');
            dispatch(postaviError(true));
        }
        else if(!nadzornik)
        {
            setErrorMessage('Odaberite nadzornika');
            dispatch(postaviError(true));
        }
        else if(!zapisnicar)
        {
            setErrorMessage('Odaberite zapisnicara');
            dispatch(postaviError(true));
        }
        else if((!sudac1))//mora odabrat barem jednog
        {
            setErrorMessage('Odaberite barem jednog sudca');
            dispatch(postaviError(true));
        }
        else if(!timDomaci)
        {
            setErrorMessage('Odaberite domaći tim');
            dispatch(postaviError(true));
        }
        else if(!timGosti)
        {
            setErrorMessage('Odaberite gostujući tim');
            dispatch(postaviError(true));
        }
        else {
            spremiUtakmicaInfo({
                variables:{
                    broj_utakmice:brojUtakmice,
                    kolo:kolo,
                    datum:datum,
                    vrijeme:vrijeme,
                    gledatelji:gledatelji,
                    natjecanje_id:natjecanje.id,
                    dvorana_id:dvorana.id,
                    nadzornik_id:nadzornik.maticni_broj,
                    lijecnik_id:(lijecnik)? lijecnik.maticni_broj : null,//jer nije obavezan
                    zapisnicar_id:zapisnicar.maticni_broj,
                    mjvremena_id:(mjeracVremena)? mjeracVremena.maticni_broj : null,
                    sudac1_id:(sudac1)? sudac1.maticni_broj : null,
                    sudac2_id:(sudac2)? sudac2.maticni_broj : null,
                    timdomaci_id:timDomaci.id,
                    timgosti_id:timGosti.id
                }
            });
        }
    }

    if(loading) return <CircularProgress color='primary'/>

    
    return (
       <Fragment>
           <Button disabled={(spremljenGameInfo)? true : false} onClick={()=>savedGameInfo()} title='Spremi utakmicu' disableRipple size='large' variant='contained' color='secondary' endIcon={<SaveIcon/>}>SAVE</Button> 
           {
            (isError&&errorMessage)?//u slicaju errora pozivamo poopup
            <ErrorDialog errorText={errorMessage}/>
            :
            null
           }
       </Fragment>
    )
}

export default SpremiUtakmicuButton
