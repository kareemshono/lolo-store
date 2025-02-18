import { createSlice } from "@reduxjs/toolkit"

const initialState = {showModal:false}
const productModalSlice = createSlice({
    name:"productModal",
    initialState,
    reducers:{
        toggleModal: (state,action) => {
            state.showModal = action.payload
        }
    }

});


//exporting toggleModal reducer
export const {toggleModal} = productModalSlice.actions;
export default productModalSlice.reducer;