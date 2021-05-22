import React,{Fragment} from 'react'
import{ThemeProvider,createMuiTheme} from '@material-ui/core/styles';
import { Route ,Switch} from "react-router-dom";
import GuestHomePage from './pages/Guest_homepage';
import VodenjeStatistike from './pages/Vodenje_statistike';
import UtakmicaStatistika from './pages/Utakmica_statistika';
import UtakmicaStatistikaLive from './pages/Utakmica_statistika_live';
import GuestRezultatiPage from './pages/Guest_rezultati_page';
import GuestKluboviPage from './pages/Guest_klubovi_page';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import {checkLogin} from './graphql/query';
import { useQuery } from '@apollo/client';
import ErrorDialog from './components/ErrorDialog';
import {postaviError} from './redux/slicers/error';
import {adminLoginStatus} from './redux/slicers/adminLogged';
import { useDispatch,useSelector} from 'react-redux';
import { useRouteMatch } from "react-router-dom";
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
  const match=useRouteMatch();//pristup match objektu
  /*Razlika path i url parametraConsider the route "/users/:userId". match.path would be "/users/:userId" 
  while match.url would have the :userId value filled in, e.g. "users/5".*/
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
 console.log(match.path);
  return (
    <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path='/' render={(props)=>(
            <Fragment>
              <Navbar history={props.history} />
              <GuestHomePage history={props.history}/>
            </Fragment>
          )}/>{/*exact path da nebi bilo parcijalnog matchanja*/}
          {(logged)? <Route exact path='/statistika' component={VodenjeStatistike}/> : null}
          <Route exact path='/login' component={Login}/>
          <Route exact path='/utakmica/:broj_utakmice' component={UtakmicaStatistika}/>
          <Route exact path='/utakmica/live/:broj_utakmice' component={UtakmicaStatistikaLive}/>
          <Route exact path='/rezultati' render={(props)=>(
              <Fragment>
               <Navbar history={props.history} />
               <GuestRezultatiPage history={props.history} />
             </Fragment>
          )}/>
          <Route exact path='/klubovi' render={(props)=>(
            <Fragment>
              <Navbar history={props.history}/>
              <GuestKluboviPage history={props.history}/>
            </Fragment>
          )} />
        </Switch>
        {
          (error&&error.message)?
          <ErrorDialog errorText={error.message}/>
          :
          null
        }
    </ThemeProvider>
  )
}