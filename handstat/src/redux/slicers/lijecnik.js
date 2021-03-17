import { createSlice } from '@reduxjs/toolkit';
const lijecnikSlicer=createSlice({
    name:'lijecnik',
    initialState:{
        odabraniLijecnik:null
    },
    reducers:{
        lijecnikOdabran:(state,action)=>{
            state.odabraniLijecnik=action.payload;
        }
    }
})
export const {lijecnikOdabran}=lijecnikSlicer.actions;
export default lijecnikSlicer.reducer;