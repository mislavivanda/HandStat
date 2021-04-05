import React,{Fragment} from 'react'
import {spremiUtakmicu} from '../redux/slicers/spremiUtakmicu';
import {useDispatch,useSelector } from 'react-redux';
import klub1 from '../images/zagreb.jpg';
import klub2 from '../images/barcelona.png';
import {slikaTimDomaci,slikaTimGosti} from '../redux/slicers/timovi';//spremanje slike kada je dohvatimo
import {Button} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save';
import { useMutation } from '@apollo/client';
import {dodajUtakmicu} from '../graphql/mutation';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
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

    const [spremiUtakmicaInfo,{loading,error}]=useMutation(dodajUtakmicu,{
        onCompleted:(data)=>{
            if(data.dodajutakmicu[0].id===timDomaci.id)
            {
                dispatch(slikaTimDomaci(klub1));//ovde ce ic slika iz dodajutakmicu[0] clana
                dispatch(slikaTimGosti(klub2));//ovde ce ic slika iz ddoajutakmuc[1] clana
            }
            else {//obrnut redoslijed
                dispatch(slikaTimDomaci(klub2));
                dispatch(slikaTimGosti(klub1));
            }
            dispatch(spremiUtakmicu(true));
        }
    });
    function savedGameInfo()
    {
        //provjera svih polja
        if(!natjecanje)
        {
            console.log('Odaberite natjecanje');
        }
        else if(!(brojUtakmice.length>0))//jer je inicijalno prazan string
        {
            console.log('Unesite broj utakmice');
        }
        else if(!dvorana)
        {
            console.log('Odaberite lokaciju');
        }
        else if(!(kolo>0))
        {
            console.log('Odaberite kolo');
        }
        else if(!(datum.length>0))
        {
            console.log('Odaberite datum');
        }
        else if(!(vrijeme.length>0))
        {
            console.log('Odaberite vrijeme');
        }
        else if(!nadzornik)
        {
            console.log('Odaberite nadzornika');
        }
        else if(!zapisnicar)
        {
            console.log('Odaberite zapisnicara');
        }
        else if((!sudac1))//mora odabrat barem jednog
        {
            console.log('Odaberite barem jednog sudca');
        }
        else if(!timDomaci)
        {
            console.log('Odaberite domaći tim');
        }
        else if(!timGosti)
        {
            console.log('Odaberite gostujući tim');
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

    if(error) return (<Alert severity="error">{error.message}</Alert>)
    
    return (
       <Fragment>
           <Button disabled={(spremljenGameInfo)? true : false} onClick={()=>savedGameInfo()} title='Spremi utakmicu' disableRipple size='large' variant='contained' color='secondary' endIcon={<SaveIcon/>}>SAVE</Button> 
       </Fragment>
    )
}

export default SpremiUtakmicuButton
