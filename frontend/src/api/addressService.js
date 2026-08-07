import axiosInstance from './axios';

const addressService = {
  // Get user's addresses
  getUserAddresses: async (userId) => {
    try {
      const response = await axiosInstance.get(`/addresses/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch addresses' };
    }
  },

  // Add new address
  addAddress: async (userId, addressData) => {
    try {
      const response = await axiosInstance.post(`/addresses/user/${userId}`, {
        fullName: addressData.fullName,
        phoneNumber: addressData.phone,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country || 'India',
        defaultAddress: addressData.isDefault || false
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add address' };
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      const response = await axiosInstance.delete(`/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete address' };
    }
  }
};

export default addressService;