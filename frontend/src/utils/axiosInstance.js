import axios from 'axios';
import { baseURL } from '../constants/APIConstants';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
