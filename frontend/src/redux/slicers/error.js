import { createSlice } from '@reduxjs/toolkit';

const errorSlicer=createSlice({
    name:'error',
    initialState:false,
    reducers:{
        postaviError:(state,action)=>{
            return state=action.payload;
        }
    }
})

export const {postaviError}=errorSlicer.actions;
export default errorSlicer.reducer;