import { createSlice } from '@reduxjs/toolkit';
const dogadajiUtakmiceSlicer=createSlice({
    name:'odabraniDogadajiUtakmice',
    initialState:[],
    reducers:{
    dodajDogadaj:(state,action)=>{
        state.push(action.payload);
    },
    izbrisiDogadaj:(state,action)=>{
        return state.filter((dogadaj)=>{
            return dogadaj.id!==action.payload
        });
    },
    resetirajDogadaje:(state)=>{
        return state=[];
    },
    promjenaRezultataDogadaja:(state,action)=>{//kod brisanja rezultatskog dogadaja potrebno smanjiti sve dogadaje s rezultatom nakon njega od domaceg/gostujuceg tima čiji smo obrisali
        //pronaći indeks izbrisanog dogadaja
        let index;
        for(let i=0;i<state.length;i++)
        {
            if(state[i].id===action.payload.id)
            {
                index=i;
                break;
            }
        }
        if(index===state.length-1)//ako je izbrisan zadnji dogadaj u nizu dogadaja-> ne treba mijenjat ništa
        {
            return state;
        }
        else{//inace mijenjamo sve nakon njega do kraja
            if(action.payload.tim===1)//smanjujemo domace rezultate
            {
                for(let i=index+1;i<state.length;i++)
                {
                    if(state[i].tip===1)//mijenjamo samo kod dogadaja s promjenom rezultata
                    {
                        state[i].domaci--;
                    }
                }
            }
            else {
                for(let i=index+1;i<state.length;i++)
                {
                    if(state[i].tip===1)
                    {
                        state[i].gosti--;
                    }
                }
            }
            return state;
        }
    }

    }
})
export const {resetirajDogadaje,dodajDogadaj,izbrisiDogadaj,promjenaRezultataDogadaja}=dogadajiUtakmiceSlicer.actions;
export default dogadajiUtakmiceSlicer.reducer;