import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import reduxStore from './redux/store';
import { createUploadLink } from 'apollo-upload-client'
import { getMainDefinition } from '@apollo/client/utilities';//funkcija koja vraća podatke o operaciji-> po njoj splitamo linkove
import { WebSocketLink } from "apollo-link-ws";//za subscriptionse-> on koristi i zahtijeva instalaciju subscriptions-transport-ws kojeg koristimo i na serveru za kreiranje subscriptionsservera-> inače ne može radit bez toga
import { ApolloClient, InMemoryCache,split } from '@apollo/client';//konfiguriramo klijenta da zna di će slat requestove,koji cache koristit ....
import { ApolloProvider } from '@apollo/client';//provider-> omogućava svim komponentama unutar app.js da koriste grahpql objekte npr data,error,loading...
import { Provider } from 'react-redux';/*useSelector i useDispatch nam omogućavaju kreiranje vrijabli kojima možemo radit akciju prema storeu jer je uvijek potrebno raditi
store.dispatch,store.getState za takve akcije-> u ovim slučajevima oni nam omogućavaju da to radimo jer one to rade tako da ispod haube pristupaju storeu,
Zašto nam to treba?-> jer NIJE DOZOVLJENO DIREKTNO PRISTUPATI STOREU I IMPORTATIT GA
KAKO ONE ZNAJU KOJEN STOREU PRISTUPATI-> JER U NAŠOJ ROOT REACT APP KOMPONENTI OKRUŽIMO S PROVIDEROM OD REDUXA KOJI PRIMA PROP=STORE
-> U APP.JS IMPORTAMO STORE I POŠALJEMO GA U PROVIDERV KAO PROP I PROVIDEROM OKRUŽIMO <APP/> KOMPONENTU->
ON OMOGUĆAVA USESELECTOR I USEDISPATCH FUNKCIJAMA PRISTUP STOREU */
const httpLink = createUploadLink({//ovaj link nam omogućava slanje fileova u multipar byte form-> koristi http protokol
  uri: 'http://localhost:3001/graphql',
  credentials: 'include'//Always send user credentials (cookies, basic http auth, etc..), even for cross-origin calls.
  //VAŽNOOO-> ISTA OPCIJA MORA BITI OMOGUĆENA U CORS OPTIONSIMA NA SERVERU INAČE ĆE SE BLOKIRAT POZIVI PO CORS POLICYU
});

const wsLink = new WebSocketLink({//ovaj link nam omogućava stvaranje trajne TCP/IP konekcije korištenjem WebSocket protokola-> za subscriptionse
  uri: 'ws://localhost:3001/subscriptions',//na ovom URI-u će slušati Subscription server
  options: {
    reconnect: true//u sluačju greske u mreži npr privremenom prekidu veze-> reconnectaj se automatski
  }
});
//kako imamo 2 linka a u opcije apollo klijenta možemo postaviti samo 1 reference na link-> potrebno ih je kombinirat na neki način u 1
//to radi funkcija split koja ovisno o akciji koja se poziva na klijentu bira koji će link koristit za prijenos, 3 parametra prima:
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link:splitLink,
  cache: new InMemoryCache()//cache koji ce koristit
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <ApolloProvider client={client}>{/*provider s definiranim klijentom*/}
    <Provider store={reduxStore}>
    <App />
    </Provider>
    </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
