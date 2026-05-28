import axiosInstance from '../api/axiosConfig';
import API_ENDPOINTS from '../api/endpoints';

const authService = {
  register: async (name, email, password) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },
};

export default authService;