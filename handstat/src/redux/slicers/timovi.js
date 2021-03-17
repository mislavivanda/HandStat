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
             state.timDomaci={
                id:action.payload.id,
                naziv:action.payload.naziv,
                grb:action.payload.klub_slika
            }
        },
        odabranTimGosti:(state,action)=>{
            state.timGosti={
                id:action.payload.id,
                naziv:action.payload.naziv,
                grb:action.payload.klub_slika
            }
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