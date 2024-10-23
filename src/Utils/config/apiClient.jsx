import axios from 'axios';

const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL ; // Fallback to localhost if the env variable is not set

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient._get = async (url, params) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('GET request failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

apiClient._post = async (url, data) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    console.error('POST request failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

apiClient._patch = async (url, data) => {
  try {
    const response = await apiClient.patch(url, data);
    return response.data;
  } catch (error) {
    console.error('PATCH request failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

apiClient._delete = async (url) => {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    console.error('DELETE request failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default apiClient;
