import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EditEvent = () => {
  const { eventId } = useParams(); // Get the event ID from the URL
  const [eventData, setEventData] = useState({
    title: '',
    sport: '',
    location: '',
    dateTime: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDocRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(eventDocRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Security check: ensure the current user is the event creator
          if (currentUser && currentUser.uid === data.createdBy) {
            setEventData({ ...data, dateTime: data.dateTime });
          } else {
            setError('You are not authorized to edit this event.');
            navigate('/'); // Redirect if not authorized
          }
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to fetch event data.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchEvent();
    }
  }, [eventId, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventDocRef = doc(db, 'events', eventId);
      await updateDoc(eventDocRef, eventData);
      navigate('/'); // Navigate to home on success
    } catch (err) {
      console.error('Error updating document:', err);
      setError('Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading event...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold text-center text-gray-900">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField label="Event Title" name="title" value={eventData.title} onChange={handleChange} required />
          <InputField label="Sport" name="sport" value={eventData.sport} onChange={handleChange} required />
          <InputField label="Location / Area" name="location" value={eventData.location} onChange={handleChange} required />
          <InputField label="Date and Time" name="dateTime" type="datetime-local" value={eventData.dateTime} onChange={handleChange} required />
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
            {loading ? 'Updating...' : 'Update Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper component for form fields
const InputField = ({ label, name, type = 'text', value, onChange, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input id={name} name={name} type={type} value={value} onChange={onChange} required={required} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
  </div>
);

export default EditEvent;