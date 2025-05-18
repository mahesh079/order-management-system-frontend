import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createOrder } from '../slices/orderSlice';
import { useDispatch } from 'react-redux';

const OrderForm = () => {
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      customerName: '',
      email: '',
      contactNumber: '',
      address: '',
      productName: '',
      quantity: '',
      productImage: null,
    },
    validationSchema: Yup.object({
      customerName: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      contactNumber: Yup.string()
        .matches(/^\d{10}$/, 'Must be a 10-digit number')
        .required('Required'),
      address: Yup.string()
        .max(100, 'Must be 100 characters or less')
        .required('Required'),
      productName: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
      quantity: Yup.number()
        .min(1, 'Must be at least 1')
        .max(100, 'Must be 100 or less')
        .required('Required'),
      productImage: Yup.mixed()
        .required('Required')
        .test(
          'fileType',
          'Unsupported file format',
          value => value && ['image/jpeg', 'image/png'].includes(value.type)
        )
        .test(
          'fileSize',
          'File size too large (max 2MB)',
          value => value && value.size <= 2 * 1024 * 1024
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('customerName', values.customerName);
      formData.append('email', values.email);
      formData.append('contactNumber', values.contactNumber);
      formData.append('address', values.address);
      formData.append('productName', values.productName);
      formData.append('quantity', values.quantity);
      formData.append('productImage', values.productImage);

      try {

        await dispatch(createOrder(formData)).unwrap();

          setSuccessMessage( 'Order placed successfully!');
          resetForm();
          setImagePreview(null);
          setTimeout(() => setSuccessMessage(''), 3000);
        
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'An error occurred while submitting the form.';
        alert(errorMessage);
      }
    }
  });

  const handleImageChange = event => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue('productImage', file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Place Your Order</h1>
      {successMessage && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 rounded">
          {successMessage}
        </div>
      )}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className="block font-medium">Customer Name</label>
          <input
            type="text"
            name="customerName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.customerName}
            className="w-full p-2 border rounded"
          />
          {formik.touched.customerName && formik.errors.customerName && (
            <div className="text-red-500 text-sm">{formik.errors.customerName}</div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full p-2 border rounded"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <label className="block font-medium">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.contactNumber}
            className="w-full p-2 border rounded"
          />
          {formik.touched.contactNumber && formik.errors.contactNumber && (
            <div className="text-red-500 text-sm">{formik.errors.contactNumber}</div>
          )}
        </div>

        {/* Shipping Address */}
        <div>
          <label className="block font-medium">Shipping Address</label>
          <textarea
            name="address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            className="w-full p-2 border rounded"
          />
          {formik.touched.address && formik.errors.address && (
            <div className="text-red-500 text-sm">{formik.errors.address}</div>
          )}
        </div>

        {/* Product Name */}
        <div>
          <label className="block font-medium">Product Name</label>
          <input
            type="text"
            name="productName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.productName}
            className="w-full p-2 border rounded"
          />
          {formik.touched.productName && formik.errors.productName && (
            <div className="text-red-500 text-sm">{formik.errors.productName}</div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.quantity}
            className="w-full p-2 border rounded"
          />
          {formik.touched.quantity && formik.errors.quantity && (
            <div className="text-red-500 text-sm">{formik.errors.quantity}</div>
          )}
        </div>

        {/* Product Image */}
        <div>
          <label className="block font-medium">Product Image (.jpg/.png, max 2MB)</label>
          <input
            type="file"
            name="productImage"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {formik.touched.productImage && formik.errors.productImage && (
            <div className="text-red-500 text-sm">{formik.errors.productImage}</div>
          )}
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
