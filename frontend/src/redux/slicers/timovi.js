import { createSlice } from '@reduxjs/toolkit';
const timSlicer=createSlice({
    name:'timovi',
    initialState:{
        timDomaci:null,
        timGosti:null,
        timDomaciSpremljen:false,
        timGostiSpremljen:false
    },
    reducers:{
        odabranTimDomaci:(state,action)=>{
             state.timDomaci=action.payload;
        },
        odabranTimGosti:(state,action)=>{
            state.timGosti=action.payload;
        },
        spremljenDomaci:(state)=>{
            state.timDomaciSpremljen=true;
        },
        spremljenGosti:(state)=>{
            state.timGostiSpremljen=true
        }
    }
})
export const {odabranTimDomaci,odabranTimGosti,spremljenDomaci,spremljenGosti}=timSlicer.actions;
export default timSlicer.reducer;