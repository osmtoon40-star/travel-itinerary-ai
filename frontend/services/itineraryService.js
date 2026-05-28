import axiosInstance from '../api/axiosConfig';
import API_ENDPOINTS from '../api/endpoints';

const itineraryService = {
  generateItinerary: async (documentId, title) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ITINERARY.GENERATE, {
      documentId,
      title,
    });
    return response.data;
  },

  getHistory: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.ITINERARY.HISTORY);
    return response.data;
  },
};

export default itineraryService;