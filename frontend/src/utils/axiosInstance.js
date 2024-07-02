import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Update with the deployed backend URL in production
});

export default axiosInstance;