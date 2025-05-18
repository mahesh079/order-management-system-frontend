import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../slices/authenticationSlice';
import { useDispatch } from 'react-redux';


const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .min(1, 'Username must be at least 1 characters')
                .required('Username is required'),
            password: Yup.string()
                .min(1, 'Password must be at least 1 characters')
                .required('Password is required')
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                await dispatch(adminLogin(values)).unwrap();
                alert('Login successful!');
                resetForm();
                navigate('/admin-panel');

            } catch (error) {
                console.error('Login error:', error.response?.data || error.message);
                alert(error.response?.data?.error || 'Login failed.');
            }
        }
    });

    return (
        <div className="w-full min-w-xl">
            <div className="w-full  p-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                        />
                        {formik.touched.username && formik.errors.username && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
