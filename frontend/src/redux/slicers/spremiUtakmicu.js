import { createSlice } from '@reduxjs/toolkit';
const spremiUtakmicuSlicer=createSlice({
    name:'spremiUtakmicu',
    initialState:false,
    reducers:{
        spremiUtakmicu:(state)=>{
           return state=true;
        }
    }
});
export const {spremiUtakmicu}=spremiUtakmicuSlicer.actions;
export default spremiUtakmicuSlicer.reducer;