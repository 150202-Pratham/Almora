import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Request interceptor - Add JWT token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiration and parse responses
axiosInstance.interceptors.response.use(
  (response) => {
    // If response data is a JSON string, parse it
    if (typeof response.data === 'string') {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        console.warn('Could not parse response as JSON:', e);
        // If parsing fails, try to clean up the string and parse again
        try {
          // Find the last valid closing bracket and truncate there
          let cleaned = response.data;
          const lastValidIndex = cleaned.lastIndexOf('"}]');
          if (lastValidIndex !== -1) {
            cleaned = cleaned.substring(0, lastValidIndex + 3);
            response.data = JSON.parse(cleaned);
            console.log('Successfully parsed cleaned response');
          }
        } catch (e2) {
          console.error('Failed to parse even after cleaning:', e2);
        }
      }
    }

    // Clean up circular references in nested objects
    if (Array.isArray(response.data)) {
      response.data = response.data.map(item => cleanObject(item));
    } else if (typeof response.data === 'object') {
      response.data = cleanObject(response.data);
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to clean circular references
function cleanObject(obj, depth = 0, maxDepth = 2) {
  if (depth > maxDepth || !obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item, depth + 1, maxDepth));
  }

  const cleaned = {};
  for (const key in obj) {
    if (key === 'reviews' || key === 'product' || key === 'user') {
      // Skip these at deeper levels to prevent circular references
      if (depth < maxDepth) {
        if (key === 'reviews' && Array.isArray(obj[key])) {
          // Remove reviews to prevent circular nesting
          cleaned[key] = [];
        } else {
          cleaned[key] = cleanObject(obj[key], depth + 1, maxDepth);
        }
      }
    } else {
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        cleaned[key] = cleanObject(value, depth + 1, maxDepth);
      } else {
        cleaned[key] = value;
      }
    }
  }

  return cleaned;
}

export default axiosInstance;