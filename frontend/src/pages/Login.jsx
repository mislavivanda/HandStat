import React,{Fragment,useState} from 'react'
import {Grid,Typography,Box,Paper,TextField,Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import {login} from '../graphql/mutation';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import { useMutation } from '@apollo/client';//hook za poziv querya
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
     height:'100%'
 },
 paperBox:{
     display:'flex',
     height:'90%',
     flexDirection:'column',
     justifyContent:'center',
     alignItems:'center'
 }
}))
function Login(props) {
    const classes=useStyles();
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [loginUser,{loading,error}]=useMutation(login,{
        onCompleted:(data)=>{//ako je dobio podatke-> prosao login,inace se javi error
            props.history.replace('/statistika');//vodimo usera na statistika stranicu
            //aktiviraj popup sa dobrodoslicom i imenom
            console.log('Dobrodosli '+data.login.ime+' '+data.login.prezime);
        }
    })
    function handleLogin(){
        loginUser({
            variables:{
                username:username,
                password:password
            }
        });
    }
    return (
        <Fragment>
            <Box className={classes.container}>
                <Grid style={{height:'90%'}} item container direction='row' justify='center' alignItems='center' xs={12} sm={6} md={4} >
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
                                    onChange={(e)=>setUsername(e.target.value)}
                                    />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        label="Password"
                                        type="password"
                                        variant="filled"
                                        onChange={(e)=>setPassword(e.target.value)}
                                        />
                                </Grid>
                                <Grid item>
                                    {
                                        (()=>{
                                            if(loading) return <CircularProgress/>
                                            
                                            if(error) return (<Alert severity="error">{error.message}</Alert>)

                                            return (<Button color='primary' variant='contained' size='large' style={{bottom:10}} onClick={()=>handleLogin()}>Login</Button>)
                                        })()
                                    }
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Box> 
            </Fragment>
    )
}

export default Login
