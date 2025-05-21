import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    singleProduct: null,
    total: 0,
    colors: [],
    isLoading: false,
    error: null,
    filters: {
        categories: [],
        sizes: [],
        colors: [],
        sort: '',
    },
    pagination: {
        page: 0,
        limit: 20,
    },
};

// Thunk to fetch single product
export const fetchSingleProduct = createAsyncThunk(
    'products/fetchSingleProduct',
    async (productId, { rejectWithValue }) => {
        try {
            if (!productId || isNaN(productId) || productId <= 0) {
                console.error('Invalid productId in fetchSingleProduct:', productId);
                return rejectWithValue('Invalid product ID');
            }
            console.log('Fetching single product with ID:', productId);
            const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Fetching Single Product error:', {
                message: error.message,
                status: error.response?.status,
                response: error.response?.data,
            });
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch product');
        }
    }
);

// Thunk to fetch filtered products with pagination
export const fetchAllProducts = createAsyncThunk(
    'products/fetchAllProducts',
    async ({ categories = [], sizes = [], colors = [], sort = '', page = 0, limit = 20 }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (categories.length > 0) categories.forEach((cat) => params.append('categories', cat));
            if (sizes.length > 0) sizes.forEach((size) => params.append('sizes', size));
            if (colors.length > 0) colors.forEach((color) => params.append('colors', color));
            if (sort) params.append('sort', sort);
            params.append('page', page);
            params.append('limit', limit);

            console.log('Fetching products with params:', params.toString());
            const res = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
            return res.data;
        } catch (error) {
            console.error('Fetching Products error:', {
                message: error.message,
                status: error.response?.status,
                response: error.response?.data,
            });
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch products');
        }
    }
);

// Thunk to fetch unique colors
export const fetchColors = createAsyncThunk(
    'products/fetchColors',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Attempting to fetch colors from /api/products/colors');
            const res = await axios.get('http://localhost:5000/api/products/colors');
            console.log('Colors fetched successfully:', res.data);
            return res.data;
        } catch (error) {
            console.error('Fetching Colors error:', {
                message: error.message,
                status: error.response?.status,
                response: error.response?.data,
            });
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch colors');
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 0; // Reset to first page on filter change
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSingleProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSingleProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.singleProduct = action.payload;
            })
            .addCase(fetchSingleProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.products;
                state.total = action.payload.total;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchColors.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchColors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.colors = action.payload;
            })
            .addCase(fetchColors.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, setPage } = productsSlice.actions;
export default productsSlice.reducer;