import { createSlice } from '@reduxjs/toolkit';
const gledateljiSlicer=createSlice({
    name:'gledatelji',
    initialState:0,
    reducers:{
        gledateljiOdabrani:(state,action)=>{
            return state=action.payload;
        }
    }
})
export const {gledateljiOdabrani} = gledateljiSlicer.actions;
export default gledateljiSlicer.reducer;