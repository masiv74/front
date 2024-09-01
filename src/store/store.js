import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import {  adminSlice} from "./auth/adminSlice";

export const store = configureStore({
    reducer:{
        auth: authSlice.reducer,
        admin: adminSlice.reducer
    }
})