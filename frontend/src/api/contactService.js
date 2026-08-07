import axios from './axios';

export const submitContactForm = async (contactData) => {
  try {
    const response = await axios.post('/contact', {
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || '',
      subject: contactData.subject,
      message: contactData.message
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to send contact form'
    };
  }
};
