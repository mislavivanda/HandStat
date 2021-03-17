import { createSlice } from '@reduxjs/toolkit';
const datumSlicer=createSlice({
    name:'datum',
    initialState:'',
    reducers:{
        postaviDatum:{
            reducer:(state,action)=>{
            return state=action.payload.datum;
        },
        prepare(datum){//zasad dok sami genriramo id dogadaja
            return{
                payload:{
                    datum:datum.getDate().toString()+'.'+(datum.getMonth()+1).toString()+'.'+datum.getFullYear().toString()
                }
            }
        }
    }
    }
})
export const {postaviDatum}=datumSlicer.actions;
export default datumSlicer.reducer;