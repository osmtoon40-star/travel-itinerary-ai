import axiosInstance from '../api/axiosConfig';
import API_ENDPOINTS from '../api/endpoints';

const uploadService = {
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await axiosInstance.post(API_ENDPOINTS.UPLOAD.BASE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDocuments: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.UPLOAD.GET_ALL);
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.UPLOAD.DELETE(id));
    return response.data;
  },

  processExtraction: async (documentId) => {
    const response = await axiosInstance.post(API_ENDPOINTS.EXTRACT.PROCESS(documentId));
    return response.data;
  },
};

export default uploadService;