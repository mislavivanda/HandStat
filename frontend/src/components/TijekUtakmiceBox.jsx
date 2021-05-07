import React,{Fragment} from 'react'
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Dogadaj from './Dogadaj.jsx';
import {useSelector} from 'react-redux';
const useStyles=makeStyles((theme)=>({
    tijekUtakmiceBox:{
        display:'inline-flex',
        flexDirection:'column',
        borderColor:'#000000',
        borderStyle:'solid',
        backgroundColor:theme.palette.primary.main,
        width:'100%',
        minHeight:500
      }
}))
function TijekUtakmiceBox() {
    const classes=useStyles();
function RenderDogadajiUtakmice()
{
  const dogadajiUtakmice=useSelector(state=>state.dogadajiUtakmice);
  return (
    <Fragment>
      {
       (()=>{
         if(dogadajiUtakmice.length>0)//ako ima barem 1 događaj onda iscrtavamo inače vratimo null
          {
            return (
              dogadajiUtakmice.map((dogadaj)=>{
                if(dogadaj.tip===1)//dogadaji s akterom i promjenom rezultata-> golovi
                {                                                                                                               //klubikona ima vrijednost 1 ili 2 ovisno o tome je li dogadaj od odmacia ili gosta pa se ovisno o njemju dohvaća slika
                  return <Dogadaj key={dogadaj.id} aktivan={true} tip={dogadaj.tip} id={dogadaj.id} ime={dogadaj.ime} prezime={dogadaj.prezime} klubikona={dogadaj.klubikona} vrijeme={dogadaj.vrijeme} dogadaj={dogadaj.naziv_dogadaja} domaci={dogadaj.domaci} gosti={dogadaj.gosti}  />
                }
                else if(dogadaj.tip===2)//dogadaji bez promjene rezultata i bez aktera-> npr timeout domaci,gosti
                {
                  return <Dogadaj key={dogadaj.id} aktivan={true} tip={dogadaj.tip} id={dogadaj.id} vrijeme={dogadaj.vrijeme} klubikona={dogadaj.klubikona} dogadaj={dogadaj.naziv_dogadaja}  /> 
                }
                else {//dogadaji bez promjene rezultata npr iskljucenje,asistencija ali s akterom
                  return <Dogadaj key={dogadaj.id} aktivan={true} tip={dogadaj.tip} id={dogadaj.id} klubikona={dogadaj.klubikona} vrijeme={dogadaj.vrijeme} dogadaj={dogadaj.naziv_dogadaja} ime={dogadaj.ime} prezime={dogadaj.prezime}  />
                }
              })
            )
          }
          else return null;
      })()
      }
    </Fragment>
  )
}
    return (
        <Fragment>
             <Box className={classes.tijekUtakmiceBox}>
                {RenderDogadajiUtakmice()}
            </Box> {/* key={dogadaj.id}+ posalji ko prop id={dogadaj.id} da znamo na onClick koji dogadaj izbrisati*/}
        </Fragment>
    )
}

export default TijekUtakmiceBox
