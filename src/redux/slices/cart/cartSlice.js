import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    cart: null,
    items: [],
    isLoading: false,
    error: null,
    guestCart: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('guestCart') || '[]') : [],
};

// Fetch cart for authenticated user
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            console.log('fetchCart: Sending GET /api/products/cart');
            const res = await axios.get('http://localhost:5000/api/products/cart', {
                withCredentials: true,
            });
            console.log('fetchCart: Success, response:', {
                status: res.status,
                data: res.data,
                headers: res.headers,
            });
            return res.data;
        } catch (error) {
            console.error('fetchCart: Error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers,
                stack: error.stack,
            });
            const errorMessage = error.response?.data?.error || 'Failed to fetch cart';
            if (error.response?.status === 400) {
                console.error('fetchCart: 400 Bad Request, details:', error.response?.data);
            } else if (error.response?.status === 401) {
                console.error('fetchCart: 401 Unauthorized, check token');
            }
            return rejectWithValue(errorMessage);
        }
    }
);

// Add item to cart
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, variantId, quantity, product_name, price, size, color, thumbnail }, { getState, rejectWithValue }) => {
        try {
            // Validate inputs
            if (!Number.isInteger(productId) || !Number.isInteger(variantId) || !Number.isInteger(quantity) || quantity < 1) {
                console.error('addToCart: Invalid inputs:', { productId, variantId, quantity });
                return rejectWithValue('Invalid productId, variantId, or quantity');
            }

            const { user } = getState().userSlice;
            if (user) {
                console.log('addToCart: Dispatching for user:', { productId, variantId, quantity });
                const res = await axios.post(
                    'http://localhost:5000/api/products/cart/items',
                    { productId, variantId, quantity },
                    { withCredentials: true }
                );
                console.log('addToCart: Received response:', res.data);
                return { ...res.data, isGuest: false };
            } else {
                console.log('addToCart: Adding to guest cart:', { productId, variantId, quantity });
                const item = { productId, variantId, quantity, product_name, price, size, color, thumbnail };
                return { item, isGuest: true };
            }
        } catch (error) {
            console.error('addToCart error:', {
                message: error.response?.data || error.message,
                productId,
                variantId,
                quantity,
                stack: error.stack,
            });
            return rejectWithValue(error.response?.data?.error || 'Failed to add to cart');
        }
    }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            console.log('updateCartItem: Updating item:', { itemId, quantity });
            const res = await axios.put(
                `http://localhost:5000/api/products/cart/items/${itemId}`,
                { quantity },
                { withCredentials: true }
            );
            console.log('updateCartItem: Received response:', res.data);
            return res.data;
        } catch (error) {
            console.error('updateCartItem error:', {
                message: error.response?.data || error.message,
                itemId,
                quantity,
            });
            return rejectWithValue(error.response?.data?.error || 'Failed to update cart item');
        }
    }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId, { rejectWithValue }) => {
        try {
            console.log('removeFromCart: Removing item:', itemId);
            await axios.delete(`http://localhost:5000/api/products/cart/items/${itemId}`, {
                withCredentials: true,
            });
            console.log('removeFromCart: Item removed:', itemId);
            return itemId;
        } catch (error) {
            console.error('removeFromCart error:', {
                message: error.response?.data || error.message,
                itemId,
            });
            return rejectWithValue(error.response?.data?.error || 'Failed to remove cart item');
        }
    }
);

// Merge guest cart on sign-in
export const mergeCart = createAsyncThunk(
    'cart/mergeCart',
    async (guestCartItems, { rejectWithValue }) => {
        try {
            console.log('mergeCart: Merging guest cart items:', guestCartItems);
            const validItems = guestCartItems.filter(
                (item) => Number.isInteger(item.productId) && Number.isInteger(item.variantId) && Number.isInteger(item.quantity) && item.quantity > 0
            );
            if (validItems.length !== guestCartItems.length) {
                console.warn('mergeCart: Filtered out invalid guest cart items:', guestCartItems);
            }
            if (validItems.length === 0) {
                console.log('mergeCart: No valid items to merge');
                return { cart: null, items: [] };
            }
            const res = await axios.post(
                'http://localhost:5000/api/products/cart/merge',
                { guestCartItems: validItems },
                { withCredentials: true }
            );
            console.log('mergeCart: Received response:', res.data);
            return res.data;
        } catch (error) {
            console.error('mergeCart error:', {
                message: error.response?.data || error.message,
                guestCartItems,
            });
            return rejectWithValue(error.response?.data?.error || 'Failed to merge cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToGuestCart: (state, action) => {
            const item = action.payload;
            if (!Number.isInteger(item.productId) || !Number.isInteger(item.variantId) || !Number.isInteger(item.quantity) || item.quantity < 1) {
                console.error('addToGuestCart: Invalid item:', item);
                return;
            }
            console.log('addToGuestCart: Adding item:', item);
            const existing = state.guestCart.find(
                (i) => i.productId === item.productId && i.variantId === item.variantId
            );
            if (existing) {
                existing.quantity += item.quantity;
            } else {
                state.guestCart.push(item);
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('guestCart', JSON.stringify(state.guestCart));
            }
        },
        removeFromGuestCart: (state, action) => {
            const { productId, variantId } = action.payload;
            console.log('removeFromGuestCart: Removing item:', { productId, variantId });
            state.guestCart = state.guestCart.filter(
                (item) => !(item.productId === productId && item.variantId === variantId)
            );
            if (typeof window !== 'undefined') {
                localStorage.setItem('guestCart', JSON.stringify(state.guestCart));
            }
        },
        updateGuestCartQuantity: (state, action) => {
            const { productId, variantId, quantity } = action.payload;
            console.log('updateGuestCartQuantity:', { productId, variantId, quantity });
            const item = state.guestCart.find(
                (item) => item.productId === productId && item.variantId === variantId
            );
            if (item) {
                item.quantity = quantity;
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('guestCart', JSON.stringify(state.guestCart));
            }
        },
        clearGuestCart: (state) => {
            console.log('clearGuestCart: Clearing guest cart');
            state.guestCart = [];
            if (typeof window !== 'undefined') {
                localStorage.setItem('guestCart', JSON.stringify([]));
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload.cart;
                state.items = action.payload.items;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                if (action.payload.isGuest) {
                    state.error = null;
                    const item = action.payload.item;
                    const existing = state.guestCart.find(
                        (i) => i.productId === item.productId && i.variantId === item.productId
                    );
                    if (existing) {
                        existing.quantity += item.quantity;
                    } else {
                        state.guestCart.push(item);
                    }
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('guestCart', JSON.stringify(state.guestCart));
                    }
                } else {
                    state.error = null;
                    state.cart = action.payload.cart;
                    state.items = action.payload.items;
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.cart = action.payload.cart;
                state.items = action.payload.items;
                state.guestCart = [];
                state.error = null;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('guestCart', JSON.stringify([]));
                }
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { addToGuestCart, removeFromGuestCart, updateGuestCartQuantity, clearGuestCart } = cartSlice.actions;
export default cartSlice.reducer;