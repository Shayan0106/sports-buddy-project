import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import AddEvent from './pages/AddEvent';
import ProtectedRoute from './components/ProtectedRoute';
import EditEvent from './pages/EditEvent';
import EventDetails from './pages/EventDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import Profile from './pages/Profile'; // This import was added

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event/:eventId" element={<EventDetails />} />

          {/* Protected Routes (for logged-in users) */}
          <Route path="/add-event" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
          <Route path="/edit-event/:eventId" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> {/* This route was added */}
          
          {/* Admin Route */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;