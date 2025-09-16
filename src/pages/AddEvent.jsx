import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    title: '',
    sport: '',
    location: '',
    dateTime: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create an event.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'events'), {
        ...eventData,
        createdBy: currentUser.uid,
        creatorEmail: currentUser.email,
        createdAt: serverTimestamp(),
      });
      navigate('/'); // Navigate to home on success
    } catch (err) {
      console.error('Error adding document: ', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create a New Sports Event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields */}
          <InputField label="Event Title" name="title" value={eventData.title} onChange={handleChange} required />
          <InputField label="Sport" name="sport" value={eventData.sport} onChange={handleChange} placeholder="e.g., Cricket, Football" required />
          <InputField label="Location / Area" name="location" value={eventData.location} onChange={handleChange} required />
          <InputField label="Date and Time" name="dateTime" type="datetime-local" value={eventData.dateTime} onChange={handleChange} required />
          
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper component for form fields to avoid repetition
const InputField = ({ label, name, type = 'text', value, onChange, placeholder = '', required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

export default AddEvent;