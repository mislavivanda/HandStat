import React,{Fragment,useState} from 'react'
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import DogadajBox from '../components/Dogadaj.jsx';
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
function DogadajiStatistika({dogadajiUtakmice}) {//inace preko useEffecta dohvat
    const classes=useStyles();
    const [dogadaji,setDogadaji]=useState(dogadajiUtakmice);
    return (
     <Fragment>
          <Box className={classes.tijekUtakmiceBox}>
                              {dogadaji&&dogadaji.map((dogadaj)=>{
                                if(dogadaj.tip===1)
                                {
                                    return <DogadajBox key={dogadaj.id} aktivan={false} vrijeme={dogadaj.vrijeme} klubikona={dogadaj.klubgrb} domaci={dogadaj.domaci} gosti={dogadaj.gosti} ime={dogadaj.ime} prezime={dogadaj.prezime} dogadaj={dogadaj.naziv_dogadaja} tip={1} />
                                }
                                else if(dogadaj.tip===2)
                                {
                                    return <DogadajBox key={dogadaj.id} aktivan={false} vrijeme={dogadaj.vrijeme} klubikona={dogadaj.klubgrb} dogadaj={dogadaj.naziv_dogadaja} tip={2}/>
                                }
                                else return <DogadajBox key={dogadaj.id} aktivan={false} vrijeme={dogadaj.vrijeme} klubikona={dogadaj.klubgrb} ime={dogadaj.ime} prezime={dogadaj.prezime} dogadaj={dogadaj.naziv_dogadaja} tip={3}/>
                              })}
            </Box>
     </Fragment>
    )
}

export default DogadajiStatistika
