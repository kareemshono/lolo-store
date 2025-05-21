"use client"
import { configureStore } from "@reduxjs/toolkit";
import productModal from "./slices/productModal/productModalSlice";
import productsSlice from "./slices/products/productsSlice"
import userRegisterReducer from "./slices/userSlice/userSlice.js";
import cartReducer from "./slices/cart/cartSlice.js"
import logger from "redux-logger";


const store = configureStore({
    reducer:{
        productModal:productModal,
        products:productsSlice,
        userSlice:userRegisterReducer,
        cart:cartReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger),
});


export default store;