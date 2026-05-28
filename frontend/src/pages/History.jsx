import React, { useState, useEffect } from 'react';
import itineraryService from '../../services/itineraryService';
import ItineraryCard from '../components/itinerary/ItineraryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const History = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await itineraryService.getHistory();
      setItineraries(response.data.itineraries || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Itinerary History</h1>
        <p className="text-gray-600 mt-1">View all your generated travel plans</p>
      </div>

      {itineraries.length === 0 ? (
        <EmptyState 
          title="No itineraries found" 
          message="Upload travel documents to generate your first itinerary"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <ItineraryCard key={itinerary._id} itinerary={itinerary} />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;