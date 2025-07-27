import { apiClient } from './apiClient';
import axios from 'axios';

/**
 * Service for checking the health and availability of API endpoints
 */

// Create a dedicated client for the AI service
const aiServiceClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test123' // Using the same API key as defined in the AI service .env
  },
  timeout: 5000, // 5 second timeout for health checks
  // Add CORS configuration
  withCredentials: true
});

/**
 * Check if the API server is available
 * @returns Promise<boolean> true if the API is available, false otherwise
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    console.log('🩺 [HealthCheck] Checking API health...');
    const response = await apiClient.get('health');
    console.log(`🩺 [HealthCheck] API health check response: ${response.status}`);
    return response.status === 200;
  } catch (error: unknown) {
    console.error('❌ [HealthCheck] API health check failed:', (error as Error).message);
    return false;
  }
};

/**
 * Check if the AI evaluation service is available
 * @returns Promise<boolean> true if the AI service is available, false otherwise
 */
export const checkAiServiceHealth = async (): Promise<boolean> => {
  try {
    console.log('🩺 [HealthCheck] Checking AI service health directly...');
    // Try the health endpoint on the AI service directly
    try {
      const response = await aiServiceClient.get('/api/health');
      console.log(`🩺 [HealthCheck] AI service health check response: ${response.status}`);
      return response.status === 200;
    } catch {
      console.warn('⚠️ [HealthCheck] AI service health check failed, trying alternative endpoint');
      // Try the root endpoint as a fallback
      try {
        const altResponse = await aiServiceClient.get('/api/');
        console.log(`🩺 [HealthCheck] AI service alternative health check response: ${altResponse.status}`);
        return altResponse.status === 200;
      } catch (altError) {
        console.error('❌ [HealthCheck] AI service alternative health check failed:', altError);
        return false;
      }
    }
  } catch (error: unknown) {
    console.error('❌ [HealthCheck] AI service health check failed:', (error as Error).message);
    return false;
  }
};

/**
 * Check both API and AI service health
 * @returns Promise<{apiAvailable: boolean, aiServiceAvailable: boolean}>
 */
export const checkAllServices = async (): Promise<{apiAvailable: boolean, aiServiceAvailable: boolean}> => {
  const apiAvailable = await checkApiHealth();
  const aiServiceAvailable = await checkAiServiceHealth();
  
  console.log(`🔍 [HealthCheck] Services status - API: ${apiAvailable ? '✅' : '❌'}, AI: ${aiServiceAvailable ? '✅' : '❌'}`);
  
  return {
    apiAvailable,
    aiServiceAvailable
  };
};
