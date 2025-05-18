import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { fetchOrders, deleteOrder, updateQuantity, getFilteredOrders } from '../slices/orderSlice';
import { useSelector, useDispatch } from 'react-redux';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const customerOrders = useSelector((state) => state.orders.orders);
    const navigate = useNavigate();
    const [filterDate, setFilterDate] = useState('');
    const [name, setName] = useState('');
    const [editOrderId, setEditOrderId] = useState(null);
    const [newQuantity, setNewQuantity] = useState('');
    const token = localStorage.getItem('adminToken');
    const socket = io('http://localhost:5000');

    // Listen socket for new orders
    useEffect(() => {
        socket.on('newOrder', () => {
            dispatch(fetchOrders());

        });

        return () => socket.off('newOrder');
    }, []);

    // Fetch orders from the backend
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
        dispatch(fetchOrders());
    }, []);

    useEffect(() => {
        if (name || filterDate) {
            handleFilterOrders()
        }
    }, [name, filterDate]);

    // Filter orders based on name and date
    const handleFilterOrders = () => {
        if (name || filterDate) {
            dispatch(getFilteredOrders({ name, filterDate })).then(() => {

            }).catch((error) => {
                console.error('Error fetching filtered orders:', error);
            });
        }
    };


    // Update order quantity
    const handleUpdateQuantity = (orderId) => {
        if (newQuantity) {
            dispatch(updateQuantity({ orderId, quantity: newQuantity })).then(() => {
                alert('Quantity updated successfully');
                dispatch(fetchOrders());
                setEditOrderId(null);
            }).catch((error) => {
                console.error('Error updating quantity:', error);
            });
        } else {
            alert('Please enter a valid quantity');
        }
    };

    // Delete an order
    const handleDeleteOrder = (orderId) => {
        dispatch(deleteOrder(orderId)).then(() => {
            alert('Order deleted successfully');
            dispatch(fetchOrders());
        }).catch((error) => {
            console.error('Error deleting order:', error);
        })
    };




    return (
        <div className="container mx-auto p-4 min-w-[1000px] mt-0">
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">Manage Orders</h1>

            {/* Filter Section */}
            <div className="mb-4 flex space-x-4 items-center">
                <input
                    type="text"
                    value={name}
                    onChange={(e => setName(e.target.value))}
                    placeholder="Filter by product name"
                    className="px-3 py-1.5 border border-gray-300 rounded w-64 text-sm"
                />

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e => setFilterDate(e.target.value))}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm"
                />
            </div>

            {/* Orders Table */}
            <table className="min-w-full border-collapse table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b text-center">Order ID</th>
                        <th className="px-4 py-2 border-b text-center">Product Name</th>
                        <th className="px-4 py-2 border-b text-center">Customer Name</th>
                        <th className="px-4 py-2 border-b text-center">Quantity</th>
                        <th className="px-4 py-2 border-b text-center">Date</th>
                        <th className="px-4 py-2 border-b text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className='scroll-auto max-h-100px'>
                    {customerOrders.map((order) => (
                        <tr key={order.id}>
                            <td className="px-4 py-2 border-b">{order.id}</td>
                            <td className="px-4 py-2 border-b">{order.productName}</td>
                            <td className="px-4 py-2 border-b">{order.customerName}</td>
                            <td className="px-4 py-2 border-b">
                                {editOrderId === order.id ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            value={newQuantity}
                                            onChange={(e) => setNewQuantity(e.target.value)}
                                            className="px-2 py-1 border border-gray-300 rounded"
                                        />
                                        <button
                                            onClick={() => handleUpdateQuantity(order.id)}
                                            className="px-2 py-1 bg-green-500 text-white rounded"
                                        >
                                            Update
                                        </button>
                                    </div>
                                ) : (
                                    order.quantity
                                )}
                            </td>
                            <td className="px-4 py-2 border-b">{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                            <td className="px-4 py-2 border-b">
                                {editOrderId === order.id ? (
                                    <button
                                        onClick={() => setEditOrderId(null)}
                                        className="px-4 py-1 bg-gray-500 text-white rounded"
                                    >
                                        Cancel
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setEditOrderId(order.id)}
                                            className="px-4 py-1 bg-blue-500 text-white rounded mr-2"
                                        >
                                            Edit Quantity
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="px-4 py-1 bg-red-500 text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersPage;
