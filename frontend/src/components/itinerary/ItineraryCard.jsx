import React from 'react';
import { useNavigate } from 'react-router-dom';

const ItineraryCard = ({ itinerary }) => {
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return 'Dates TBD';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div
      onClick={() => navigate(`/itinerary/${itinerary._id}`)}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-all"
    >
      <h3 className="font-semibold text-gray-900 text-lg mb-2">
        {itinerary.title || 'My Travel Plan'}
      </h3>
      {itinerary.destination && (
        <p className="text-sm text-gray-600 mb-1">
          📍 {itinerary.destination}
        </p>
      )}
      <p className="text-sm text-gray-500">
        📅 {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
      </p>
      {itinerary.duration && (
        <p className="text-sm text-gray-500 mt-1">
          ⏱️ {itinerary.duration} days
        </p>
      )}
      <p className="text-xs text-gray-400 mt-3">
        Created: {new Date(itinerary.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ItineraryCard;