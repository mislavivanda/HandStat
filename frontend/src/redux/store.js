import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './slicers/timer';
import rezultatReducer from './slicers/rezultat';
import timoviReducer from './slicers/timovi';
import otkljucajGolReducer from './slicers/otkljucajGol';
import odabraniDogadajReducer from './slicers/odabraniDogadaj';
import odabraniClanReducer from './slicers/odabraniClan';
import dogadajiUtakmiceReducer from './slicers/dogadajiUtakmice';
import natjecanjeReducer from './slicers/natjecanje';
import spremiUtakmicuReducer from './slicers/spremiUtakmicu';
import brojUtakmiceReducer from './slicers/brojUtakmice.js';
import lokacijaReducer from './slicers/lokacija';
import koloReducer from './slicers/kolo.js';
import gledateljiReducer from './slicers/gledatelji';
import vrijemeReducer from './slicers/vrijeme';
import datumReducer from './slicers/datum';
import nadzornikReducer from './slicers/nadzornik';
import lijecnikReducer from './slicers/lijecnik';
import zapisnicarReducer from './slicers/zapisnicar';
import mjeracReducer from './slicers/mjeracVremena';
import sudciReducer from './slicers/sudci';
import zavrsiUtakmicuReducer from './slicers/zavrsiUtakmicu';
import errorReducer from './slicers/error';
import loginReducer from './slicers/adminLogged';
export default configureStore({
  reducer: {//npr za pristup unutar selektora u timer komponenti ćemo pisati state.timer.ticks/seconds/minutes
    timer:timerReducer, //naziv globalnog statea od timera će se nazivati timer pa za pristup njemu unutar cijelog globalnog state objekta pišemo state.timer-> on se updatea u reducerima od timera
    rezultat:rezultatReducer,
    timovi:timoviReducer,
    otkljucajGol:otkljucajGolReducer,
    odabraniDogadaj:odabraniDogadajReducer,
    odabraniClan:odabraniClanReducer,
    dogadajiUtakmice:dogadajiUtakmiceReducer,
    natjecanje:natjecanjeReducer,
    spremiUtakmicu:spremiUtakmicuReducer,
    brojUtakmice:brojUtakmiceReducer,
    lokacija:lokacijaReducer,
    kolo:koloReducer,
    gledatelji:gledateljiReducer,
    vrijeme:vrijemeReducer,
    datum:datumReducer,
    nadzornik:nadzornikReducer,
    lijecnik:lijecnikReducer,
    zapisnicar:zapisnicarReducer,
    mjerac:mjeracReducer,
    sudci:sudciReducer,
    zavrsiUtakmicu:zavrsiUtakmicuReducer,
    error:errorReducer,
    login:loginReducer
  }
})