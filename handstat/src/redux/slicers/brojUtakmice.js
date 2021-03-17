import { createSlice } from '@reduxjs/toolkit';
const brojUtakmiceSlicer=createSlice({
    name:'brojUtakmice',
    initialState:'',
    reducers:{
        brojUtakmiceUnesen:(state,action)=>{
            return state=action.payload;
        }
    }
});
export const {brojUtakmiceUnesen}=brojUtakmiceSlicer.actions;
export default brojUtakmiceSlicer.reducer;