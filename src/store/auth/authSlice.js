import { createSlice } from "@reduxjs/toolkit";

 

export const authSlice = createSlice({
    name:'auth',
    initialState:{
        status:'checking',
        statusRegis:'not-registered',
        user:{},
        errorMessage: undefined,
        registerSuccess: false, // Estado para indicar éxito de registro
        registerMessage: "",
    }, 
    reducers:{
            onchecking:(state) => {
                state.status = 'checking';
                state.user = {};
                state.errorMessage = undefined;
            },
            onLogin: (state,{payload}) => {
                state.status = 'authenticated';
                state.user = payload;
                state.errorMessage = undefined;
            },
            onLogout: (state,{payload}) => {
                state.status = 'not-authenticated';
                state.user = {};
                state.errorMessage = payload;
            },
            clearErrorMessage:(state) => {
                state.errorMessage = undefined;
                state.registerMessage = undefined;
            },
            onRegistered: (state, action) => {
                state.statusRegis = 'registered';
                state.errorMessage = undefined;
                state.registerSuccess = true;
                state.registerMessage = action.payload.msg;
                state.status="not-authenticated";
              },
              onNotRegister: (state, { payload }) => {
                state.statusRegis = 'not-registered';
                state.registerSuccess = false;
                state.errorMessage = payload;
                state.registerMessage = undefined;
            },
    }
});
    
export const {onchecking,onLogin,onLogout,clearErrorMessage,onRegistered,onNotRegister} = authSlice.actions;
 
