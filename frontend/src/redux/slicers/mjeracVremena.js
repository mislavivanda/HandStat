import { createSlice } from '@reduxjs/toolkit';
const mjeracSlicer=createSlice({
    name:'mjeracVremena',
    initialState:{
        odabraniMjerac:null
    },
    reducers:{
        mjeracOdabran:(state,action)=>{
            state.odabraniMjerac=action.payload;
        }
    }
})
export const {mjeracOdabran}=mjeracSlicer.actions;
export default mjeracSlicer.reducer;