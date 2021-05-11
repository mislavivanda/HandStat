import React,{Fragment,useEffect} from 'react'
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import DogadajBox from '../components/Dogadaj.jsx';
import {noviDogadaj,brisiDogadaj} from '../graphql/subscription';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useQuery } from '@apollo/client';//hook za poziv querya
import {dohvatiSveDogadajeUtakmice} from '../graphql/query';
import Alert from '@material-ui/lab/Alert';
const useStyles=makeStyles((theme)=>({
    tijekUtakmiceBox:{
        display:'inline-flex',
        flexDirection:'column',
        borderColor:theme.palette.secondary.main,
        borderStyle:'solid',
        backgroundColor:theme.palette.primary.main,
        width:'100%',
        minHeight:500
      }
}))
function DogadajiStatistika({brojUtakmice,live}) {//inace preko useEffecta dohvat
    const classes=useStyles();
    const { loading, error, data,subscribeToMore,refetch } = useQuery(dohvatiSveDogadajeUtakmice,{
        variables:{
            broj_utakmice:brojUtakmice
        }
    });
    
    const subscribeNoviDogadaj=()=>subscribeToMore({
        document:noviDogadaj,
        variables:{
            broj_utakmice:brojUtakmice
        },
        updateQuery:(prev,{subscriptionData})=>{
            if(!subscriptionData.data) return prev;
            let noviNiz=[];
            console.log('Primljen dogadaj: '+JSON.stringify(subscriptionData.data));
            for(let i=0;i<prev.dogadajiutakmice.length;i++)
            noviNiz.push(prev.dogadajiutakmice[i]);
            noviNiz.push(subscriptionData.data.novidogadajutakmice);
            console.log('Novi niz: '+JSON.stringify(noviNiz));
            return {
                dogadajiutakmice:noviNiz
            }
        }

    });

    const subscribeBrisiDogadaj=()=>subscribeToMore({
        document:brisiDogadaj,
        variables:{
            broj_utakmice:brojUtakmice
        },
        updateQuery:(prev,{subscriptionData})=>{
            if(!subscriptionData.data) return prev;
            let noviNiz=[];
            console.log('Primljen dogadaj: '+JSON.stringify(subscriptionData.data));
            noviNiz=prev.dogadajiutakmice.filter((dogadaj)=>dogadaj.id!==subscriptionData.data.brisidogadajutakmice.id);
            console.log('Novi niz: '+JSON.stringify(noviNiz));
            return {
                dogadajiutakmice:noviNiz
            }
        }
    })
    useEffect(()=>{
        console.log('Usao u useeffect '+live);
        if(live)//ako je kod live prikaza onda se subscribamo, ako je staticki prikaz gotove utakmice onda nema subscriptiona
        {
            console.log('Usao u live dio');
            refetch();
            subscribeNoviDogadaj();
            subscribeBrisiDogadaj();
        }
    },[]);
    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(loading) return  (<CircularProgress color='primary'/>)

    if(data)
    {
        return (
        <Fragment>
            <Box className={classes.tijekUtakmiceBox}>
                                {data.dogadajiutakmice&&data.dogadajiutakmice.map((dogadajutk)=>{
                                    if(dogadajutk.dogadaj.tip===1)
                                    {
                                        return <DogadajBox key={dogadajutk.id} aktivan={false} vrijeme={dogadajutk.vrijeme} klubikona={dogadajutk.tim} domaci={dogadajutk.rez_domaci} gosti={dogadajutk.rez_gosti} ime={dogadajutk.akter.ime} prezime={dogadajutk.akter.prezime} dogadaj={dogadajutk.dogadaj.naziv} tip={1} />
                                    }
                                    else if(dogadajutk.dogadaj.tip===2)
                                    {
                                        return <DogadajBox key={dogadajutk.id} aktivan={false} vrijeme={dogadajutk.vrijeme} klubikona={dogadajutk.tim} dogadaj={dogadajutk.dogadaj.naziv} tip={2}/>
                                    }
                                    else return <DogadajBox key={dogadajutk.id} aktivan={false} vrijeme={dogadajutk.vrijeme} klubikona={dogadajutk.tim} ime={dogadajutk.akter.ime} prezime={dogadajutk.akter.prezime} dogadaj={dogadajutk.dogadaj.naziv} tip={3}/>
                                })}
                </Box>
        </Fragment>
        )
    }
}

export default DogadajiStatistika
