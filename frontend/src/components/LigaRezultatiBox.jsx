import React from 'react'
import {Grid,Box,Typography,GridList} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Rezultat from './Rezultat';
const useStyles=makeStyles((theme)=>({
    ligaNazivBox:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        backgroundColor:theme.palette.primary.main
    },
    koloNazivBox:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        backgroundColor:theme.palette.secondary.main
    }
}))
function LigaRezultatiBox({natjecanje,kola,history,first}) {
    const classes=useStyles();
    /*za prvi container od rezultata lige ne radimo marginu da nam se borderi od glavnog containera poklope */
    return (
        <Grid style={{marginTop:(first)? 0 : 20}} item container direction='column' justify='center' alignItems='center' xs={12}>{/*parent container koji vracamo*/}
                <Box className={classes.ligaNazivBox}>
                    <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>{natjecanje.naziv+' '+natjecanje.sezona}</Typography>
                </Box>    {/*za svako kolo vraćamo grid list sa svim rezultatima tog kola, ZNAMO DA ĆEMO PROPUSTIT ONA NATJECANJA KOJIMA SU KOLA!=null I IMAJU BAREM 1 ČLAN NIZA*/}
            {
                kola&&kola.map((rezultati_kola)=>
                    (<React.Fragment key={rezultati_kola.kolo}>{/* za keyed fragmente moramo koristit ovu sintaksu
                                ZA SVE LABELE KOLA OSIM ZA PRVO KOLO(JER ONO NEMA GRIDLISTU IZNAD SEBE) STAVIMO MARGIN:20 KAO ŠTO IMA GRID LIST OD KOLO LABELE KAKO BI BILI U SYNCU-> TAKO ĆEMO ODRŽAVAT RAZMAK IZMEĐU KOLO LABELE I GRID LISTA IZNAD NJIH*/}
                        <Box style={{marginTop:(rezultati_kola.kolo>1)? 20 : 0}} className={classes.koloNazivBox}>
                            <Typography align='center' variant='h5' style={{color:'#FFFFFF',marginRight:'8%'}}>{rezultati_kola.kolo+'.kolo'}</Typography>
                        </Box>
                            <GridList style={{width:'100%',marginTop:20}} cols={1} cellHeight={50} spacing={20}>
                                {
                                    rezultati_kola.rezultati&&rezultati_kola.rezultati.map((rezultat)=>(
                                        <Grid key={rezultat.broj_utakmice} item sm={8} xs={12} style={{margin:'auto'}}>
                                              <Rezultat history={history} broj_utakmice={rezultat.broj_utakmice} domaci={rezultat.domaci.naziv} gosti={rezultat.gosti.naziv} golovi_domaci={rezultat.rezultat_domaci} golovi_gosti={rezultat.rezultat_gosti} status={5} />
                                        </Grid>)
                                    )
                                }
                            </GridList>
                    </React.Fragment>)
                    )
            }
        </Grid>

    )
}

export default LigaRezultatiBox
