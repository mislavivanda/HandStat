import { createSlice } from '@reduxjs/toolkit';
const adminLoggedSlicer=createSlice({
    name:'adminLoggedIn',
    initialState:false,
    reducers:{
        adminLoginStatus(state,action)
        {
            return state=action.payload;
        }
    }
});
export const {adminLoginStatus}=adminLoggedSlicer.actions;
export default adminLoggedSlicer.reducer;