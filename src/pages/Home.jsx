import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ImageSlider from '../components/ImageSlider';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const sliderImages = [
    'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2010&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1590179400482-1fd88a562fc0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollectionRef = collection(db, 'events');
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
  }, []);

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const eventDoc = doc(db, 'events', eventId);
        await deleteDoc(eventDoc);
        setEvents(events.filter(event => event.id !== eventId));
      } catch (err) {
        console.error("Error deleting event:", err);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.sport.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center p-10">Loading events...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div>
      <div className="relative">
        <ImageSlider images={sliderImages} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-md">Find Your Teammate</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-md">Join millions of players and find a partner for your favorite sport anytime, anywhere.</p>
        </div>
      </div>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Upcoming Events</h2>
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by title, sport, or location..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/add-event" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 w-full md:w-auto text-center">
            + Create Event
          </Link>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg shadow-md">
            <p>No events match your search. Try another term or create a new event!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                onClick={() => navigate(`/event/${event.id}`)}
                className="group cursor-pointer rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative h-56">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-500 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">{event.sport}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 text-white">
                    <h2 className="text-xl font-bold">{event.title}</h2>
                    <p className="text-sm">{event.location}</p>
                  </div>
                </div>
                {currentUser && currentUser.uid === event.createdBy && (
                  <div className="bg-gray-50 px-4 py-2 flex justify-end space-x-2">
                    <Link to={`/edit-event/${event.id}`} onClick={(e) => e.stopPropagation()} className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
                      Edit
                    </Link>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }} className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;