import React,{Fragment} from 'react'
import{ThemeProvider,createMuiTheme} from '@material-ui/core/styles';
import { Route ,Switch} from "react-router-dom";
import GuestHomePage from './pages/Guest_homepage';
import VodenjeStatistike from './pages/Vodenje_statistike';
import UtakmicaStatistika from './pages/Utakmica_statistika';
import UtakmicaStatistikaLive from './pages/Utakmica_statistika_live';
import GuestRezultatiPage from './pages/Guest_rezultati_page';
import GuestKluboviPage from './pages/Guest_klubovi_page';
import KlubInfoPage from './pages/Klub_info_page'
import TablicePage from './pages/Guest_natjecanja_tablice';
import IgracGolmanPrikaz from './pages/Igrac_golman_prikaz';
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
  const isError=useSelector((state)=>state.error);
  const {loading,error,data}=useQuery(checkLogin,{
    onCompleted:(data)=>{
      if(data.checklogin)
      {
        console.log('user logiran');
        dispatch(adminLoginStatus(true))
      }
    }
  })
//inace ne treba nista jer je false po defaultu
//kod svakiog loadanja aplikacije provjeravamo status da vidimo je li postoji valjan session cookie da znamo je li korisnik logiran
  if(error) dispatch(postaviError(true));
  return (
    <ThemeProvider theme={theme}>
        <Switch>{/*exact path da nebi bilo parcijalnog matchanja*/}
          <Route exact path='/' render={(props)=>(
            <Fragment>
              <Navbar history={props.history} match={props.match}/>
              <GuestHomePage history={props.history}/>
            </Fragment>
          )}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/utakmica/:broj_utakmice' component={UtakmicaStatistika}/>
          <Route exact path='/utakmica/live/:broj_utakmice' component={UtakmicaStatistikaLive}/>
          {(()=>{
            //IAKO NAIZGLED IZGLEDA KAO SECURITY BREACH NA NAČIN DA ĆE SVAKI KORISNIK KOJI NIJE LOGIRAN I KAD MU SE DOGODI GREŠKA MOĆI BEZ DA KLIKNE OK Na error popup upisat u browser /statistika i imat pravo vođenja statistike to nije tako
            //JER NAKON UPISA U BROWSER CIJELA APLIKACIJA SE REFRESHA I POSTAVLJAJU SE INICIJALNI STATEOVI PA ĆE isError biti postavljen a false i vratit će se null stranica
            //KAKO ERROR DIALOG ONEMOGUĆUJE KORISNIKU KLIKOVE SVUGDI OSIM NA OK BOTUN-> KORISNIK MOŽE SAMO PROBAT S REFRESHANJEN APLIKACIJE A TO JE POKRIVENO
            if(logged||(!logged&&isError))
            {//ako je korisnik logiran-> ima pravo pristupa stranici vođenja statistike
              //ako je korisnik odjavljen i postavljen je error popup-> situacija na stranici vođenja statistike u kojoj je korisniku isteka session cookie i dojavljen mu je erro preko popupa
              return <Route exact path='/statistika' component={VodenjeStatistike}/>
            }//inace korisnik ne moze pristupit stranici-> vrati null, nakon sta sitsne ok na error popupu isErrror ce bti false pa će se vratit null
            else return <Route  exact path='/statistika' component={null}/>
          })()}
          <Route exact path='/rezultati' render={(props)=>(
              <Fragment>
               <Navbar history={props.history} match={props.match}/>
               <GuestRezultatiPage history={props.history} />
             </Fragment>
          )}/>
          <Route exact path='/klubovi' render={(props)=>(
            <Fragment>
              <Navbar history={props.history} match={props.match}/>
              <GuestKluboviPage history={props.history}/>
            </Fragment>
          )} />
          <Route exact path='/klub/:klub_id' render={(props)=>(
            <Fragment>
               <Navbar history={props.history} match={props.match}/>
               <KlubInfoPage match={props.match} history={props.history}/>{/*potrebni match i history objekti od react routera, kod komponenti prikaza statistike one se prosljeđuju automatski kao props jer koristimo componenet={} sintaksu*/}
            </Fragment>
          )}/>
          <Route exact path='/tablice' render={(props)=>(
            <Fragment>
              <Navbar history={props.history} match={props.match}/>
              <TablicePage/>
            </Fragment>
          )}/>
          <Route exact path={["/igrac/:klub_id/:maticni_broj","/golman/:klub_id/:maticni_broj"]} component={IgracGolmanPrikaz}/>
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