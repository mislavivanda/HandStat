import React,{Fragment,useState,useEffect} from 'react'
import {Grid,Typography,Box,Card,CardContent,CardMedia,CardActionArea,GridList} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import KlubRezultati from '../components/KlubRezultati';
import Rezultat from '../components/Rezultat';
import {dohvatiSveClanoveTima,dohvatiNajnovijeRezultateKluba} from '../graphql/query';
import { useLazyQuery } from '@apollo/client';
const useStyles=makeStyles((theme)=>({
    klubInfoBox:{
        borderBottomColor:theme.palette.primary.main,
        borderBottomStyle:'solid'
    },
    titulaNazivBox:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        backgroundColor:theme.palette.secondary.main,
        marginTop:50
    },
    klubIkona:{
        width:'100%',
        height:'auto'
    },
    loadingItem:{
        position:'fixed',
        top:'50%',
        left:'50%',
        transform: 'translate(-50%, -50%)'
    },
    alertItem:{
        position:'fixed',
        top:'50%',
        left:'50%',
        transform: 'translate(-50%, -50%)'
    },
    clanKlubaCard:{
        borderColor:theme.palette.primary.main,
        borderStyle:'solid'
    },
    clanKlubaCardContent:{
        backgroundColor:theme.palette.primary.main
    },
    clanKlubaCardMedia:{
        margin:'auto',
        paddingBottom:16,
        width:'95%',
        height:'auto',
        paddingTop:10,
        paddingBottom:10
    },
    infoGlavniBox:{
        backgroundColor:theme.palette.secondary.main,
    },
    infoBox:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:theme.palette.primary.main,
        borderRightColor:theme.palette.secondary.main,
        borderRightStyle:'solid',
        borderLeftColor:theme.palette.secondary.main,
        borderLeftStyle:'solid',
        margin:'1rem 0 1rem 0'
    },
    info:{
        width:'50%',
        borderColor:theme.palette.primary.main,
        borderStyle:'solid'
    }
}))
function Klub_info_page(props) {
    const classes=useStyles();
    const [klubID,setKlubID]=useState(null);
    useEffect(()=>{
        setKlubID(parseInt(props.match.params.klub_id));//NEPOTREBNO URI ENCODE I DECODE JER JE KLUB_ID UVIJEK INTEGER ZA RAZLIKU OD BORJA UTAKMICE KOJI MOŽE SADRŽAVAT \
        dohvatiClanove({
            variables:{
                klub_id:parseInt(props.match.params.klub_id)//ne mozemo koristit klubID jer se jos ne seta state,asinkrono
            }
        })
        dohvatiRezultate({
            variables:{
                klub_id:parseInt(props.match.params.klub_id)
            }
        })
    },[])
    //koistimo lazy jer čekamo da se postavi state od klubID dohvaćenog iz URL kako ne bi slali null
    const [dohvatiClanove,{data:clanoviTimaData,loading:clanoviTimaLoading,error:clanoviTimaError}]=useLazyQuery(dohvatiSveClanoveTima)
    const [dohvatiRezultate,{data:najnovijiRezultatiData,loading:najnovijiRezultatiLoading,error:najnovijiRezultatiError}]=useLazyQuery(dohvatiNajnovijeRezultateKluba);
    function handleGolmanCardClick(maticni_broj){
        props.history.push(`${props.history.location.pathname}`);
        let maticni_encoded=encodeURIComponent(maticni_broj)
        props.history.replace(`/golman/${klubID}/${maticni_encoded}`);
    }
    function handleIgracCardClick(maticni_broj){
        props.history.push(`${props.history.location.pathname}`);
        let maticni_encoded=encodeURIComponent(maticni_broj)
        props.history.replace(`/igrac/${klubID}/${maticni_encoded}`);
    }
    function handleStozerCardClick(maticni_broj){
        props.history.push(`${props.history.location.pathname}`);
        let maticni_encoded=encodeURIComponent(maticni_broj)
        props.history.replace(`/stozer/${klubID}/${maticni_encoded}`);
    }
    if(clanoviTimaLoading||najnovijiRezultatiLoading||!klubID||!(klubID&&najnovijiRezultatiData&&clanoviTimaData))//kad je klubid null ili se ucitava ili nisu stigli svi podaci i nije postavljen klubID
    {
        return (<CircularProgress className={classes.loadingItem} color='primary'/>)
    }
    if(clanoviTimaError||najnovijiRezultatiError)
    {
        return (<Alert className={classes.alertItem} severity="error">{(clanoviTimaError)? clanoviTimaError.message : najnovijiRezultatiError.message}</Alert>)
    }
    if(klubID&&najnovijiRezultatiData&&clanoviTimaData)//kad nije null klubid i podaci onda mozemo renderat i slat zahjteve u drugim komponeentama
    {
        return (
            <Grid container direction='column' justify='space-evenly' alignItems='center' style={{marginTop:100}}>{/*glavni container*/}
                 <Grid style={{marginTop:100}} item container direction='column' justify='space-evenly' alignItems='center'>{/*container od podataka kluba, grba i odabira rezultata */}
                    <Grid item container direction='column' justify='center' alignItems='center' xs={12} sm={4}>{/*container od ikone kluba i naziva*/}
                            <Grid item xs={12}>
                                <Typography align='center' color='secondary'  variant='h4'>RK PPD ZAGREB</Typography>
                            </Grid>
                            <img className={classes.klubIkona} src={"http://localhost:3001/zagreb.jpg"} alt="grb kluba"/>
                    </Grid>
                     <Grid item container direction='row' justify='space-around' alignItems='center' xs={12}>{/*contaienr od podataka kluba + komponente za rezultate*/}
                         <Grid className={classes.infoGlavniBox} item container direction='column' justify='space-evenly' alignItems='flex-start' xs={12} sm={5}>{/*container s informacijama o klubu*/}
                            <Grid item style={{width:'100%'}}>
                                        <Box className={classes.infoBox}>
                                            <Box style={{width:'50%'}}>
                                                <Typography style={{color:'#FFFFFF'}} variant='h6'>DRŽAVA</Typography>
                                            </Box>
                                            <Box className={classes.info}>
                                                <Typography style={{color:'#FFFFFF'}} variant='h5'>SJEDINJENE AMERIČKE DRŽAVE(SAD)</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item style={{width:'100%'}}>
                                    <Box className={classes.infoBox}>
                                        <Box style={{width:'50%'}}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h6'>DATUM OSNUTKA</Typography>
                                        </Box>
                                        <Box className={classes.info}>
                                            <Typography style={{color:'#FFFFFF'}} variant='h5'>22.05.1978.</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                         </Grid>
                         <Grid item xs={12} sm={5}>
                            <KlubRezultati klub_id={klubID}/>
                        </Grid>
                     </Grid>
                 </Grid>
                 {(()=>{
                      if(clanoviTimaLoading)
                      {
                          return (<CircularProgress className={classes.loadingItem} color='primary'/>)
                      }
                      if(clanoviTimaError)
                      {
                         return (<Alert className={classes.alertItem} severity="error">{clanoviTimaError.message}</Alert>)
                      }
                      if(clanoviTimaData)
                      {
                          return (
                              <Fragment>
                                 <Box className={classes.titulaNazivBox}>
                                     <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>GOLMANI</Typography>
                                 </Box>
                                 <Grid container spacing={5} direction='row' justify='center' alignItems='center' style={{ marginTop:50}}>
                                     {
                                         clanoviTimaData&&clanoviTimaData.timclanovi.golmani.map((golman)=>(
                                         <Grid item key={golman.maticni_broj} xs={6} sm={4} md={3}>
                                             <Card className={classes.clanKlubaCard} onClick={(e)=>handleGolmanCardClick(golman.maticni_broj)}>
                                                 <CardContent className={classes.clanKlubaCardContent}>
                                                     <Box>
                                                         <Typography align='center' style={{color:'#FFFFFF'}} variant='h5'>{golman.ime}</Typography>
                                                     </Box>
                                                     <Box>
                                                         <Typography align='center' style={{color:'#FFFFFF'}} variant='h5'>{golman.prezime}</Typography>
                                                     </Box>
                                                 </CardContent>
                                                 <CardActionArea>
                                                     <CardMedia
                                                     className={classes.clanKlubaCardMedia}
                                                     component='img'
                                                     image={(golman.image_path)? golman.image_path : 'http://localhost:3001/unknownclubimage.jpg'}
                                                     />
                                                 </CardActionArea>
                                             </Card>
                                         </Grid>
                                         ))
                                     }
                                 </Grid>
                                 <Box className={classes.titulaNazivBox}>
                                         <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>IGRAČI</Typography>
                                 </Box>
                                 <Grid container spacing={5} direction='row' justify='center' alignItems='center'  style={{ marginTop:50}}>
                                     {
                                         clanoviTimaData&&clanoviTimaData.timclanovi.igraci.map((igrac)=>(
                                         <Grid item key={igrac.maticni_broj} xs={6} sm={4} md={3}>
                                             <Card className={classes.clanKlubaCard} onClick={(e)=>handleIgracCardClick(igrac.maticni_broj)}>
                                                 <CardContent className={classes.clanKlubaCardContent}>
                                                     <Box>
                                                         <Typography align='center' style={{color:'#FFFFFF'}} variant='h5'>{igrac.ime}</Typography>
                                                     </Box>
                                                     <Box>
                                                         <Typography align='center' style={{color:'#FFFFFF'}} variant='h5'>{igrac.prezime}</Typography>
                                                     </Box>
                                                 </CardContent>
                                                 <CardActionArea>
                                                     <CardMedia
                                                     className={classes.clanKlubaCardMedia}
                                                     component='img'
                                                     image={(igrac.image_path)? igrac.image_path : 'http://localhost:3001/unknownclubimage.jpg'}
                                                     />
                                                 </CardActionArea>
                                             </Card>
                                         </Grid>
                                         ))
                                     }
                                 </Grid>
                                 <Box className={classes.titulaNazivBox}>
                                         <Typography align='center' variant='h4' style={{color:'#FFFFFF'}}>STRUČNI STOŽER</Typography>
                                 </Box>
                                 <Grid container spacing={5} direction='row' justify='center' alignItems='center'  style={{ marginTop:50}}>
                                     {
                                         //povezat nizove trenera,tehnika,fizia i sluzbenih preedstavnika u 1 da ne moramo mapirat za svaki niz 4 puta
                                         (()=>{
                                             let stozer_niz=[...clanoviTimaData.timclanovi.treneri,...clanoviTimaData.timclanovi.sluzbenipredstavnici,...clanoviTimaData.timclanovi.tehniko,...clanoviTimaData.timclanovi.fizio];
                                             return stozer_niz.map((stozer)=>(
                                                 <Grid item key={stozer.maticni_broj} xs={6} sm={4} md={3}>
                                                     <Card className={classes.clanKlubaCard} onClick={(e)=>handleStozerCardClick(stozer.maticni_broj)}>
                                                         <CardContent className={classes.clanKlubaCardContent}>
                                                             <Box>
                                                                 <Typography align='center' style={{color:'#FFFFFF'}} variant='h5'>{stozer.ime}</Typography>
                                                             </Box>
                                                             <Box>
                                                                 <Typography align='center' style={{color:'#FFFFFF'}} variant='h5'>{stozer.prezime}</Typography>
                                                             </Box>
                                                         </CardContent>
                                                         <CardActionArea>
                                                             <CardMedia
                                                             className={classes.clanKlubaCardMedia}
                                                             component='img'
                                                             image={(stozer.image_path)? stozer.image_path : 'http://localhost:3001/unknownclubimage.jpg'}
                                                             />
                                                         </CardActionArea>
                                                     </Card>
                                                 </Grid>
                                                 ))
                                         })()
                                     }
                                     {
                                         (()=>{
                                             if(najnovijiRezultatiLoading)
                                             {
                                                 return (<CircularProgress className={classes.loadingItem} color='primary'/>)
                                             }
                                             if(najnovijiRezultatiError)
                                             {
                                                 return (<Alert severity="error">{najnovijiRezultatiError.message}</Alert>)
                                             }
                                             if(najnovijiRezultatiData)
                                             {
                                                 return (
                                                     <Grid item container direction='column' justify='center' alignItems='center' xs={12}>
                                                          <Box className={classes.titulaNazivBox}>
                                                             <Typography align='center' variant='h5' style={{color:'#FFFFFF'}}>NAJNOVIJI REZULTATI</Typography>
                                                         </Box>
                                                         <GridList style={{width:'100%',marginTop:50,marginBottom:50, height:300}} cols={1} cellHeight={'auto'} spacing={20}>
                                                         {
                                                             najnovijiRezultatiData.najnovijeutakmicekluba&&najnovijiRezultatiData.najnovijeutakmicekluba.map((rezultat)=>(
                                                                 <Grid key={rezultat.broj_utakmice} item sm={8} xs={12} style={{margin:'auto'}}>
                                                                 <Rezultat history={props.history} broj_utakmice={rezultat.broj_utakmice} najtecanje={rezultat.natjecanje.naziv} domaci={rezultat.domaci.naziv} gosti={rezultat.gosti.naziv} golovi_domaci={rezultat.rezultat_domaci} golovi_gosti={rezultat.rezultat_gosti} status={6} />
                                                                 </Grid>
                                                             ))
                                                         }
                                                         </GridList>
                                                        </Grid>
                                                 )
                                             }
                                         })()
                                     }
                                 </Grid>
                              </Fragment>
                          )
                      }
                 })()
                 }
            </Grid>
         )
    }
}

export default Klub_info_page
