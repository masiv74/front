import { createSlice } from "@reduxjs/toolkit";

 

export const adminSlice = createSlice({
    name:'admin',
    initialState:{
        statuss:'checking',
        statusRegis:'not-registered',
        user:{},
        errorMessage: undefined,
        registerSuccess: false, // Estado para indicar éxito de registro
        registerMessage: "",
    }, 
    reducers:{
            onchecking:(state) => {
                state.statuss = 'checking';
                state.user = {};
                state.errorMessage = undefined;
            },
            onLogin: (state,{payload}) => {
                state.statuss = 'authenticated';
                state.user = payload;
                state.errorMessage = undefined;
            },
            onLogout: (state,{payload}) => {
                state.statuss = 'not-authenticated';
                state.user = {};
                state.errorMessage = payload;
            },
            clearErrorMessage:(state) => {
                state.errorMessage = undefined;
                state.registerMessage = undefined;
            },
            onRegistered: (state,action) => {
                statusRegis = 'registered'; 
            
                state.errorMessage = undefined; 
                state.registerSuccess = true;  
                state.registerMessage = action.payload.msg; 
            },
            onNotRegister: (state, {payload}) => {
                statusRegis = 'not-registered'; // Cambio de estado a 'not-registered'
                state.registerSuccess = false;  
                state.errorMessage = payload; // Guardar el mensaje de error recibido
                state.registerMessage = undefined;
            },
    }
});
    
export const {onchecking,onLogin,onLogout,clearErrorMessage,onRegistered,onNotRegister} = adminSlice.actions;
 
