import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalDays: 0,
    destinations: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/itinerary/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const trips = response.data.data.itineraries || [];
      setItineraries(trips);
      
      // Calculate stats
      const totalDays = trips.reduce((sum, trip) => sum + (trip.duration || 0), 0);
      const destinations = [...new Set(trips.map(trip => trip.destination).filter(Boolean))];
      
      setStats({
        totalTrips: trips.length,
        totalDays: totalDays,
        destinations: destinations.length
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-2xl p-8 mb-8 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-wrap justify-between items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-4 backdrop-blur-sm">
              <span>✈️</span>
              <span>AI Travel Assistant</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Traveler'}! 👋
            </h1>
            <p className="text-blue-100 max-w-md">
              Your AI-powered travel companion is ready to help you plan amazing journeys.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/upload')}
            className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
          >
            <span>✨</span>
            <span>New Trip</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Trips</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTrips}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Travel Days</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDays}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Destinations</p>
              <p className="text-3xl font-bold text-gray-900">{stats.destinations}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div 
          onClick={() => navigate('/upload')}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 cursor-pointer group hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Start a new adventure</p>
              <p className="text-white text-xl font-semibold">Upload Travel Document</p>
              <p className="text-white/60 text-sm mt-2">Upload flight tickets, hotel bookings, or any travel document</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          onClick={() => navigate('/history')}
          className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 cursor-pointer group hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">View all your trips</p>
              <p className="text-white text-xl font-semibold">Trip History</p>
              <p className="text-white/60 text-sm mt-2">Browse and manage all your generated itineraries</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Itineraries Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Trips</h2>
            <p className="text-gray-500 text-sm mt-1">Your recently generated itineraries</p>
          </div>
          {itineraries.length > 0 && (
            <button
              onClick={() => navigate('/history')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All <span>→</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : itineraries.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="text-7xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Upload your first travel document to generate an AI-powered itinerary
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition"
            >
              ✨ Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.slice(0, 3).map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/itinerary/${item._id}`)}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>
                  <div className="absolute bottom-3 left-4 text-white">
                    <div className="text-sm opacity-90 flex items-center gap-1">
                      <span>✈️</span>
                      <span>{item.destination || 'Upcoming Trip'}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition">
                    {item.title || 'My Travel Plan'}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    {item.startDate && (
                      <div className="flex items-center gap-1">
                        <span>📅</span>
                        <span>{new Date(item.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {item.duration && (
                      <div className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{item.duration} days</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <span className="text-blue-600 text-sm opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                      View Details <span>→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspiration Section */}
      {itineraries.length > 0 && (
        <div className="mt-12 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">💡</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Travel Inspiration</h3>
              <p className="text-sm text-gray-600">Based on your travel style</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4">
              <p className="text-2xl mb-2">🏔️</p>
              <p className="font-medium text-gray-800">Adventure Awaits</p>
              <p className="text-xs text-gray-500">Try hiking, camping, or mountain expeditions</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-2xl mb-2">🏖️</p>
              <p className="font-medium text-gray-800">Beach Paradise</p>
              <p className="text-xs text-gray-500">Relax at tropical beaches and coastal towns</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-2xl mb-2">🏛️</p>
              <p className="font-medium text-gray-800">Cultural Explorer</p>
              <p className="text-xs text-gray-500">Discover museums, history, and local traditions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;