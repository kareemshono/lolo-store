"use client"
import { configureStore } from "@reduxjs/toolkit";
import productModal from "./slices/productModal/productModalSlice";
import productsSlice from "./slices/products/productsSlice"
import userRegisterReducer from "./slices/userSlice/userSlice.js";
import cartReducer from "./slices/cart/cartSlice.js"
import addressReducer from "./slices/address/addressSlice.js"
import categoriesReducer from "./slices/categories/categoriesSlice"
import logger from "redux-logger";
import toastMiddleware from "./middleware/toastMiddleware";


const store = configureStore({
    reducer:{
        productModal:productModal,
        products:productsSlice,
        userSlice:userRegisterReducer,
        cart:cartReducer,
        address:addressReducer,
        categories:categoriesReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger, toastMiddleware),
});


export default store;