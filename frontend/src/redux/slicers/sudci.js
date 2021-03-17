import { createSlice } from '@reduxjs/toolkit';
const sudciSlicer=createSlice({
    name:'sudci',
    initialState:{
        sudac1:null,
        sudac2:null
    },
    reducers:{
        sudac1Odabran:(state,action)=>{
            state.sudac1=action.payload;
        },
        sudac2Odabran:(state,action)=>{
            state.sudac2=action.payload
        }
    }
})
export const {sudac1Odabran,sudac2Odabran}=sudciSlicer.actions;
export default sudciSlicer.reducer;