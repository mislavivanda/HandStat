import { createSlice } from '@reduxjs/toolkit';
const dogadajiUtakmiceSlicer=createSlice({
    name:'odabraniDogadajiUtakmice',
    initialState:[],
    reducers:{
    dodajDogadaj:(state,action)=>{
        state.push(action.payload);
    },
    izbrisiDogadaj:(state,action)=>{
        state=state.filter((dogadaj)=>dogadaj.id!==action.payload.dogadaj_id);
    },
    resetirajDogadaje:(state)=>{
        return state=[];
    }

    }
})
export const {resetirajDogadaje,dodajDogadaj,izbrisiDogadaj}=dogadajiUtakmiceSlicer.actions;
export default dogadajiUtakmiceSlicer.reducer;