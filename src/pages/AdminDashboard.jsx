import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';

// A reusable component for our management sections
const ManagementSection = ({ title, items, onAddItem, onDeleteItem, newItem, setNewItem, placeholder }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <form onSubmit={onAddItem} className="flex gap-4 mb-6">
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder={placeholder}
        className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        Add
      </button>
    </form>
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
          <span>{item.name}</span>
          <button onClick={() => onDeleteItem(item.id)} className="px-3 py-1 text-xs text-white bg-red-500 rounded-md hover:bg-red-600">
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
);

const AdminDashboard = () => {
  // State for categories, cities, and areas
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);

  // State for new item inputs
  const [newCategory, setNewCategory] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newArea, setNewArea] = useState('');

  const [loading, setLoading] = useState(false);

  // Generic fetch function
  const fetchData = async (collectionName, setState) => {
    setLoading(true);
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setState(fetchedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData('categories', setCategories);
    fetchData('cities', setCities);
    fetchData('areas', setAreas);
  }, []);

  // Generic add item function
  const handleAddItem = async (collectionName, itemName, setItemName, refetch) => {
    if (itemName.trim() === '') return;
    try {
      await addDoc(collection(db, collectionName), { name: itemName.trim() });
      setItemName('');
      refetch();
    } catch (error) {
      console.error(`Error adding to ${collectionName}: `, error);
    }
  };

  // Generic delete item function
  const handleDeleteItem = async (collectionName, itemId, refetch) => {
    if (window.confirm(`Are you sure you want to delete this item?`)) {
      try {
        await deleteDoc(doc(db, collectionName, itemId));
        refetch();
      } catch (error) {
        console.error(`Error deleting from ${collectionName}: `, error);
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {loading && <p>Loading data...</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ManagementSection
          title="Manage Sports Categories"
          items={categories}
          onAddItem={(e) => { e.preventDefault(); handleAddItem('categories', newCategory, setNewCategory, () => fetchData('categories', setCategories)); }}
          onDeleteItem={(id) => handleDeleteItem('categories', id, () => fetchData('categories', setCategories))}
          newItem={newCategory}
          setNewItem={setNewCategory}
          placeholder="New category name"
        />
        <ManagementSection
          title="Manage Cities"
          items={cities}
          onAddItem={(e) => { e.preventDefault(); handleAddItem('cities', newCity, setNewCity, () => fetchData('cities', setCities)); }}
          onDeleteItem={(id) => handleDeleteItem('cities', id, () => fetchData('cities', setCities))}
          newItem={newCity}
          setNewItem={setNewCity}
          placeholder="New city name"
        />
        <ManagementSection
          title="Manage Areas"
          items={areas}
          onAddItem={(e) => { e.preventDefault(); handleAddItem('areas', newArea, setNewArea, () => fetchData('areas', setAreas)); }}
          onDeleteItem={(id) => handleDeleteItem('areas', id, () => fetchData('areas', setAreas))}
          newItem={newArea}
          setNewItem={setNewArea}
          placeholder="New area name"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;