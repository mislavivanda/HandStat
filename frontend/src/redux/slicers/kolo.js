import { createSlice } from '@reduxjs/toolkit';
const koloSlicer=createSlice({
    name:'kolo',
    initialState:0,//da bi mogli provjeriti kod spremanja utakmice jeli odabrano kolo
    reducers:{
        odabranoKolo:(state,action)=>{
            return state=action.payload;
        }
    }
});
export const {odabranoKolo}=koloSlicer.actions;
export default koloSlicer.reducer;