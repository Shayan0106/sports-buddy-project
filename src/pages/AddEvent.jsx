import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config/firebase'; // Import storage
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage functions

// Reusable SelectField and InputField components (remain the same)
const SelectField = ({ label, name, value, onChange, options, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="" disabled>Select {label}</option>
      {options.map(option => (
        <option key={option.id} value={option.name}>{option.name}</option>
      ))}
    </select>
  </div>
);

const InputField = ({ label, name, type = 'text', value, onChange, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    title: '',
    sport: '',
    city: '',
    area: '',
    dateTime: '',
  });

  const [imageUpload, setImageUpload] = useState(null); // New state for image file
  const [imageUrl, setImageUrl] = useState(''); // New state for uploaded image URL

  // State for dropdown options (remain the same)
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch data for dropdowns (remains the same)
  useEffect(() => {
    const fetchData = async (collectionName, setState) => {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, orderBy('name'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setState(data);
    };

    fetchData('categories', setCategories);
    fetchData('cities', setCities);
    fetchData('areas', setAreas);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageUpload(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to create an event.');
      return;
    }
    setLoading(true);
    setError('');

    let uploadedImageUrl = '';
    // --- Image Upload Logic ---
    if (imageUpload) {
      try {
        const imageRef = ref(storage, `event_images/${imageUpload.name + Date.now()}`); // Unique file name
        await uploadBytes(imageRef, imageUpload);
        uploadedImageUrl = await getDownloadURL(imageRef);
        setImageUrl(uploadedImageUrl); // Set URL in state if needed elsewhere
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        setError("Failed to upload image. Please try again.");
        setLoading(false);
        return;
      }
    }
    // --- End Image Upload Logic ---

    try {
      await addDoc(collection(db, 'events'), {
        ...eventData,
        imageUrl: uploadedImageUrl, // Save the image URL
        createdBy: currentUser.uid,
        creatorEmail: currentUser.email,
        createdAt: serverTimestamp(),
      });
      navigate('/');
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
          <InputField label="Event Title" name="title" value={eventData.title} onChange={handleChange} required />
          
          <SelectField label="Sport" name="sport" value={eventData.sport} onChange={handleChange} options={categories} required />
          <SelectField label="City" name="city" value={eventData.city} onChange={handleChange} options={cities} required />
          <SelectField label="Area" name="area" value={eventData.area} onChange={handleChange} options={areas} required />

          <InputField label="Date and Time" name="dateTime" type="datetime-local" value={eventData.dateTime} onChange={handleChange} required />
          
          {/* New Image Upload Field */}
          <div>
            <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">Event Image</label>
            <input
              type="file"
              id="imageUpload"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={handleImageChange}
            />
          </div>

          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;