import React, { useState, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {
  const { currentUser } = useContext(AuthContext);
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

  // Fetch initial data for Sports and Cities dropdowns when the component loads
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

  // This special hook runs ONLY when the user selects a different city
  useEffect(() => {
    const fetchAreasForCity = async () => {
      // Don't run if no city is selected
      if (!eventDetails.city) {
        setAreas([]); // Clear areas if city is unselected
        return;
      }
      
      try {
        setAreas([]); // Clear old areas while loading new ones
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
  }, [eventDetails.city]); // The key part: this code depends on the city

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If the user changes the city, we must reset the selected area
    if (name === 'city') {
        setEventDetails(prev => ({ ...prev, city: value, area: '' }));
    } else {
        setEventDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!currentUser) {
      setError("Please log in to create an event.");
      return;
    }
    setIsLoading(true);

    try {
      // Add event data to Firestore
      await addDoc(collection(db, 'events'), {
        ...eventDetails,
        createdBy: currentUser.uid,
        creatorEmail: currentUser.email,
        createdAt: new Date(),
      });

      setIsLoading(false);
      alert('Event created successfully!');
      navigate('/'); // Redirect to homepage after success
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
          
          {/* Event Title Input */}
          <div>
            <label htmlFor="title" className="sr-only">Event Title</label>
            <input id="title" type="text" name="title" placeholder="Event Title" value={eventDetails.title} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"/>
          </div>

          {/* Sport Dropdown */}
          <select name="sport" value={eventDetails.sport} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500">
            <option value="">Select Sport</option>
            {sports.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>

          {/* City Dropdown */}
          <select name="city" value={eventDetails.city} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500">
            <option value="">Select City</option>
            {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>

          {/* Area Dropdown (Dependent on City) */}
          <select name="area" value={eventDetails.area} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md disabled:bg-gray-200 focus:ring-2 focus:ring-indigo-500" disabled={!eventDetails.city || areas.length === 0}>
            <option value="">{eventDetails.city ? 'Select Area' : 'Select a City first'}</option>
            {areas.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>

          {/* Date and Time Input */}
          <input type="datetime-local" name="dateTime" value={eventDetails.dateTime} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500" />
          
          {/* Error Message Display */}
          {error && <p className="text-sm text-center text-red-600">{error}</p>}

          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className="w-full p-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-semibold">
            {isLoading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
