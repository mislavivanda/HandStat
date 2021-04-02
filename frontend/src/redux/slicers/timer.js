import { createSlice } from '@reduxjs/toolkit';
//vrijeme stavljamo u global state jer mu trebamo pristupati u dogadajima kod stvaranja novog dogadaja
const timerSlicer=createSlice({// us lsiceu za svaku komponentu definiramo reducere,actionse,thunkove i initial state
    name:'timer',//ovo ce se korsititi kod automatsko geneiranja imena akcija zajedno s imenom reducera od te akcije
    initialState:{
            ticks:0,
            minutes:0,
            seconds:0,
            dispatch:true
    },
    reducers:{
        incrementTime:(state)=>{//reducer za povećavanje timera,ima pristup prethodnom stateu(vrememenu) u state objektu
            state.ticks+=1;//već se uodatea,ne trebamo za minute i sekunde koristiti state.ticks+1
            if((state.ticks)/60 < 0)
            {
                state.minutes=0;
            }
            else state.minutes=parseInt((state.ticks)/60)
            state.seconds=(state.ticks)%60;
            state.dispatch=true;//omoguci dispatchanje nakon 1 sekunde
            /*IAKO NAOKO MIJENJAMO STATE KAO MUTABLE OBJEKT I NE STVARAMO KOPIJE U NOVI OBJEKT ZAPRAVO SE ISPOD HAUBE NALAZI IMMER LIBRARY
             KOJI SE KORSTIT U CREATESLICE I KOJE SVE OVO PREKO JAVASCRIPT PROXYA ZAPRAVO PRETVARA U NOVI OBJEKT KOJI SPREMA I AUTOMATKSI RETURNA*/
        },
        disableDispatch:(state)=>{
            state.dispatch=false;
        }
    }
})
export const {incrementTime,disableDispatch}=timerSlicer.actions;
export default timerSlicer.reducer//OVO ĆE KORISTIT ZA INCIJALIZACIJU REDUX STOREA
//prima dispatch i getstate argumente,nama treba samo dispatch
export const incrementTimer = ()=> (dispatch) => {//thunk za uvećavanje timera,bez parametara
    setTimeout(() => {
      dispatch(incrementTime())//ovo će dipstachat inkrement odnosno trigerat reducer svako 1 sekundu
    }, 1000)
}