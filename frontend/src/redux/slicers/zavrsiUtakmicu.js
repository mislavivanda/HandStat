import { createSlice } from '@reduxjs/toolkit';
const zavrsiUtakmicuSlicer=createSlice({
    name:'zavrsiUtakmicu',
    initialState:false,
    reducers:{
        zavrsiUtakmicu:(state)=>{
           return state=true;
        },
        ponistiZavrsetakUtakmice:(state)=>{
            return state=false
        }
    }
})
export const {zavrsiUtakmicu,ponistiZavrsetakUtakmice}=zavrsiUtakmicuSlicer.actions;
export default zavrsiUtakmicuSlicer.reducer;