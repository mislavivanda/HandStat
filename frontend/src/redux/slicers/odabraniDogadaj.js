import { bindActionCreators, createSlice } from '@reduxjs/toolkit';
const odabraniDogadajSlicer=createSlice({
    name:'odabraniDogadaj',
    initialState:{
        dogadaj:null
    },
    reducers:{
        odabranDogadaj:(state,action)=>{
            if(action.payload)
            {
                state.dogadaj={
                    id:action.payload.id,
                    naziv:action.payload.naziv,
                    tip:action.payload.tip
                }
            }
            else state.dogadaj=null;
        }
    }
})
export const {odabranDogadaj}=odabraniDogadajSlicer.actions;
export default odabraniDogadajSlicer.reducer;