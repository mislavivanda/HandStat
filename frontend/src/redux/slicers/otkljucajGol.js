import { createSlice } from '@reduxjs/toolkit';
const otkljucajGolSlicer=createSlice({
    name:'otkljucajGol',
    initialState:false,
    reducers:{
        otkljucajGol:(state,action)=>{
            return state=action.payload;
            /*ZAŠTO RETURN???*/
            /*Redux Toolkit's createReducer() allows writing reducers that directly mutate the state. This works by wrapping the reducer call with produce from the Immer library.

            However, the reducer call isn't wrapped with produce when the current state isn't "draftable" by Immer, which is the case for primitive values, including null:*/
            /*Because your initial User state is null, you must return the new state from your receiveUser() reducer*/
        }
    }
});
export const {otkljucajGol} = otkljucajGolSlicer.actions;
export default otkljucajGolSlicer.reducer;