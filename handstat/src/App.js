import React from 'react'
import{ThemeProvider,createMuiTheme} from '@material-ui/core/styles';
import { Route ,Switch} from "react-router-dom";
import GuestHomePage from './pages/Guest_homepage';
import VodenjeStatistike from './pages/Vodenje_statistike';
import UtakmicaStatistika from './pages/Utakmica_statistika';
import Navbar from './components/Navbar';
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
  return (
    <ThemeProvider theme={theme}>
       <div className='App'>
        <Switch>
          <Route exact path='/' component={GuestHomePage}/>{/*exact path da nebi bilo parcijalnog matchanja*/}
          <Route exact path='/statistika' component={VodenjeStatistike}/>
          <Route exact path='/utakmica/:broj_utakmice' component={UtakmicaStatistika}/>
        </Switch>
      </div>
    </ThemeProvider>
  )
}