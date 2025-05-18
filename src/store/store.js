import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from '../slices/orderSlice';
import authenticationReducer from '../slices/authenticationSlice';

const store = configureStore({
    reducer: {
        orders: ordersReducer,
        authentication: authenticationReducer,
    }
});

export default store;
