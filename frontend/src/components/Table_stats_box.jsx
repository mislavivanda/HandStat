import {React,Fragment} from 'react'
import {Box, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
const useStyles=makeStyles((theme)=>({
    glavniBox:{
        display:'flex',
        flexDirection:'row',
        alignItems:'stretch',
        justifyContent:'space-between',
        width:'100%',
        backgroundColor:theme.palette.primary.main,
        borderBottomColor:'#FFFFFF',
        borderBottomStyle:'solid'
    },
    dres:{
        height:'auto',
        width:'5%',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:theme.palette.secondary.main,
        borderRightColor:'#FFFFFF',
        borderRightStyle:'solid',
        borderLeftColor:'#FFFFFF',
        borderLeftStyle:'solid'
    },
    imePrezimeBox:{
        display:'flex',
        width:'35%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRightColor:'#FFFFFF',
        borderRightStyle:'solid'
    }
}))
function Table_stats_box(props) {
    const classes=useStyles();
    return (
        <Fragment>
           {(()=>{
            if(props.tip===1)
            {
            return (
            <Box className={classes.glavniBox}>
                <Box className={classes.dres}><Typography align='center' style={{color:'#FFFFFF'}}>{props.dres}</Typography></Box>
                <Box className={classes.imePrezimeBox}><Typography align='center' style={{color:'#FFFFFF'}}>{props.ime + ' '+props.prezime}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'12%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.golovi}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'12%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.iskljucenja}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'12%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.zuti}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'12%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.crveni}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'12%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.plavi}</Typography></Box>
            </Box>)
            }
            else if(props.tip===2)
            {
            return(
            <Box className={classes.glavniBox}>
                <Box className={classes.dres}><Typography align='center' style={{color:'#FFFFFF'}}>{props.dres}</Typography></Box>
                <Box className={classes.imePrezimeBox}><Typography align='center' style={{color:'#FFFFFF'}}>{props.ime + ' '+props.prezime}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'14%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography  align='center' style={{color:'#FFFFFF'}}>{props.obrane}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'14%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography  align='center' style={{color:'#FFFFFF'}}>{props.golovi}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.iskljucenja}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.zuti}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.crveni}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.plavi}</Typography></Box>
            </Box>
            )
            }
            else {
            return (
            <Box className={classes.glavniBox}>
                <Box style={{ display:'flex',width:'40%',flexDirection:'row',justifyContent:'center',alignItems:'center', borderLeftColor:'#FFFFFF',borderLeftStyle:'solid',borderRightColor:'#FFFFFF',borderRightStyle:'solid'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.ime + ' '+props.prezime}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'36%',display:'flex',alignItems:'center',justifyContent:'center'}}><Typography align='center' style={{color:'#FFFFFF'}}>{props.titula}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography  align='center'  style={{color:'#FFFFFF'}}>{props.zuti}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography  align='center' style={{color:'#FFFFFF'}}>{props.crveni}</Typography></Box>
                <Box style={{borderRightColor:'#FFFFFF',borderRightStyle:'solid',width:'8%',display:'flex',alignItems:'center', justifyContent:'center'}}><Typography  align='center' style={{color:'#FFFFFF'}}>{props.plavi}</Typography></Box>
            </Box>
            )
            }
        })()} {/*IIFE FUNCTION JER UNUTRA MORA BITI EXPRESSION*/}
        </Fragment>
    )
}

export default Table_stats_box
