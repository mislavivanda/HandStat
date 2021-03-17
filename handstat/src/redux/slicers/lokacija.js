import { createSlice } from '@reduxjs/toolkit';
const lokacijaSlicer=createSlice({
    name:'lokacija',
    initialState:{
        mjestoDvorana:null
    },
    reducers:{
        lokacijaOdabrana:(state,action)=>{
            state.mjestoDvorana=action.payload;
        }
    }
})
export const {lokacijaOdabrana}=lokacijaSlicer.actions;
export default lokacijaSlicer.reducer;