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
function Gol_igrac_golman_prikaz(props) {
    const classes=useStyles();
    return (
       <Fragment>
            <img src={gol} alt='handball goal' className={classes.gol}/>
            <Grid className={classes.golGrid} item container direction='column'>{/*tablica*/}
                <Grid item container direction='row' xs>{/*redak*/}
                    <Grid item  xs>
                       <Box className={[classes.golPolje,classes.lijeviGolPolje,classes.gornjiGolPolje].join(' ')}>
                           <Typography align='center' style={{color:'#008000'}}>1</Typography>
                           <Typography align='center' color='secondary'>/2</Typography>
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={[classes.golPolje,classes.gornjiGolPolje].join(' ')}>
                           <Typography align='center' style={{color:'#008000'}}>1</Typography>
                           <Typography align='center' color='secondary'>/2</Typography>
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={[classes.golPolje,classes.gornjiGolPolje].join(' ')}>
                           <Typography align='center' style={{color:'#008000'}}>1</Typography>
                           <Typography align='center' color='secondary'>/2</Typography>
                       </Box>
                    </Grid>
                </Grid>
                <Grid item container direction='row' xs>
                     <Grid item  xs>
                       <Box className={[classes.golPolje,classes.lijeviGolPolje].join(' ')}>
                           <Typography align='center' style={{color:'#008000'}}>1</Typography>
                           <Typography align='center' color='secondary'>/2</Typography>
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={classes.golPolje}>
                           <Typography align='center' style={{color:'#008000'}}>1</Typography>
                           <Typography align='center' color='secondary'>/2</Typography>
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={classes.golPolje}>
                           <Typography align='center' style={{color:'#008000'}}>1</Typography>
                           <Typography align='center' color='secondary'>/2</Typography>
                       </Box>
                    </Grid>
                </Grid>
                <Grid item container direction='row' xs>
                     <Grid item  xs>
                       <Box className={[classes.golPolje,classes.lijeviGolPolje].join(' ')}>
                           <Typography align='center' style={{color:'#008000'}}>1</Typography>
                           <Typography align='center' color='secondary'>/2</Typography>
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={classes.golPolje}>
                           <Typography align='center' style={{color:'#008000'}}>1</Typography>
                           <Typography align='center' color='secondary'>/2</Typography>
                       </Box>
                    </Grid>
                    <Grid item  xs>
                       <Box className={classes.golPolje}>
                           <Typography align='center' style={{color:'#008000'}}>1</Typography>
                           <Typography align='center' color='secondary'>/2</Typography>
                       </Box>
                    </Grid>
                </Grid>
            </Grid>
       </Fragment>
    )
}

export default Gol_igrac_golman_prikaz
