import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UserState {
    token: string | null;
    email: string | null;
}

const initialState: UserState = {
    token: localStorage.getItem('token'),
    email: localStorage.getItem('email'),
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        setCredentials(
        state,
        {payload} : PayloadAction<{token:string; email:string}> ) {
            state.token = payload.token; 
            state.email = payload.email;

            localStorage.setItem('token', payload.token);
            localStorage.setItem('email', payload.email);
        },

        logout(state) {
            state.token = null;
            state.email = null;

            localStorage.removeItem('token');
            localStorage.removeItem('email');
        }
    }
});
            
export const { setCredentials, logout } = userSlice.actions;

export default userSlice.reducer;
        