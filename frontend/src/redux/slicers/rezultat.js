import { createSlice } from '@reduxjs/toolkit';
const rezultatSlicer=createSlice({
    name:'rezultat',
    initialState:{
        timDomaci:0,
        timGosti:0
    },
    reducers:{
        incrementDomaci:(state)=>{//ovaj state se odnosni na ovi rezultat state objekt ne na globalni redux objekt
            state.timDomaci+=1;
        },
        incrementGosti:(state)=>{
            state.timGosti+=1;
        },
        decrementDomaci:(state)=>{
            state.timDomaci-=1;
        },
        decrementGosti:(state)=>{
            state.timGosti-=1;
        },
        resetirajRezultat:(state)=>{
            state.timDomaci=0;
            state.timGosti=0;
        }
    }
})
export const{resetirajRezultat,incrementDomaci,incrementGosti,decrementDomaci,decrementGosti}=rezultatSlicer.actions;
export default rezultatSlicer.reducer;