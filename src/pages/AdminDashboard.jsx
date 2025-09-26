import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const AdminDashboard = () => {
  const [newCategory, setNewCategory] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newArea, setNewArea] = useState('');
  const [selectedCityForArea, setSelectedCityForArea] = useState('');

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  const fetchData = async (collectionName, setState) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setState(data);
    } catch (error) {
      console.error(`Error fetching ${collectionName}: `, error);
    }
  };

  useEffect(() => {
    fetchData('categories', setCategories);
    fetchData('cities', setCities);
    fetchData('areas', setAreas);
  }, []);

  const handleAdd = async (collectionName, value, resetState, additionalData = {}) => {
    if (!value || (collectionName === 'areas' && !selectedCityForArea)) {
      alert(`Please fill out all fields.`);
      return;
    }
    try {
      await addDoc(collection(db, collectionName), { name: value, ...additionalData });
      resetState('');
      fetchData(collectionName, eval(`set${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}`));
       if (collectionName === 'areas') setSelectedCityForArea('');
    } catch (error) {
      console.error(`Error adding to ${collectionName}: `, error);
    }
  };

  const handleDelete = async (collectionName, id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchData(collectionName, eval(`set${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}`));
    } catch (error) {
      console.error(`Error deleting from ${collectionName}: `, error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Manage Sports Categories */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Manage Sports Categories</h2>
          <div className="flex">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={() => handleAdd('categories', newCategory, setNewCategory)} className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700">Add</button>
          </div>
          <ul className="mt-4 space-y-2">
            {categories.map(cat => (
              <li key={cat.id} className="flex justify-between items-center p-2 border-b">{cat.name} <button onClick={() => handleDelete('categories', cat.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button></li>
            ))}
          </ul>
        </div>

        {/* Manage Cities */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Manage Cities</h2>
          <div className="flex">
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="New city name"
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={() => handleAdd('cities', newCity, setNewCity)} className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700">Add</button>
          </div>
          <ul className="mt-4 space-y-2">
            {cities.map(city => (
              <li key={city.id} className="flex justify-between items-center p-2 border-b">{city.name} <button onClick={() => handleDelete('cities', city.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button></li>
            ))}
          </ul>
        </div>

        {/* Manage Areas (with city dropdown) */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Manage Areas</h2>
          <div className="space-y-4">
             <select
              value={selectedCityForArea}
              onChange={(e) => setSelectedCityForArea(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a City first</option>
              {cities.map(city => (
                <option key={city.id} value={city.name}>{city.name}</option>
              ))}
            </select>
            <div className="flex">
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="New area name"
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-indigo-500"
                disabled={!selectedCityForArea}
              />
              <button
                onClick={() => handleAdd('areas', newArea, setNewArea, { cityName: selectedCityForArea })}
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 disabled:bg-gray-400"
                disabled={!selectedCityForArea}
              >
                Add
              </button>
            </div>
          </div>
           <ul className="mt-4 space-y-2">
            {areas.map(area => (
              <li key={area.id} className="flex justify-between items-center p-2 border-b">
                <span>{area.name} <span className="text-gray-500 text-sm">({area.cityName})</span></span>
                <button onClick={() => handleDelete('areas', area.id)} className="text-red-500 hover:text-red-700 font-semibold">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;