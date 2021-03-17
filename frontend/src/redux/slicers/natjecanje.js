import { createSlice } from '@reduxjs/toolkit';
const natjecanjeSlicer=createSlice({
    name:'natjecanje',
    initialState:{
        odabranoNatjecanje:null
    },
    reducers:{
        natjecanjeOdabir:(state,action)=>{
            state.odabranoNatjecanje=action.payload;
        }
    }
});
export const {natjecanjeOdabir}= natjecanjeSlicer.actions;
export default natjecanjeSlicer.reducer;