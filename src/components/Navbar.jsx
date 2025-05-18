import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem('adminToken');
  const handleLogout = () => {
    // ✅ Remove the token from localStorage
    localStorage.removeItem('adminToken');

    // ✅ Redirect to login page
    navigate('/login');
  };

  useEffect(() => {

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center w-full">
      <div className="text-xl font-semibold text-gray-700">Order Management</div>

      <div className="flex space-x-4">
       

        {/* 🔐 Logout button now uses a function */}

        {isLoggedIn ?
          <button
            onClick={handleLogout}
            className="border-4 border-green-500 text-green-600 px-4 py-2 rounded hover:bg-green-50 transition"
          >
            Logout
          </button> :  <Link
          to="/login"
          className="border  text-green-600 px-4 py-2 rounded hover:bg-green-50 transition"
        >
          Login
        </Link>}
      </div>
    </nav>
  );
};

export default Navbar;
