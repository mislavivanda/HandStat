import { createSlice } from '@reduxjs/toolkit';
const vrijemeSlicer=createSlice({
    name:'vrijeme',
    initialState:'',
    reducers:{
        postaviVrijeme:{
            reducer:(state,action)=>{
            return state=action.payload.datum;
        },
        prepare(datum){
            return{
                payload:{
                    datum:datum.getHours().toString()+':'+datum.getMinutes().toString()
                }
            }
        }
    }
    }
})
export const {postaviVrijeme}=vrijemeSlicer.actions;
export default vrijemeSlicer.reducer;