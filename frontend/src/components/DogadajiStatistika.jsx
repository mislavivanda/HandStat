import React,{Fragment} from 'react'
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import DogadajBox from '../components/Dogadaj.jsx';
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
function DogadajiStatistika({broj_utakmice}) {//inace preko useEffecta dohvat
    const classes=useStyles();
    const { loading, error, data } = useQuery(dohvatiSveDogadajeUtakmice,{
        variables:{
            broj_utakmice:broj_utakmice
        }
    });
    if(loading) return null;
    
    if(error) return (<Alert severity="error">{error.message}</Alert>)

    if(data)
    {
        return (
        <Fragment>
            <Box className={classes.tijekUtakmiceBox}>
                                {data.dogadajiutakmice&&data.dogadajiutakmice.map((dogadajutk)=>{
                                    if(dogadajutk.dogadaj.tip===1)
                                    {
                                        return <DogadajBox key={dogadajutk.dogadaj.id} aktivan={false} vrijeme={dogadajutk.vrijeme} klubikona={dogadajutk.tim} domaci={dogadajutk.rez_domaci} gosti={dogadajutk.rez_gosti} ime={dogadajutk.akter.ime} prezime={dogadajutk.akter.prezime} dogadaj={dogadajutk.dogadaj.naziv} tip={1} />
                                    }
                                    else if(dogadajutk.dogadaj.tip===2)
                                    {
                                        return <DogadajBox key={dogadajutk.dogadaj.id} aktivan={false} vrijeme={dogadajutk.vrijeme} klubikona={dogadajutk.tim} dogadaj={dogadajutk.dogadaj.naziv} tip={2}/>
                                    }
                                    else return <DogadajBox key={dogadajutk.dogadaj.id} aktivan={false} vrijeme={dogadajutk.vrijeme} klubikona={dogadajutk.tim} ime={dogadajutk.akter.ime} prezime={dogadajutk.akter.prezime} dogadaj={dogadajutk.dogadaj.naziv} tip={3}/>
                                })}
                </Box>
        </Fragment>
        )
    }
}

export default DogadajiStatistika
