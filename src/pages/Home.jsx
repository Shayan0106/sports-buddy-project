import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
        // Query to order events by creation date, newest first
        const q = query(eventsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) {
    return <div className="text-center p-10">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Upcoming Events</h1>
        <Link to="/add-event" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow-md">
          <p>No events found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
                <p className="text-md text-indigo-600 font-semibold mb-2">{event.sport}</p>
                <p className="text-sm text-gray-600 mb-4">{event.location}</p>
              </div>
              <div className="text-right text-xs text-gray-500 mt-4">
                <p>Event Time: {new Date(event.dateTime).toLocaleString()}</p>
                <p>Posted by: {event.creatorEmail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;