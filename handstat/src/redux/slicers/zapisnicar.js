import { createSlice } from '@reduxjs/toolkit';
const zapisnicarSlicer =createSlice({
    name:'zapisnicar',
    initialState:{
        odabraniZapisnicar:null
    },
    reducers:{
        zapisnicarOdabran:(state,action)=>{
            state.odabraniZapisnicar=action.payload;
        }
    }
})
export const {zapisnicarOdabran}=zapisnicarSlicer.actions;
export default zapisnicarSlicer.reducer;