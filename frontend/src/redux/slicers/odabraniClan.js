import { createSlice } from '@reduxjs/toolkit';
const odabraniClanSlicer=createSlice({
    name:'odabraniClan',
    initialState:{//moramo staviti property unutar objekta jer ka stavimo state={objekt} neće da se mijenja state
        clan:null
    },
    reducers:{
        odabranClan:(state,action)=>{
                if(action.payload)
                {
                state.clan={
                    maticni_broj:action.payload.maticni_broj,
                    ime:action.payload.ime,
                    prezime:action.payload.prezime,
                    klub_id:action.payload.klub_id,
                    tip:action.payload.tip,//da znamo jeli golman,igrac ili osoblje za spremit u bazu,
                }
            }
            else state.clan=null;
    }
    }
});
export const {odabranClan}=odabraniClanSlicer.actions;
export default odabraniClanSlicer.reducer;