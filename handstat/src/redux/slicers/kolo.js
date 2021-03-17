import { createSlice } from '@reduxjs/toolkit';
const koloSlicer=createSlice({
    name:'kolo',
    initialState:0,
    reducers:{
        odabranoKolo:(state,action)=>{
            return state=action.payload;
        }
    }
});
export const {odabranoKolo}=koloSlicer.actions;
export default koloSlicer.reducer;