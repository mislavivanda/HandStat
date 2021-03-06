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
        marginTop:'3.75%',//VAŽNOOOO!!!-> SVE MARGINE(TOP.BOTTOM,LEFT I RIGHT) SE RAĆUNAJU U ODNOSU NA WIDTH ELEMENTA, VIDIMO DA IVISNA PREĆKE ZAUZIMA 5.9055...% VISINE SLIKE ŠTO JE 3.75% ŠIRINE parenta(podijelit s apsect ratio)
        width:'92.25%',/*kada odbijemo sirine 2 stative dobijemo oko 92% sirinu grida-> sirina 2 stative uzima 8% jer je slika sira ,a sirina prećke zauzima 10% jer je visina manja*/
        height:'94.0945%',/*gol grid je position absolute pa se njegovi postoci odnose na prvi realtivno pozicionirani element-> to je glavni container od gola
        znamo da slika gola ima istu sirinu i visinu kao taj container, grid sa botunima nam treba biti visine slike-visina prećke s tim da se visina računa u odnosu na visinu parent containera koji ima istu visinu ko i slika gola
        -> znamo da prećka oduzima 5.9055% visine gola odnosno containera pa stoga visina grida sa botunima mora biti 100-5.9055=94.0945% i pomaknuta s marginon za visinu precke(koja se kod margina racuna u odnosu na ŠIRINU) */
        borderBottomWidth:4,
        borderBottomColor:theme.palette.secondary.main,
        borderBottomStyle:'solid',
        borderLeftWidth:4,
        borderLeftStyle:'solid',
        borderLeftColor:theme.palette.secondary.main,
        boxSizing:'border-box'//s ovim smo rekli da zelimo da nam cijela sirina i visina grida s botunima zajedno sa gornjim i lijevim borerom bude ista prostoru unutar slike
    },
      golPolje:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:'100%',
        margin:0
      },
      svakiGolPolje:{//ovo primjenjujemo na svaki grid item-> svaki gird item ce imat 1/3 sirine retka-> zelimo da unutar te sirine i visine budu uracunate i gornji i desni border
        //kako svako polje ima top i right border onda će imat i isti content box size jer će se svima od ukupne sirine i visine oduzet 4 gore i 4 desno-> to i zelimo-> da bijeLa podrucja budu iste velicine
        //content size od gornjeg grida će biti CIJELI DIO BEZ DONJEG I LIJEVOG BORDERA-> TAMAN UNUTAR TOG DIJELA STAVLJAMO NAŠE RETKE KOJI ĆE IMAT 1/3 ŠIRINE I VISINE I KOJI ĆE UNUTAR TIH MJERA DODAT GORNJI I DESNI BORDER PREKO GRID ITEMA
        //-> VISINA SVAKOG RETKA SA SADRZAJEM I BORDEROM ĆE BIT 1/3 VISINE TOG PROSTORA, A SIRINA ĆE BIT 1/3 SIRINE TOG PROSTORA U KOJI JE URACUNAT I DESNI BORDER-> SVI RETCI I CLANOVI REDAKA SU ISTI
        boxSizing:'border-box',
        borderTopWidth:4,
        borderTopColor:theme.palette.secondary.main,
        borderTopStyle:'solid',
        borderRightWidth:4,
        borderRightColor:theme.palette.secondary.main,
        borderRightStyle:'solid',
        borderRadius:0
      }
}))
function Gol_igrac_golman_prikaz({goloviobrane,odabir,isIgrac}) {//saljemo niz golova/obrana po pozicijama dobiven od servera + tip odabira(po idu) po kojen ćemo odlucit koj podakte prikazat
    const classes=useStyles();//niz sortiran uzlazno po pozicijama
    console.log('Primljeni golovi obrane: '+JSON.stringify(goloviobrane));
    return (
       <Fragment>
            <img src={gol} alt='handball goal' className={classes.gol}/>
            <Grid className={classes.golGrid} item container direction='column'>{/*tablica*/}
                <Grid item container direction='row' xs style={{height:'33.33%'}}>{/*redak*/}
                    <Grid item  xs={4} className={classes.svakiGolPolje} >
                       <Box className={classes.golPolje}>
                           {
                               (()=>{
                                   let pozicija1=goloviobrane.find((element)=>element.pozicija===1)
                                   if(pozicija1!==undefined)
                                   {
                                       if(isIgrac)//ovisno je li igrac ili golman koristimo drukcije atribute
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
                                       else {
                                        //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                            if(odabir===1&&(((pozicija1.obranebranka7m+pozicija1.obranebrankaostali)!==0 || ((pozicija1.primljenibranka7m+pozicija1.primljenibrankaostali!==0)))))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija1.obranebranka7m+pozicija1.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija1.obranebranka7m+pozicija1.obranebrankaostali+pozicija1.primljenibranka7m+pozicija1.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===2&&((pozicija1.obranebranka7m!==0) || (pozicija1.primljenibranka7m)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija1.obranebranka7m}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija1.obranebranka7m+pozicija1.primljenibranka7m}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===3&&((pozicija1.obranebrankaostali!==0) || (pozicija1.primljenibrankaostali)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija1.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija1.obranebrankaostali+pozicija1.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else return null                                          
                                       }
                                    }
                                    else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                    <Grid item className={classes.svakiGolPolje}  xs={4}>
                       <Box className={classes.golPolje}>
                       {
                                (()=>{
                                    let pozicija2=goloviobrane.find((element)=>element.pozicija===2);
                                    if(pozicija2!==undefined)
                                    {
                                        if(isIgrac)
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
                                        else {
                                            //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                                if(odabir===1&&(((pozicija2.obranebranka7m+pozicija2.obranebrankaostali)!==0 || ((pozicija2.primljenibranka7m+pozicija2.primljenibrankaostali!==0)))))
                                                {
                                                    return (
                                                        <Fragment>
                                                            <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija2.obranebranka7m+pozicija2.obranebrankaostali}</Typography>
                                                            <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija2.obranebranka7m+pozicija2.obranebrankaostali+pozicija2.primljenibranka7m+pozicija2.primljenibrankaostali}</Typography>
                                                        </Fragment>
                                                    )
                                                }
                                                else if(odabir===2&&((pozicija2.obranebranka7m!==0) || (pozicija2.primljenibranka7m)))
                                                {
                                                    return (
                                                        <Fragment>
                                                            <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija2.obranebranka7m}</Typography>
                                                            <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija2.obranebranka7m+pozicija2.primljenibranka7m}</Typography>
                                                        </Fragment>
                                                    )
                                                }
                                                else if(odabir===3&&((pozicija2.obranebrankaostali!==0) || (pozicija2.primljenibrankaostali)))
                                                {
                                                    return (
                                                        <Fragment>
                                                            <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija2.obranebrankaostali}</Typography>
                                                            <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija2.obranebrankaostali+pozicija2.primljenibrankaostali}</Typography>
                                                        </Fragment>
                                                    )
                                                }
                                                else return null                                          
                                           }                                       
                                    }
                                    else return null;
                                 })()
                           }
                       </Box>
                    </Grid>
                    <Grid item className={classes.svakiGolPolje}  xs={4}>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija3=goloviobrane.find((element)=>element.pozicija===3);
                                if(pozicija3!==undefined)
                                {
                                    if(isIgrac)
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
                                    else {
                                        //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                            if(odabir===1&&(((pozicija3.obranebranka7m+pozicija3.obranebrankaostali)!==0 || ((pozicija3.primljenibranka7m+pozicija3.primljenibrankaostali!==0)))))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija3.obranebranka7m+pozicija3.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija3.obranebranka7m+pozicija3.obranebrankaostali+pozicija3.primljenibranka7m+pozicija3.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===2&&((pozicija3.obranebranka7m!==0) || (pozicija3.primljenibranka7m)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija3.obranebranka7m}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija3.obranebranka7m+pozicija3.primljenibranka7m}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===3&&((pozicija3.obranebrankaostali!==0) || (pozicija3.primljenibrankaostali)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija3.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija3.obranebrankaostali+pozicija3.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else return null                                          
                                       }                                      
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                </Grid>
                <Grid item container direction='row' xs style={{height:'33.33%'}}>
                     <Grid item className={classes.svakiGolPolje}  xs>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija4=goloviobrane.find((element)=>element.pozicija===4);
                                if(pozicija4!==undefined)
                                {
                                    if(isIgrac)
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
                                    else {
                                        //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                            if(odabir===1&&(((pozicija4.obranebranka7m+pozicija4.obranebrankaostali)!==0 || ((pozicija4.primljenibranka7m+pozicija4.primljenibrankaostali!==0)))))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija4.obranebranka7m+pozicija4.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija4.obranebranka7m+pozicija4.obranebrankaostali+pozicija4.primljenibranka7m+pozicija4.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===2&&((pozicija4.obranebranka7m!==0) || (pozicija4.primljenibranka7m)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija4.obranebranka7m}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija4.obranebranka7m+pozicija4.primljenibranka7m}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===3&&((pozicija4.obranebrankaostali!==0) || (pozicija4.primljenibrankaostali)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija4.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija4.obranebrankaostali+pozicija4.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else return null                                          
                                       }   
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                    <Grid item  xs className={classes.svakiGolPolje}>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija5=goloviobrane.find((element)=>element.pozicija===5);
                                if(pozicija5!==undefined)
                                {
                                    if(isIgrac)
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
                                    else {
                                        //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                            if(odabir===1&&(((pozicija5.obranebranka7m+pozicija5.obranebrankaostali)!==0 || ((pozicija5.primljenibranka7m+pozicija5.primljenibrankaostali!==0)))))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija5.obranebranka7m+pozicija5.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija5.obranebranka7m+pozicija5.obranebrankaostali+pozicija5.primljenibranka7m+pozicija5.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===2&&((pozicija5.obranebranka7m!==0) || (pozicija5.primljenibranka7m)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija5.obranebranka7m}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija5.obranebranka7m+pozicija5.primljenibranka7m}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===3&&((pozicija5.obranebrankaostali!==0) || (pozicija5.primljenibrankaostali)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija5.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija5.obranebrankaostali+pozicija5.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else return null                                          
                                       }   
                                    
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                    <Grid item  xs className={classes.svakiGolPolje}>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija6=goloviobrane.find((element)=>element.pozicija===6);
                                if(pozicija6!==undefined)
                                {
                                    if(isIgrac)
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
                                    else {
                                        //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                            if(odabir===1&&(((pozicija6.obranebranka7m+pozicija6.obranebrankaostali)!==0 || ((pozicija6.primljenibranka7m+pozicija6.primljenibrankaostali!==0)))))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija6.obranebranka7m+pozicija6.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija6.obranebranka7m+pozicija6.obranebrankaostali+pozicija6.primljenibranka7m+pozicija6.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===2&&((pozicija6.obranebranka7m!==0) || (pozicija6.primljenibranka7m)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija6.obranebranka7m}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija6.obranebranka7m+pozicija6.primljenibranka7m}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===3&&((pozicija6.obranebrankaostali!==0) || (pozicija6.primljenibrankaostali)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija6.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija6.obranebrankaostali+pozicija6.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else return null                                          
                                       }   
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                </Grid>
                <Grid item container direction='row' xs style={{height:'33.33%'}}>
                     <Grid item  xs className={classes.svakiGolPolje}>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija7=goloviobrane.find((element)=>element.pozicija===7);
                                if(pozicija7!==undefined)
                                {
                                    if(isIgrac)
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
                                    else {
                                        //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                            if(odabir===1&&(((pozicija7.obranebranka7m+pozicija7.obranebrankaostali)!==0 || ((pozicija7.primljenibranka7m+pozicija7.primljenibrankaostali!==0)))))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija7.obranebranka7m+pozicija7.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija7.obranebranka7m+pozicija7.obranebrankaostali+pozicija7.primljenibranka7m+pozicija7.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===2&&((pozicija7.obranebranka7m!==0) || (pozicija7.primljenibranka7m)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija7.obranebranka7m}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija7.obranebranka7m+pozicija7.primljenibranka7m}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===3&&((pozicija7.obranebrankaostali!==0) || (pozicija7.primljenibrankaostali)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija7.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija7.obranebrankaostali+pozicija7.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else return null                                          
                                       }                                   
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                    <Grid item  xs className={classes.svakiGolPolje}>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija8=goloviobrane.find((element)=>element.pozicija===8);
                                if(pozicija8!==undefined)
                                {
                                    if(isIgrac)
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
                                    else {
                                        //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                            if(odabir===1&&(((pozicija8.obranebranka7m+pozicija8.obranebrankaostali)!==0 || ((pozicija8.primljenibranka7m+pozicija8.primljenibrankaostali!==0)))))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija8.obranebranka7m+pozicija8.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija8.obranebranka7m+pozicija8.obranebrankaostali+pozicija8.primljenibranka7m+pozicija8.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===2&&((pozicija8.obranebranka7m!==0) || (pozicija8.primljenibranka7m)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija8.obranebranka7m}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija8.obranebranka7m+pozicija8.primljenibranka7m}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===3&&((pozicija8.obranebrankaostali!==0) || (pozicija8.primljenibrankaostali)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija8.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija8.obranebrankaostali+pozicija8.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else return null                                          
                                       }
                                }
                                else return null;
                                })()
                           }
                       </Box>
                    </Grid>
                    <Grid item  xs className={classes.svakiGolPolje}>
                       <Box className={classes.golPolje}>
                       {
                               (()=>{
                                let pozicija9=goloviobrane.find((element)=>element.pozicija===9);
                                if(pozicija9!==undefined)
                                {
                                    if(isIgrac)
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
                                    else {
                                        //NEP RIKAZUJEMIO SLUČAJEVE 0/0, U TOM SLUČAJU NE PRIKAZUJEMO NIŠTA-> PORJVERAVAMO JE LI BAREM 1 OD ČLANOVA RAZLIČIT OD 0
                                            if(odabir===1&&(((pozicija9.obranebranka7m+pozicija9.obranebrankaostali)!==0 || ((pozicija9.primljenibranka7m+pozicija9.primljenibrankaostali!==0)))))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija9.obranebranka7m+pozicija9.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija9.obranebranka7m+pozicija9.obranebrankaostali+pozicija9.primljenibranka7m+pozicija9.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===2&&((pozicija9.obranebranka7m!==0) || (pozicija9.primljenibranka7m)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija9.obranebranka7m}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija9.obranebranka7m+pozicija9.primljenibranka7m}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else if(odabir===3&&((pozicija9.obranebrankaostali!==0) || (pozicija9.primljenibrankaostali)))
                                            {
                                                return (
                                                    <Fragment>
                                                        <Typography align='center' variant='h5' style={{color:'#008000',fontWeight:'bold'}}>{pozicija9.obranebrankaostali}</Typography>
                                                        <Typography align='center'  variant='h5' style={{fontWeight:'bold'}} color='secondary'>/{pozicija9.obranebrankaostali+pozicija9.primljenibrankaostali}</Typography>
                                                    </Fragment>
                                                )
                                            }
                                            else return null                                          
                                       }
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
