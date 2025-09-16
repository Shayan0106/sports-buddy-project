import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const eventsRef = collection(db, 'events');
        // Create a query to get events created by the current user
        const q = query(
          eventsRef,
          where('createdBy', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const userEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyEvents(userEvents);
      } catch (err) {
        console.error("Error fetching user events:", err);
        setError("Could not load your events.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [currentUser]);

  if (loading) {
    return <div className="text-center p-10">Loading profile...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="mt-2 text-gray-600"><strong>Email:</strong> {currentUser?.email}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">My Created Events</h2>
        {myEvents.length > 0 ? (
          <div className="space-y-4">
            {myEvents.map(event => (
              <div key={event.id} className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.sport} - {new Date(event.dateTime).toLocaleDateString()}</p>
                </div>
                <Link to={`/event/${event.id}`} className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>You have not created any events yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;