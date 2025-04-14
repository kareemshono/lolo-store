"use client"
import { configureStore } from "@reduxjs/toolkit";
import productModal from "./slices/productModal/productModalSlice"
import userRegisterReducer from "./slices/userSlice/userSlice.js";
import logger from "redux-logger";


const store = configureStore({
    reducer:{
        productModal:productModal,
        userSlice:userRegisterReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger),
});


export default store;