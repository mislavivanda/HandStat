import {createSlice} from '@reduxjs/toolkit';
const nadzornikSlicer=createSlice({
    name:'nadzornik',
    initialState:{
        odabraniNadzornik:null
    },
    reducers:{
        nadzornikOdabran:(state,action)=>{
            state.odabraniNadzornik=action.payload;
        }
    }
})
export const {nadzornikOdabran}=nadzornikSlicer.actions;
export default nadzornikSlicer.reducer;