import React from 'react'
import {Grid,Box,Typography,GridList} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import Rezultat from './Rezultat';
const useStyles=makeStyles((theme)=>({
    containerBox:{
        borderColor:theme.palette.primary.main,
        borderStyle:'solid',
        marginTop:40
    },
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
//margin od grid liste će biti 20px gore i dole-> prvi clan u grid listi ima kao i svi clanovi padding=10 sto znaci da ce biti udaljen 30px od boxa sa kolom, a elementi grid liste će biti udaljeni 10 px medusobno
// kod zavrsetka grid liste-> ona je udaljena 20px od boxa iduceg kola-> stavimo margin od kolo boxa(ZA SVA KOLA OSIM ZA PRVO KOLO JER ONO NIJE UDALJENO OD NAZIVA LIGE) na 10px->linija 41 i dobijemo 30px kao i za gornji dio
//jedini problem-> zadnji grid od zadnjeg kola-> nema ispod sebe novi kolo box pa će imati samo marginBottom=20 umjesto 30-> stoga dolje u liniji 48 za zadnji rezultat zadnjeg kola dodajemo padding bottom 10px kako bi dobili tih dodatnih 10px
function LigaRezultatiBox({natjecanje,kola,history}) {
    const classes=useStyles();
    /*za prvi container od rezultata lige ne radimo marginu da nam se borderi od glavnog containera poklope */
    return (
        <Grid className={classes.containerBox} item container direction='column' justify='center' alignItems='center' xs={12}>{/*parent container koji vracamo*/}
                <Box className={classes.ligaNazivBox}>
                    <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>{natjecanje.naziv+' '+natjecanje.sezona}</Typography>
                </Box>    {/*za svako kolo vraćamo grid list sa svim rezultatima tog kola, ZNAMO DA ĆEMO PROPUSTIT ONA NATJECANJA KOJIMA SU KOLA!=null I IMAJU BAREM 1 ČLAN NIZA*/}
            {
                kola&&kola.map((rezultati_kola,index1)=>
                    (<React.Fragment key={rezultati_kola.kolo}>{/* za keyed fragmente moramo koristit ovu sintaksu
                                ZA SVE LABELE KOLA OSIM ZA PRVO KOLO(JER ONO NEMA GRIDLISTU IZNAD SEBE) STAVIMO MARGIN:10 KAO ŠTO IMA GRID LIST OD KOLO LABELE KAKO BI BILI U SYNCU-> TAKO ĆEMO ODRŽAVAT RAZMAK IZMEĐU KOLO LABELE I GRID LISTA IZNAD NJIH*/}
                        <Box style={{marginTop:(rezultati_kola.kolo>1)? 10 : 0}} className={classes.koloNazivBox}>
                            <Typography align='center' variant='h5' style={{color:'#FFFFFF'}}>{rezultati_kola.kolo+'.kolo'}</Typography>
                        </Box>
                            <GridList style={{width:'100%',marginTop:20,marginBottom:20}} cols={1} cellHeight={'auto'} spacing={20}>
                                {
                                    rezultati_kola.rezultati&&rezultati_kola.rezultati.map((rezultat,index2)=>(
                                        <Grid key={rezultat.broj_utakmice} item sm={8} xs={12} style={{margin:'auto',paddingBottom:(index1==(kola.length-1)&&index2==(rezultati_kola.rezultati.length-1))? 10 : 0 }}>
                                              <Rezultat history={history} broj_utakmice={rezultat.broj_utakmice} domaci={rezultat.domaci.naziv} gosti={rezultat.gosti.naziv} golovi_domaci={rezultat.rezultat_domaci} golovi_gosti={rezultat.rezultat_gosti} status={6} />
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
