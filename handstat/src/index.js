import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import reduxStore from './redux/store';
import { Provider } from 'react-redux';/*useSelector i useDispatch nam omogućavaju kreiranje vrijabli kojima možemo radit akciju prema storeu jer je uvijek potrebno raditi
store.dispatch,store.getState za takve akcije-> u ovim slučajevima oni nam omogućavaju da to radimo jer one to rade tako da ispod haube pristupaju storeu,
Zašto nam to treba?-> jer NIJE DOZOVLJENO DIREKTNO PRISTUPATI STOREU I IMPORTATIT GA
KAKO ONE ZNAJU KOJEN STOREU PRISTUPATI-> JER U NAŠOJ ROOT REACT APP KOMPONENTI OKRUŽIMO S PROVIDEROM OD REDUXA KOJI PRIMA PROP=STORE
-> U APP.JS IMPORTAMO STORE I POŠALJEMO GA U PROVIDERV KAO PROP I PROVIDEROM OKRUŽIMO <APP/> KOMPONENTU->
ON OMOGUĆAVA USESELECTOR I USEDISPATCH FUNKCIJAMA PRISTUP STOREU */
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={reduxStore}>
    <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
