import axios from 'axios';

console.log("🟢 [apiClient] Initializing API client");

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [(data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ [apiClient] Error parsing response:', error);
      return data;
    }
  }]
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log('🔑 [apiClient] Adding auth token to request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [apiClient] Token added to headers');
    } else {
      console.warn('⚠️ [apiClient] No auth token found');
    }
    return config;
  },
  (error) => {
    console.error('❌ [apiClient] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ [apiClient] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ [apiClient] ${error.response.status} ${error.config?.method?.toUpperCase() || 'REQUEST'} ${error.config?.url || 'unknown'}`, {
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          console.warn('⚠️ [apiClient] 401 Unauthorized - Invalid or missing token');
          // Only handle 401 if we're not already on the login page
          if (window.location.pathname !== '/login') {
            console.log('🔐 [apiClient] Redirecting to login...');
            localStorage.removeItem('authToken');
            // Use window.location to force a full page reload and reset app state
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('🔒 [apiClient] 403 Forbidden - Insufficient permissions');
          break;
        case 404:
          console.error('🔍 [apiClient] 404 Not Found - Resource does not exist');
          break;
        case 500:
          console.error('💥 [apiClient] 500 Server Error - Please try again later');
          break;
        default:
          console.error(`⚠️ [apiClient] ${error.response.status} Error:`, error.message);
      }
    } else if (error.request) {
      console.error('❌ [apiClient] No response received:', error.request);
    } else {
      console.error('❌ [apiClient] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export { apiClient };
export default apiClient;
