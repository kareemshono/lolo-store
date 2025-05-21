import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    showModal: false,
    product: null,
};

const productModalSlice = createSlice({
    name: "productModal",
    initialState,
    reducers: {
        toggleModal: (state, action) => {
            const { showModal, product } = action.payload;
            state.showModal = showModal;
            state.product = showModal ? product : null;
        },
    },
});

export const { toggleModal } = productModalSlice.actions;
export default productModalSlice.reducer;