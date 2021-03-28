import React from 'react'
import{ThemeProvider,createMuiTheme} from '@material-ui/core/styles';
import { Route ,Switch} from "react-router-dom";
import GuestHomePage from './pages/Guest_homepage';
import VodenjeStatistike from './pages/Vodenje_statistike';
import UtakmicaStatistika from './pages/Utakmica_statistika';
import { ApolloClient, InMemoryCache } from '@apollo/client';//konfiguriramo klijenta da zna di će slat requestove,koji cache koristit ....
import { ApolloProvider } from '@apollo/client';//provider-> omogućava svim komponentama unutar app.js da koriste grahpql objekte npr data,error,loading...
const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',//uri di ce slat zahtjeve
  cache: new InMemoryCache()//cache koji ce koristit
});
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
      <ApolloProvider client={client}>{/*provider s definiranim klijentom*/}
       <div className='App'>
        <Switch>
          <Route exact path='/' component={GuestHomePage}/>{/*exact path da nebi bilo parcijalnog matchanja*/}
          <Route exact path='/statistika' component={VodenjeStatistike}/>
          <Route exact path='/utakmica/:broj_utakmice' component={UtakmicaStatistika}/>
        </Switch>
      </div>
      </ApolloProvider>
    </ThemeProvider>
  )
}