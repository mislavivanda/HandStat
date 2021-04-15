import React from 'react'
import{ThemeProvider,createMuiTheme} from '@material-ui/core/styles';
import { Route ,Switch} from "react-router-dom";
import GuestHomePage from './pages/Guest_homepage';
import VodenjeStatistike from './pages/Vodenje_statistike';
import UtakmicaStatistika from './pages/Utakmica_statistika';
import Login from './pages/Login';
import {checkLogin} from './graphql/query';
import { useQuery } from '@apollo/client';
import ErrorDialog from './components/ErrorDialog';
import {postaviError} from './redux/slicers/error';
import {adminLoginStatus} from './redux/slicers/adminLogged';
import { useDispatch,useSelector} from 'react-redux';
const theme=createMuiTheme({
  palette:{
    primary:{
      main:'#DA2D2D'
    },
    secondary:{
      main:'#252B42'
    }
  },
  typography:{
    fontFamily: ['"Montserrat"', 'Open Sans'].join(',')
  }
});
export default function App() {
  const dispatch=useDispatch();
  const logged=useSelector((state)=>state.login);
  const {loading,error,data}=useQuery(checkLogin,{
    onCompleted:(data)=>{
      if(data.checklogin)
      {
        dispatch(adminLoginStatus(true))
      }
    }
  })
//inace ne treba nista jer je false po defaultu
//kod svakiog loadanja aplikacije provjeravamo status da vidimo je li postoji valjan session cookie da znamo je li korisnik logiran

  if(error) dispatch(postaviError(true));
 
  return (
    <ThemeProvider theme={theme}>
       <div className='App'>
        <Switch>
          <Route exact path='/' component={GuestHomePage}/>{/*exact path da nebi bilo parcijalnog matchanja*/}
          {(logged)? <Route exact path='/statistika' component={VodenjeStatistike}/> : null}
          <Route exact path='/login' component={Login}/>
          <Route exact path='/utakmica/:broj_utakmice' component={UtakmicaStatistika}/>
        </Switch>
        {
          (error&&error.message)?
          <ErrorDialog errorText={error.message}/>
          :
          null
        }
      </div>
    </ThemeProvider>
  )
}