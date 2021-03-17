import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid'//zasad dok nema backenda
const dogadajiUtakmiceSlicer=createSlice({
    name:'odabraniDogadajiUtakmice',
    initialState:[],
    reducers:{
        dodajDogadaj:{
            reducer(state,action){
            state.push(action.payload);
        },
        prepare(dogadaj){//zasad dok sami genriramo id dogadaja
            return{
                payload:{
                    id:nanoid(),
                   ...dogadaj//generiamo id + dodamo sve sto dobijemo
                }
            }
        }
    },
    izbrisiDogadaj:(state,action)=>{
        state=state.filter((dogadaj)=>dogadaj.id!==action.payload.dogadaj_id);
    }

    }
})
export const {dodajDogadaj,izbrisiDogadaj}=dogadajiUtakmiceSlicer.actions;
export default dogadajiUtakmiceSlicer.reducer;