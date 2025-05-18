

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for admin login
export const adminLogin = createAsyncThunk(
    'auth/adminLogin',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/admin-login', credentials);
            const { token } = response.data;

            // Save token to localStorage
            localStorage.setItem('adminToken', token);

            return token;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Login failed.');
        }
    }
);

// Initial state
const initialState = {
    token: localStorage.getItem('adminToken') || null,
    status: 'idle',
    error: null,
};

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('adminToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(adminLogin.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload;
            })
            .addCase(adminLogin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
