import React,{Fragment,useEffect,useState} from 'react'
import {Grid,Typography,Box,Paper,TextField,Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import {login} from '../graphql/mutation';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useMutation } from '@apollo/client';
import ErrorDialog from '../components/ErrorDialog';
import { useDispatch,useSelector} from 'react-redux';
import {postaviError} from '../redux/slicers/error';
import {adminLoginStatus} from '../redux/slicers/adminLogged';
const useStyles=makeStyles((theme)=>({
 container:{
    backgroundColor:theme.palette.secondary.main,
     height:'100vh',
     display:'flex',
     flexDirection:'row',
     justifyContent:'center',
     alignItems:'center'
 },
 paper:{
     width:'90%',
     height:'90%'
 },
 paperBox:{
     display:'flex',
     height:'90%',
     flexDirection:'column',
     justifyContent:'center',
     alignItems:'center'
 },
 loadingItem:{
    position:'fixed',
    top:'50%',
    left:'50%',//centrira na način da stavi margin top 50% visine ekrana od vrha i 50% od sirine ekrana ALI OD BORDERA/EDGEA ELEMENTA-> NEĆE BITI CENTRIRANO JER
    //NPR AKO JE ELEENT SIROK 10% ONDA ĆE MU LIJEVI RUB BITI NA 50% OD LIJEVOG RUBA EKRANA A DESNI 40%->nije centrirano-> rješenje:
    //KADA POMAKNEMO ELEMENT ZA 50% OD RUBA EKRANA ONDA GA MAKNEMO ZA POLOVICU NJEGOVE SIRINE NAZAD->
    //1) ŠIRINA EKRANA= 50%+ŠIRINA ELEMENTA + 50% - ŠIRINA ELEMENTA
    //NAKON POMAKA:
    //ŠIRINA EKRANA=50%-ŠIRINAELEMENTA/2+ŠIRINA ELEMENTA +50%-ŠIRINAELEMENTA/2-> VIDIMO DA SU LIJEVE I DESNE MARGINE JEDNAKE S OBIZROM NA RUB ELEMENTA
    transform: 'translate(-50%, -50%)'//TRANSLATIRAMO PO X I Y OSI U SUPROTNOM SMJERU
}
}))
function Login(props) {
    const classes=useStyles();
    const dispatch=useDispatch();
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const logged=useSelector((state)=>state.login);

    useEffect(()=>{
            if(logged)//ako je logiran-> odma ga prebaci na statistika stranicu, ne treba se logirat
            props.history.replace('/statistika');//vodimo usera na statistika stranicu
    },[]);
    const [loginUser,{loading,error}]=useMutation(login,{
        onCompleted:(data)=>{//ako je dobio podatke-> prosao login,inace se javi error
            props.history.replace('/statistika');//vodimo usera na statistika stranicu
            //aktiviraj popup sa dobrodoslicom i imenom
            console.log('Dobrodosli '+data.login.ime+' '+data.login.prezime);
            dispatch(adminLoginStatus(true));//postavi globalni state u true da se zna da je logiran
        },
        onError:(error)=>{//potrebno da resolvamo rejected error promise ,inace se rusi aplikacija
            //makni dosad unesene podatke
            setUsername('');
            setPassword('');
            dispatch(postaviError(true));//ovo će otvorit error popup
        }
    })
    function handleLogin(){
        if(username.length>0&& password.length>0)
        {
            loginUser({
                variables:{
                    username:username,
                    password:password
                }
            });
    }
    }
    return (
        <Fragment>
            {
            (!logged)?//ako nije logiran prikazi mu formu, inace mu prikazi loading button dok ga se preusmjerava
           (<Box className={classes.container}>
                <Grid style={{height:'100%'}} item container direction='row' justify='center' alignItems='center' xs={12} sm={6} md={4} >
                    <Paper elevation={2} className={classes.paper}>
                        <Box className={classes.paperBox}>
                            <Grid item container direction='column' alignItems='center' justify='center' spacing={5}>
                                <Grid style={{marginTop:10}} item>
                                    <Box ><Typography color='secondary' align='center' variant='h5'>ULOGIRAJTE SE</Typography></Box>
                                </Grid>
                                <Grid item>
                                    <TextField
                                    label="Username"
                                    variant="filled"
                                    value={username}
                                    onChange={(e)=>setUsername(e.target.value)}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Password"
                                        type="password"
                                        variant="filled"
                                        value={password}
                                        onChange={(e)=>setPassword(e.target.value)}
                                        />
                                </Grid>
                                <Grid item>
                                    {
                                        (()=>{
                                            if(loading) return <CircularProgress color='primary'/>
                                        
                                            return (<Button color='primary' variant='contained' size='large' style={{bottom:10}} onClick={()=>handleLogin()}>Login</Button>)
                                        })()
                                    }
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Box>)
            :
                <CircularProgress color='primary' className={classes.loadingItem}/>
        }
        {
            (error&&error.message)?
            <ErrorDialog errorText={error.message}/>
            :
            null
        }
    </Fragment>
  )
}

export default Login