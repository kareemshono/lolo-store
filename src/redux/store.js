"use client"
import { configureStore } from "@reduxjs/toolkit";
import productModal from "./slices/productModal/productModalSlice"
import logger from "redux-logger";


const store = configureStore({
    reducer:{
        productModal:productModal
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger),
});


export default store;