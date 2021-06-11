import React,{Fragment} from 'react'
import {Grid,Box,Typography} from '@material-ui/core';
import gol from '../images/handball_goal.jpg';
import {makeStyles} from '@material-ui/core/styles';
const useStyles=makeStyles((theme)=>({
    gol:{
        height:'auto',//width:100% i hegiht auto znaci da će za visinu slika zadrzati svoj apsect ratio(omjer width i hegiht) koji iznosi 1.5748 pa znamo kolika će bit visina slike u odnosu na sirinu parent containera jer je width slike=width containera(100%)
        width:'100%'
      },
      golGrid:{
        position:'absolute',
        marginTop:'3.8735%',//VAŽNOOOO!!!-> SVE MARGINE(TOP.BOTTOM,LEFT I RIGHT) SE RAĆUNAJU U ODNOSU NA WIDTH ELEMENTA, VIDIMO DA IVISNA PREĆKE ZAUZIMA 6.1% VISINE SLIKE ŠTO JE 3.8735% ŠIRINE
        width:'92.25%',/*kada odbijemo sirine 2 stative dobijemo oko 92% sirinu grida-> sirina 2 stative uzima 8% jer je slika sira ,a sirina prećke zauzima 10% jer je visina manja*/
        height:'93.9%'/*gol grid je position absolute pa se njegovi postoci odnose na prvi realtivno pozicionirani element-> to je glavni container od gola
        znamo da slika gola ima istu sirinu i visinu kao taj container, grid sa botunima nam treba biti visine slike-visina prećke s tim da se visina računa u odnosu na visinu parent containera koji ima istu visinu ko i slika gola
        -> znamo da prećka oduzima 6.1% visine gola odnosno containera pa stoga visina grida sa botunima mora biti 100-6.1=93.9% i pomaknuta s marginon za visinu precke(koja se kod margina racuna u odnosu na ŠIRINU) */
      },
      golPolje:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth:4,
        borderBottomColor:theme.palette.secondary.main,
        borderBottomStyle:'solid',
        borderRightWidth:4,
        borderRightColor:theme.palette.secondary.main,
        borderRightStyle:'solid',
        borderRadius:0,
        width:'100%',
        height:'100%',
        margin:0
      },
      lijeviGolPolje:{
        borderLeftWidth:4,
        borderLeftStyle:'solid',
        borderLeftColor:theme.palette.secondary.main
      },
      gornjiGolPolje:{
        borderTopWidth:4,
        borderTopColor:theme.palette.secondary.main,
        borderTopStyle:'solid'
      },
}))
function Gol_igrac_golman_prikaz({goloviobrane,odabir}) {//saljemo niz golova/obrana po pozicijama dobiven od servera + tip odabira(po idu) po kojen ćemo odlucit koj podakte prikazat
    const classes=useStyles();//niz sortiran uzlazno po pozicijama
    return (
       <Fragment>
            <img src={gol} alt='handball goal' className={classes.gol}/>
            <Grid className={classes.golGrid} item container direction='column'>{/*tablica*/}
                <Grid item container direction='row' xs>{/*redak*/}
                    <Grid item  xs>
                       <Box className={[classes.golPolje,classes.lijeviGolPolje,classes.gornjiGolPolje].join(' ')}>
                           {
                               (()=>{
                                   let pozicija1=goloviobrane.find((element)=>element.pozicija===1)
                                   if(pozicija1!==undefined)
                                   {
                                                                           //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                        if(odabir===1&&(((pozicija1.golovibranka7m+pozicija1.golovibrankaostali)!==0 || ((pozicija1.pokusajibranka7m+pozicija1.pokusajibrankaostali!==0)))))
                                        {
                                            return (
                                                <Fragment>
                                                    <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija1.golovibranka7m+pozicija1.golovibrankaostali}</Typography>
                                                    <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija1.pokusajibranka7m+pozicija1.pokusajibrankaostali}</Typography>
                                                </Fragment>
                                            )
                                        }
                                        else if(odabir===2&&((pozicija1.golovibranka7m!==0) || (pozicija1.pokusajibranka7m)))
                                        {
                                            return (
                                                <Fragment>
                                                    <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija1.golovibranka7m}</Typography>
                                                    <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija1.pokusajibranka7m}</Typography>
                                                </Fragment>
                                            )
                                        }
                                        else if(odabir===3&&((pozicija1.golovibrankaostali!==0) || (pozicija1.pokusajibrankaostali)))
                                        {
                                            return (
                                                <Fragment>
                                                    <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija1.golovibrankaostali}</Typography>
                                                    <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija1.pokusajibrankaostali}</Typography>
                                                </Fragment>
                                            )
                                        }
                                        else return null
                                    }
                                    else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={[classes.golPolje,classes.gornjiGolPolje].join(' ')}>
                       {
                                (()=>{
                                    let pozicija2=goloviobrane.find((element)=>element.pozicija===2);
                                    if(pozicija2!==undefined)
                                    {
                                    //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                     if(odabir===1&&(((pozicija2.golovibranka7m+pozicija2.golovibrankaostali)!==0 || ((pozicija2.pokusajibranka7m+pozicija2.pokusajibrankaostali!==0)))))
                                     {
                                         return (
                                             <Fragment>
                                                 <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija2.golovibranka7m+pozicija2.golovibrankaostali}</Typography>
                                                 <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija2.pokusajibranka7m+pozicija2.pokusajibrankaostali}</Typography>
                                             </Fragment>
                                         )
                                     }
                                     else if(odabir===2&&((pozicija2.golovibranka7m!==0) || (pozicija2.pokusajibranka7m)))
                                     {
                                         return (
                                             <Fragment>
                                                 <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija2.golovibranka7m}</Typography>
                                                 <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija2.pokusajibranka7m}</Typography>
                                             </Fragment>
                                         )
                                     }
                                     else if(odabir===3&&((pozicija2.golovibrankaostali!==0) || (pozicija2.pokusajibrankaostali)))
                                     {
                                         return (
                                             <Fragment>
                                                 <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija2.golovibrankaostali}</Typography>
                                                 <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija2.pokusajibrankaostali}</Typography>
                                             </Fragment>
                                         )
                                     }
                                     else return null
                                    }
                                    else return null;
                                 })()
                           }
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={[classes.golPolje,classes.gornjiGolPolje].join(' ')}>
                       {
                               (()=>{
                                let pozicija3=goloviobrane.find((element)=>element.pozicija===3);
                                if(pozicija3!==undefined)
                                {
                                   //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                    if(odabir===1&&(((pozicija3.golovibranka7m+pozicija3.golovibrankaostali)!==0 || ((pozicija3.pokusajibranka7m+pozicija3.pokusajibrankaostali!==0)))))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija3.golovibranka7m+pozicija3.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija3.pokusajibranka7m+pozicija3.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===2&&((pozicija3.golovibranka7m!==0) || (pozicija3.pokusajibranka7m)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija3.golovibranka7m}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija3.pokusajibranka7m}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===3&&((pozicija3.golovibrankaostali!==0) || (pozicija3.pokusajibrankaostali)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija3.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija3.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else return null
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                </Grid>
                <Grid item container direction='row' xs>
                     <Grid item  xs>
                       <Box className={[classes.golPolje,classes.lijeviGolPolje].join(' ')}>
                       {
                               (()=>{
                                let pozicija4=goloviobrane.find((element)=>element.pozicija===4);
                                if(pozicija4!==undefined)
                                {
                                   //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                    if(odabir===1&&(((pozicija4.golovibranka7m+pozicija4.golovibrankaostali)!==0 || ((pozicija4.pokusajibranka7m+pozicija4.pokusajibrankaostali!==0)))))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija4.golovibranka7m+pozicija4.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija4.pokusajibranka7m+pozicija4.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===2&&((pozicija4.golovibranka7m!==0) || (pozicija4.pokusajibranka7m)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija4.golovibranka7m}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija4.pokusajibranka7m}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===3&&((pozicija4.golovibrankaostali!==0) || (pozicija4.pokusajibrankaostali)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija4.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija4.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else return null
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija5=goloviobrane.find((element)=>element.pozicija===5);
                                if(pozicija5!==undefined)
                                {
                                   //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                    if(odabir===1&&(((pozicija5.golovibranka7m+pozicija5.golovibrankaostali)!==0 || ((pozicija5.pokusajibranka7m+pozicija5.pokusajibrankaostali!==0)))))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija5.golovibranka7m+pozicija5.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija5.pokusajibranka7m+pozicija5.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===2&&((pozicija5.golovibranka7m!==0) || (pozicija5.pokusajibranka7m)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija5.golovibranka7m}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija5.pokusajibranka7m}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===3&&((pozicija5.golovibrankaostali!==0) || (pozicija5.pokusajibrankaostali)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija5.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija5.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else return null
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija6=goloviobrane.find((element)=>element.pozicija===6);
                                if(pozicija6!==undefined)
                                {
                                   //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                    if(odabir===1&&(((pozicija6.golovibranka7m+pozicija6.golovibrankaostali)!==0 || ((pozicija6.pokusajibranka7m+pozicija6.pokusajibrankaostali!==0)))))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija6.golovibranka7m+pozicija6.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija6.pokusajibranka7m+pozicija6.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===2&&((pozicija6.golovibranka7m!==0) || (pozicija6.pokusajibranka7m)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija6.golovibranka7m}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija6.pokusajibranka7m}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===3&&((pozicija6.golovibrankaostali!==0) || (pozicija6.pokusajibrankaostali)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija6.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija6.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else return null
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                </Grid>
                <Grid item container direction='row' xs>
                     <Grid item  xs>
                       <Box className={[classes.golPolje,classes.lijeviGolPolje].join(' ')}>
                       {
                               (()=>{
                                let pozicija7=goloviobrane.find((element)=>element.pozicija===7);
                                if(pozicija7!==undefined)
                                {
                                   //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                    if(odabir===1&&(((pozicija7.golovibranka7m+pozicija7.golovibrankaostali)!==0 || ((pozicija7.pokusajibranka7m+pozicija7.pokusajibrankaostali!==0)))))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija7.golovibranka7m+pozicija7.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija7.pokusajibranka7m+pozicija7.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===2&&((pozicija7.golovibranka7m!==0) || (pozicija7.pokusajibranka7m)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija7.golovibranka7m}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija7.pokusajibranka7m}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===3&&((pozicija7.golovibrankaostali!==0) || (pozicija7.pokusajibrankaostali)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija7.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija7.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else return null
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija8=goloviobrane.find((element)=>element.pozicija===8);
                                if(pozicija8!==undefined)
                                {
                                   //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                    if(odabir===1&&(((pozicija8.golovibranka7m+pozicija8.golovibrankaostali)!==0 || ((pozicija8.pokusajibranka7m+pozicija8.pokusajibrankaostali!==0)))))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija8.golovibranka7m+pozicija8.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija8.pokusajibranka7m+pozicija8.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===2&&((pozicija8.golovibranka7m!==0) || (pozicija8.pokusajibranka7m)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija8.golovibranka7m}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija8.pokusajibranka7m}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===3&&((pozicija8.golovibrankaostali!==0) || (pozicija8.pokusajibrankaostali)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija8.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija8.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else return null
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija9=goloviobrane.find((element)=>element.pozicija===9);
                                if(pozicija9!==undefined)
                                {
                                   //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                    if(odabir===1&&(((pozicija9.golovibranka7m+pozicija9.golovibrankaostali)!==0 || ((pozicija9.pokusajibranka7m+pozicija9.pokusajibrankaostali!==0)))))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija9.golovibranka7m+pozicija9.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija9.pokusajibranka7m+pozicija9.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===2&&((pozicija9.golovibranka7m!==0) || (pozicija9.pokusajibranka7m)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija9.golovibranka7m}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija9.pokusajibranka7m}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else if(odabir===3&&((pozicija9.golovibrankaostali!==0) || (pozicija9.pokusajibrankaostali)))
                                    {
                                        return (
                                            <Fragment>
                                                <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija9.golovibrankaostali}</Typography>
                                                <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija9.pokusajibrankaostali}</Typography>
                                            </Fragment>
                                        )
                                    }
                                    else return null
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                </Grid>
            </Grid>
       </Fragment>
    )
}

export default Gol_igrac_golman_prikaz
