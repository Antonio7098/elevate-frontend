import axios from 'axios';

// Development mode flag - set to true to use mock data
const USE_MOCK_DATA = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_AUTH === 'true';

console.log("🟢 [apiClient] Initializing API client");

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [(data) => {
    // Only attempt to parse JSON when the payload looks like JSON
    try {
      if (typeof data !== 'string') return data;
      const trimmed = data.trim();
      if (!trimmed) return data;
      const looksLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[');
      if (!looksLikeJson) {
        // Likely HTML or plain text (e.g., error pages). Return as-is.
        return data;
      }
      return JSON.parse(trimmed);
    } catch (error) {
      console.warn('⚠️ [apiClient] Non-JSON response received; passing through raw data');
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
      // Only warn for non-auth endpoints
      const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
      if (!isAuthEndpoint) {
        console.warn('⚠️ [apiClient] No auth token found');
      }
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
      const suppress404 = (
        (error.config?.headers as Record<string, string> | undefined)?.['X-Suppress-404-Log'] === 'true'
      );
      const status = error.response.status;
      const method = error.config?.method?.toUpperCase() || 'REQUEST';
      const url = error.config?.url || 'unknown';

      if (status === 404 && suppress404) {
        console.info(`ℹ️ [apiClient] 404 (suppressed) ${method} ${url}`);
      } else {
        console.error(`❌ [apiClient] ${status} ${method} ${url}`, {
          data: error.response.data,
          headers: error.response.headers
        });
      }
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          console.warn('⚠️ [apiClient] 401 Unauthorized - Invalid or missing token');
          // Only handle 401 if we're not using mock data and not already on the login page
          if (!USE_MOCK_DATA && window.location.pathname !== '/login') {
            console.log('🔐 [apiClient] Redirecting to login...');
            localStorage.removeItem('authToken');
            // Use window.location to force a full page reload and reset app state
            window.location.href = '/login';
          } else if (USE_MOCK_DATA) {
            console.log('🎭 [apiClient] Ignoring 401 error in mock mode');
          }
          break;
        case 403:
          console.error('🔒 [apiClient] 403 Forbidden - Insufficient permissions');
          break;
        case 404:
          if (!suppress404) {
            console.error('🔍 [apiClient] 404 Not Found - Resource does not exist');
          }
          break;
        case 500:
          console.error('💥 [apiClient] 500 Server Error - Please try again later');
          break;
        default:
          console.error(`⚠️ [apiClient] ${error.response.status} Error:`, error.message);
      }
    } else if (error.request) {
      console.error('❌ [apiClient] No response received. This could be a network error or the server might be down.', {
        request: error.request,
        message: error.message,
      });
      // Add a more user-friendly tip for the most common cause of this error.
      if (error.message === 'Network Error') {
        console.error('💡 Tip: Please check if your backend server is running on http://localhost:3000 and that there are no network connectivity issues.');
      }
    } else {
      console.error('❌ [apiClient] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export { apiClient };
export default apiClient;
