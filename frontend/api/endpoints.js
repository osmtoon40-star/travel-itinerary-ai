const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  UPLOAD: {
    BASE: '/upload',
    GET_ALL: '/upload',
    DELETE: (id) => `/upload/${id}`,
  },
  EXTRACT: {
    PROCESS: (id) => `/extract/process/${id}`,
  },
  ITINERARY: {
    GENERATE: '/itinerary/generate',
    HISTORY: '/itinerary/history',
  },
};

export default API_ENDPOINTS;