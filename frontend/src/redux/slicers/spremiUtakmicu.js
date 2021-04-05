import { createSlice } from '@reduxjs/toolkit';
const spremiUtakmicuSlicer=createSlice({
    name:'spremiUtakmicu',
    initialState:false,
    reducers:{
        spremiUtakmicu:(state,action)=>{
           return state=action.payload;
        }
    }
});
export const {spremiUtakmicu}=spremiUtakmicuSlicer.actions;
export default spremiUtakmicuSlicer.reducer;