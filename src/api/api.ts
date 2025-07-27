import axios from 'axios';

// Log the environment variables for debugging
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

// Ensure baseURL doesn't end with a slash
const getBaseUrl = () => {
  const baseURL = (() => {
    const url = import.meta.env.VITE_API_URL;
    if (url === '/api' || url === '/api/') {
      // If VITE_API_URL is '/api' (often a misconfiguration for proxy setups where paths already include /api),
      // set baseURL to '' so that paths like '/api/xyz' resolve correctly to 'http://host/api/xyz'.
      return '';
    }
    // If VITE_API_URL is a full URL (e.g., for production or specific dev setups), use it.
    // If VITE_API_URL is empty or undefined, default to '' for relative paths (good for Vite proxy).
    return url || '';
  })();
  console.log('[API] Base URL:', baseURL);
  return baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Add request interceptor for auth tokens if needed
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.params || '');
    const token = localStorage.getItem('authToken');
    console.log('[API] authToken from localStorage:', token);
    if (token) {
      console.log('[API] authToken exists, setting Authorization header.');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('[API] authToken does not exist or is empty.');
    }
    console.log('[API] Request Headers (after attempting to set Auth):', config.headers);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('[API] Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('[API] No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[API] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized access - please log in');
    }
    return Promise.reject(error);
  }
);

export default api;
