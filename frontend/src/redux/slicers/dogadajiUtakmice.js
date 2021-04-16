import { createSlice } from '@reduxjs/toolkit';
const dogadajiUtakmiceSlicer=createSlice({
    name:'odabraniDogadajiUtakmice',
    initialState:[],
    reducers:{
    dodajDogadaj:(state,action)=>{
        state.push(action.payload);
    },
    izbrisiDogadaj:(state,action)=>{
        return state.filter((dogadaj)=>{
            return dogadaj.id!==action.payload
        });
    },
    resetirajDogadaje:(state)=>{
        return state=[];
    }

    }
})
export const {resetirajDogadaje,dodajDogadaj,izbrisiDogadaj}=dogadajiUtakmiceSlicer.actions;
export default dogadajiUtakmiceSlicer.reducer;