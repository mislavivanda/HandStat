import { createSlice } from '@reduxjs/toolkit';
const datumSlicer=createSlice({
    name:'datum',
    initialState:'',
    reducers:{
        postaviDatum:(state,action)=>{
            return state=action.payload
        }
    }
})
export const {postaviDatum}=datumSlicer.actions;
export default datumSlicer.reducer;