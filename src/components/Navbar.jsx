import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Sports Buddy
        </Link>
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              {userRole === 'admin' && (
                <Link 
                  to="/admin" 
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                >
                  Admin
                </Link>
              )}
              <Link 
                to="/add-event" 
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Create Event
              </Link>
              
              {/* This is the changed part: email is now a link to the profile page */}
              <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                {currentUser.email}
              </Link>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;