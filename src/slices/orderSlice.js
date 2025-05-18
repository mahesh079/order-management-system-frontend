import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const token = localStorage.getItem('adminToken');

// Async thunks
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/orders', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to fetch orders');
    }
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (orderId, thunkAPI) => {
    try {
        await axios.delete(`http://localhost:5000/delete-order/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return orderId;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to delete order');
    }
});

export const updateQuantity = createAsyncThunk('orders/updateQuantity', async ({ orderId, quantity }, thunkAPI) => {
    try {
        await axios.put(`http://localhost:5000/orders/${orderId}`, { quantity }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { orderId, quantity };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to update order');
    }
});

export const getFilteredOrders = createAsyncThunk('orders/getFilteredOrders', async ({ name, filterDate }, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/get-specific-orders', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                name,
                filterDate
            }
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || 'Failed to fetch filtered orders');
    }
}
);

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5000/create-new-order', orderData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.error || 'Failed to create order');
    }
});
const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        status: '',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {

                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter(order => order.id !== action.payload);
            })

            .addCase(updateQuantity.fulfilled, (state, action) => {
                const { orderId, quantity } = action.payload;
                const index = state.orders.findIndex(order => order.id === orderId);
                if (index !== -1) {
                    state.orders[index].quantity = quantity;
                }
            })
            .addCase(getFilteredOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            }
            )
            .addCase(getFilteredOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
        builder
            .addCase(createOrder.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });

    }
});

export default ordersSlice.reducer;
