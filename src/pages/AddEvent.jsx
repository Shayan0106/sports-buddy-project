import React, { useState, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { AuthContext, useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [eventDetails, setEventDetails] = useState({
    title: '',
    sport: '',
    city: '',
    area: '',
    dateTime: '',
  });

  const [sports, setSports] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDataForDropdowns = async (collectionName, setState) => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setState(data);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
        setError(`Failed to load ${collectionName}.`);
      }
    };

    fetchDataForDropdowns('categories', setSports);
    fetchDataForDropdowns('cities', setCities);
  }, []);

  useEffect(() => {
    const fetchAreasForCity = async () => {
      if (!eventDetails.city) {
        setAreas([]);
        return;
      }
      
      try {
        setAreas([]);
        const areasQuery = query(collection(db, "areas"), where("cityName", "==", eventDetails.city));
        const querySnapshot = await getDocs(areasQuery);
        const cityAreas = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setAreas(cityAreas);
      } catch (err) {
        console.error("Error fetching areas:", err);
        setError('Failed to load areas for the selected city.');
      }
    };

    fetchAreasForCity();
  }, [eventDetails.city]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'city') {
        setEventDetails(prev => ({ ...prev, city: value, area: '' }));
    } else {
        setEventDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError("Please log in to create an event.");
      return;
    }
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'events'), {
        ...eventDetails,
        createdBy: currentUser.uid,
        creatorEmail: currentUser.email,
        createdAt: new Date(),
      });

      setIsLoading(false);
      alert('Event created successfully!');
      navigate('/');
    } catch (err) {
      setIsLoading(false);
      console.error("Error creating event: ", err);
      setError("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900">Create a New Sports Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="title" className="sr-only">Event Title</label>
            <input id="title" type="text" name="title" placeholder="Event Title" value={eventDetails.title} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"/>
          </div>

          <select name="sport" value={eventDetails.sport} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500">
            <option value="">Select Sport</option>
            {sports.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>

          <select name="city" value={eventDetails.city} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500">
            <option value="">Select City</option>
            {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>

          <select name="area" value={eventDetails.area} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md disabled:bg-gray-200 focus:ring-2 focus:ring-indigo-500" disabled={!eventDetails.city || areas.length === 0}>
            <option value="">{eventDetails.city ? 'Select Area' : 'Select a City first'}</option>
            {areas.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>

          <input type="datetime-local" name="dateTime" value={eventDetails.dateTime} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
          
          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full p-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-semibold">
            {isLoading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;