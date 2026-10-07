import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://127.0.0.1:3000/api';
  }
  // For physical devices, you must change '127.0.0.1' below to your PC's IPv4 address.
  return 'http://127.0.0.1:3000/api';
};

const baseURL = getBaseUrl();
console.warn('=== THE APP IS TRYING TO CONNECT TO ===', baseURL);

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the JWT token automatically
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
