import axiosInstance from './axios';

const authService = {
  // Register new user - Uses /api/users/register
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/users/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      // Store user data and email for subsequent requests
      if (response.data) {
        const userData = response.data.user || response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userEmail', credentials.email);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get user email
  getUserEmail: () => {
    return localStorage.getItem('userEmail');
  },

  // Reset password - Uses /api/auth/resetPassword
  resetPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/auth/resetPassword', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },

  // Get user by email
  getUserByEmail: async (email) => {
    try {
      const response = await axiosInstance.get('/users/byEmail', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updateData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, updateData);
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Update user password
  updatePassword: async (userId, passwordData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update password' };
    }
  },
};

export default authService;