import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ItineraryResult = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchItinerary();
    }
  }, [id]);

  const fetchItinerary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/itinerary/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setItinerary(response.data.data);
      } else {
        toast.error('Failed to load itinerary');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load itinerary');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/itinerary/${id}/share`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        navigator.clipboard.writeText(response.data.data.shareUrl);
        toast.success('Share link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Loading your itinerary...</p>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🗺️</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Itinerary Found</h2>
        <p className="text-gray-500 mb-6">Upload a travel document to create your personalized itinerary</p>
        <button onClick={() => navigate('/upload')} className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          Upload Document →
        </button>
      </div>
    );
  }

  const data = itinerary.itineraryData || {};
  const days = data.dailyItinerary || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section with Parallax Effect */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/80 hover:text-white mb-6 inline-flex items-center gap-2 text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition"
          >
            ← Back to Dashboard
          </button>
          
          <div className="flex flex-wrap justify-between items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-4 backdrop-blur-sm">
                <span>✈️</span>
                <span>AI Generated Itinerary</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{itinerary.title || 'My Travel Plan'}</h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                {itinerary.destination && (
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{itinerary.destination}</span>
                  </div>
                )}
                {itinerary.startDate && itinerary.endDate && (
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}</span>
                  </div>
                )}
                {itinerary.duration && (
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{itinerary.duration} days</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl transition flex items-center gap-2"
              >
                <span>🔗</span>
                <span>Share</span>
              </button>
              <button
                onClick={() => window.print()}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl transition flex items-center gap-2"
              >
                <span>🖨️</span>
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Trip Summary Card */}
        {data.summary && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📖</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Trip Overview</h3>
                <p className="text-gray-600 leading-relaxed">{data.summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">🏨</div>
            <p className="text-xs text-gray-500">Accommodation</p>
            <p className="font-semibold text-gray-800 text-sm">{data.bookings?.hotels?.[0]?.name || 'Hotel Included'}</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">✈️</div>
            <p className="text-xs text-gray-500">Transport</p>
            <p className="font-semibold text-gray-800 text-sm">{data.bookings?.flights?.[0]?.airline || 'Flight Included'}</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">☀️</div>
            <p className="text-xs text-gray-500">Weather</p>
            <p className="font-semibold text-gray-800 text-sm">{data.weather || 'Pleasant'}</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">💰</div>
            <p className="text-xs text-gray-500">Est. Budget</p>
            <p className="font-semibold text-gray-800 text-sm">{data.budget?.estimatedTotal || 'TBD'}</p>
          </div>
        </div>

        {/* Day Tabs Navigation */}
        {days.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
              {days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    activeDay === idx
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  Day {day.day || idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Day Content */}
        {days.length > 0 && days[activeDay] && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-10">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Day {days[activeDay].day || activeDay + 1}
                    {days[activeDay].date && (
                      <span className="text-gray-500 text-lg font-normal ml-2">
                        {new Date(days[activeDay].date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                    )}
                  </h2>
                  {days[activeDay].theme && (
                    <p className="text-blue-600 text-sm mt-1">{days[activeDay].theme}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {activeDay > 0 && (
                    <button
                      onClick={() => setActiveDay(activeDay - 1)}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      ← Previous
                    </button>
                  )}
                  {activeDay < days.length - 1 && (
                    <button
                      onClick={() => setActiveDay(activeDay + 1)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Next Day →
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Timeline Activities */}
              <div className="relative">
                <div className="absolute left-[70px] top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block"></div>
                {days[activeDay].activities?.map((activity, idx) => (
                  <div key={idx} className="relative flex flex-wrap md:flex-nowrap gap-4 mb-6 group">
                    <div className="md:w-[100px] flex-shrink-0">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block shadow-md">
                        {activity.time || 'TBD'}
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 group-hover:shadow-md transition-all">
                      <h4 className="font-semibold text-gray-900 text-lg">{activity.activity}</h4>
                      {activity.location && (
                        <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                          <span>📍</span> {activity.location}
                          {activity.duration && <span className="ml-3">⏱️ {activity.duration}</span>}
                        </p>
                      )}
                      {activity.notes && (
                        <div className="mt-3 bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                          <span className="font-medium">💡 Tip:</span> {activity.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Meals Section */}
              {days[activeDay].meals && (
                <div className="mt-8 p-5 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span>🍽️</span> Dining Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {days[activeDay].meals.breakfast && (
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">Breakfast</p>
                        <p className="font-medium text-gray-800">{days[activeDay].meals.breakfast}</p>
                      </div>
                    )}
                    {days[activeDay].meals.lunch && (
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">Lunch</p>
                        <p className="font-medium text-gray-800">{days[activeDay].meals.lunch}</p>
                      </div>
                    )}
                    {days[activeDay].meals.dinner && (
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-500">Dinner</p>
                        <p className="font-medium text-gray-800">{days[activeDay].meals.dinner}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Two Column Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {data.tips && data.tips.length > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">💡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Pro Travel Tips</h3>
              </div>
              <ul className="space-y-3">
                {data.tips.slice(0, 5).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.packingSuggestions && data.packingSuggestions.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🎒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Packing Checklist</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.packingSuggestions.map((item, idx) => (
                  <span key={idx} className="bg-white px-4 py-2 rounded-full text-sm text-gray-700 shadow-sm hover:shadow-md transition">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations Section */}
        {data.recommendations && (
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">You Might Also Like</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.recommendations.restaurants && data.recommendations.restaurants.length > 0 && (
                <div>
                  <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span>🍜</span> Top Restaurants
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.recommendations.restaurants.slice(0, 4).map((rest, idx) => (
                      <span key={idx} className="bg-white px-3 py-1.5 rounded-lg text-sm text-gray-700 shadow-sm">
                        {rest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.recommendations.attractions && data.recommendations.attractions.length > 0 && (
                <div>
                  <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span>🏛️</span> Must-See Attractions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.recommendations.attractions.slice(0, 4).map((attr, idx) => (
                      <span key={idx} className="bg-white px-3 py-1.5 rounded-lg text-sm text-gray-700 shadow-sm">
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Budget Breakdown */}
        {data.budget && data.budget.breakdown && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Budget Breakdown</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(data.budget.breakdown).map(([key, value]) => (
                <div key={key} className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 capitalize">{key}</p>
                  <p className="font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-right">
              <p className="text-sm text-gray-500">Estimated Total</p>
              <p className="text-2xl font-bold text-gray-900">{data.budget.estimatedTotal}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryResult;