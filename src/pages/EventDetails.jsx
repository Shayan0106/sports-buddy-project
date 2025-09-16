import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ... fetchEvent function remains the same ...
    const fetchEvent = async () => {
      try {
        const eventDocRef = doc(db, 'events', eventId);
        const docSnap = await getDoc(eventDocRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
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
    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="text-center p-10">Loading event details...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto overflow-hidden">
        {/* Event Image */}
        {event.imageUrl && (
          <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover" />
        )}

        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{event.title}</h1>
          <p className="text-2xl text-indigo-600 font-semibold mb-4">{event.sport}</p>
          <div className="border-t border-gray-200 my-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-bold mb-1">Location</h3>
              <p>{event.city}, {event.area}</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Date & Time</h3>
              <p>{new Date(event.dateTime).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Posted By</h3>
              <p>{event.creatorEmail}</p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Created On</h3>
              <p>{event.createdAt.toDate().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/" className="px-6 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              &larr; Back to All Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;