import React,{useEffect} from 'react'
import {Grid,GridList, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Rezultat from './Rezultat';
import { useQuery} from '@apollo/client';
import {novaUtakmica,promjenaStatusa,promjenaVremena,promjenaRezultata} from '../graphql/subscription';
import { dohvatiLiveRezultate} from '../graphql/query';
import {postaviError} from '../redux/slicers/error';
import { useDispatch} from 'react-redux';
import ErrorDialog from '../components/ErrorDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useApolloClient } from '@apollo/client';
const useStyles=makeStyles((theme)=>({
    gridList:{
        width:'100%',
        height:300,
        borderStyle:'solid',
        borderColor:theme.palette.primary.main,
        borderWidth:2,
    },
    gridItem:{
        margin:'auto'
    }
}))
function RezultatiUzivoBox({history}) {
    const client = useApolloClient();//pristup apollo klijentu i njegovom cacheu
    const classes=useStyles();
    const dispatch=useDispatch();
    //dohvat svih live utakmica u trenutku pristupanja stranici
    const{data,loading,error,subscribeToMore,refetch}=useQuery(dohvatiLiveRezultate);

    const subscribeNovaUtakmica=()=>subscribeToMore({
        document:novaUtakmica,//indicates the subscription to execute.
        /* is a function that tells Apollo Client how to combine the query's currently cached result (prev)
         with the subscriptionData that's pushed by our GraphQL server. The return value of this function 
         completely replaces the current cached result for the query. */
        updateQuery:(prev,{ subscriptionData })=>{
            if (!subscriptionData.data) return prev;//ako smo primili null-> vratimo prethodno stanje u cacheu
            //inace dodamo novu utakmicu u cache
            let noviNiz=[];
            for(let i=0;i<prev.rezultatiuzivo.length;i++)
            noviNiz.push(prev.rezultatiuzivo[i]);
            noviNiz.push(subscriptionData.data.novautakmica);
            return {
                rezultatiuzivo:noviNiz
            }
        }
    });
    const subscribePromjenaStatusa=()=>subscribeToMore({
        document:promjenaStatusa,
        updateQuery:(prev,{subscriptionData})=>{
            if (!subscriptionData.data) return prev;
            var noviNiz;
            if(subscriptionData.data.promjenastatusa.status===6)//gotova utakmica,nema sedmeraca dodatnih-> izbrisi je
            {
                //izbrisi zadanu utakmicu/rezultat
                noviNiz=prev.rezultatiuzivo.filter((rezultat)=>rezultat.broj_utakmice!==subscriptionData.data.promjenastatusa.broj_utakmice);
            }
            else {
                noviNiz=prev.rezultatiuzivo.map((rezultat)=>{
                    if(rezultat.broj_utakmice===subscriptionData.data.promjenastatusa.broj_utakmice)//promijeni status zadane utakmice
                    {
                        return {//APOLLO CACHE JE IMMUTABLE-> NE MOŽEMO DIREKTNO MIJENJATI CACHE NEGO MORAMO STVORITI NOVU INJSTANCU
                            ...rezultat,
                            status:subscriptionData.data.promjenastatusa.status
                        };
                    }
                    else return rezultat;//u svakom slucaju vratimo rezultat
                });
            }
            return {
                rezultatiuzivo:noviNiz
            }
        }
    });
    const subscribePromjenaVremena=()=>subscribeToMore({
        document:promjenaVremena,
        updateQuery:(prev,{subscriptionData})=>{
            if (!subscriptionData.data) return prev;
            let noviNiz=prev.rezultatiuzivo.map((rezultat)=>{
                if(rezultat.broj_utakmice===subscriptionData.data.promjenavremena.broj_utakmice)//promjeni minutu od zadane utakmice/rezultata
                {
                    return {
                        ...rezultat,
                        minuta:subscriptionData.data.promjenavremena.minuta
                    }
                }
                else return rezultat;
            });
            return {
                rezultatiuzivo:noviNiz
            }
        }
    });
    const subscribePromjenaRezultata=()=>subscribeToMore({
        document:promjenaRezultata,
        updateQuery:(prev,{subscriptionData})=>{
            if (!subscriptionData.data) return prev;
            let noviNiz=prev.rezultatiuzivo.map((rezultat)=>{
                if(rezultat.broj_utakmice===subscriptionData.data.promjenarezultata.broj_utakmice)
                {
                    return {
                        ...rezultat,
                        rezultat_domaci:subscriptionData.data.promjenarezultata.rezultat_domaci,
                        rezultat_gosti:subscriptionData.data.promjenarezultata.rezultat_gosti
                    }
                }
                else return rezultat;
            });
            return {
                rezultatiuzivo:noviNiz
            }
        }
    })
    //kad se komponeneta mounta-> ubaci u DOM stablo-> to je na početku kod učitavanja komponenete
    //rerender(poziv render funkcije odnosno return donji) ne radi unmountanje komponenete-> on samo updatea stanje te dom komponenete
    //komponeneta se unmounta kod refresha npr ili kada odemo na novu stranicu pa više nije potrebna u virtual domu jer se konstruira novi
    useEffect(()=>{
        refetch();
          /*DA IZBJEGNEMO SLUČAJ SA DEFAUKT POLICYEN KOJI SAMO QUERYA PRMA CACHEU I AKO VIDI DA U CACHEU IMA PODATAKA NEĆE QUERYAT SERVER
        NPR KADA UĐEMO U UTAKMICU LIVE STTISTIKA PAGE I VRATIMO SE NAZAD ONDA JE PROBLEM ŠTO ĆE SE KORISTIT REZULTATI U CACHEU KOJI SU OSTALI OTKAD SMO UNMOUNTALI TU KOMPONENETU
        I OTIŠLI NA LIVE STATISTIKA PAGE-> KORISTIT ĆE SE STARI REZULTATI IZ CACHEA-> ŽELIMO PONOVO POSLAT ZAHTJEV NA SERVER DA PEJVJERIMO JELI SE DOGODILO IŠTA NOVO
        AKO SE DOGODILO ONDA ĆE SE RAZLIKOVAT PODACI U CACHEU I DOBIFENI OD SERVERA PA ĆE SE UPDATEAT TO JE TOČNO ŠTO OVO RADI*/
        subscribeNovaUtakmica();
        subscribePromjenaStatusa();
        subscribePromjenaVremena();
        subscribePromjenaRezultata();
    },[]);//ovaj useEffect će se pozvat samo prvi put kad se komponeneta mounta u dom stablo-> kod ucitavanja novih podataka će se komponenta rerenderat ali se neće maknit iz dom stabla
    /*Any associated subscriptions should be unsubscribed for you when the component unmounts.
     You shouldn't have to manually manage it unless you want to unsubscribe before then.-> automatski će se unsubscribeat nakon što se komponeneta unmounta-> ne trebamo raditi
     sa hookovima ekvivalent funkcije componentWillUnmount */

    if(loading) return  (<CircularProgress color='primary'/>)

    if(error)
    {
        dispatch(postaviError(true));//otvori popup
        return ( <ErrorDialog errorText={error.message}/>);
    }
    //inace ako su stigli podaci-> vrati grid listu
    if(data)
    {
        let rezultati=data&&data.rezultatiuzivo.map((rezultat)=>
            ({broj_utakmice:rezultat.broj_utakmice,
                    natjecanje:rezultat.natjecanje.naziv,
                    domaci:rezultat.domaci.naziv,
                    gosti:rezultat.gosti.naziv,
                    rezultat_domaci:rezultat.rezultat_domaci,
                    rezultat_gosti:rezultat.rezultat_gosti,
                    minuta:rezultat.minuta,
                    status:rezultat.status
                })
            );
        return (
                <GridList  className={classes.gridList} cols={1} cellHeight={50} spacing={20} >
                            {
                                //kad se promine propovi koje dajemo rezultat komponenti u odnosu na prethodne onda će se ona rerenderat
                            (rezultati)?
                            rezultati.map((rezultat)=>(
                                <Grid key={rezultat.broj_utakmice} item sm={8} xs={12} className={classes.gridItem}>
                                    <Rezultat history={history} broj_utakmice={rezultat.broj_utakmice}  natjecanje={rezultat.natjecanje} domaci={rezultat.domaci} gosti={rezultat.gosti} golovi_domaci={rezultat.rezultat_domaci} golovi_gosti={rezultat.rezultat_gosti} minuta={rezultat.minuta} status={rezultat.status}/>
                                </Grid>
                            ))
                            :
                            <Typography align='center' color='secondary'> TRENUTNO SE NE IGRA NIJEDNA UTAKMICA</Typography>
                            }
                    </GridList>
        )
    }
}

export default RezultatiUzivoBox
