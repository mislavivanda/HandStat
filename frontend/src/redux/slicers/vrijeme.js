import { createSlice } from '@reduxjs/toolkit';
const vrijemeSlicer=createSlice({
    name:'vrijeme',
    initialState:'',
    reducers:{
        postaviVrijeme:(state,action)=>{
            return state=action.payload;
        }
    }
})
export const {postaviVrijeme}=vrijemeSlicer.actions;
export default vrijemeSlicer.reducer;