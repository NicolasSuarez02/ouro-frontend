import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== USER ENDPOINTS ====================

export const registerUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await api.get(`/users/verify-email?token=${token}`);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post('/users/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post('/users/reset-password', { token, newPassword });
  return response.data;
};

export const resendVerification = async (email) => {
  const response = await api.post(`/users/resend-verification?email=${email}`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

// ==================== THERAPIST ENDPOINTS ====================

export const createTherapist = async (therapistData) => {
  const response = await api.post('/therapists', therapistData);
  return response.data;
};

export const getAllTherapists = async () => {
  const response = await api.get('/therapists');
  return response.data;
};

export const getTherapistsBySpecialty = async (specialty) => {
  const response = await api.get(`/therapists?specialty=${specialty}`);
  return response.data;
};

export const getTherapistById = async (id) => {
  const response = await api.get(`/therapists/${id}`);
  return response.data;
};

export const getTherapistByUserId = async (userId) => {
  const response = await api.get(`/therapists/user/${userId}`);
  return response.data;
};

export const updateTherapist = async (id, therapistData) => {
  const response = await api.put(`/therapists/${id}`, therapistData);
  return response.data;
};

export const getPendingTherapists = async (adminUserId) => {
  const response = await api.get(`/therapists/pending?adminUserId=${adminUserId}`);
  return response.data;
};

export const approveTherapist = async (id, adminUserId) => {
  const response = await api.put(`/therapists/${id}/approve?adminUserId=${adminUserId}`);
  return response.data;
};

export const rejectTherapist = async (id, adminUserId) => {
  const response = await api.put(`/therapists/${id}/reject?adminUserId=${adminUserId}`);
  return response.data;
};

// ==================== CLIENT ENDPOINTS ====================

export const createClient = async (clientData) => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

export const getAllClients = async () => {
  const response = await api.get('/clients');
  return response.data;
};

export const getClientById = async (id) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

export const getClientByUserId = async (userId) => {
  const response = await api.get(`/clients/user/${userId}`);
  return response.data;
};

export const updateClient = async (id, clientData) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response.data;
};

// ==================== AVAILABILITY ENDPOINTS ====================

export const getTherapistAvailability = async (therapistId) => {
  const response = await api.get(`/availability/therapist/${therapistId}`);
  return response.data;
};

export const saveTherapistAvailability = async (therapistId, data) => {
  const response = await api.put(`/availability/therapist/${therapistId}`, data);
  return response.data;
};

// ==================== APPOINTMENT ENDPOINTS ====================

export const getAvailableDays = async (therapistId, year, month) => {
  const response = await api.get(`/appointments/available-days?therapistId=${therapistId}&year=${year}&month=${month}`);
  return response.data;
};

export const getAvailableSlots = async (therapistId, date) => {
  const response = await api.get(`/appointments/available-slots?therapistId=${therapistId}&date=${date}`);
  return response.data;
};

export const bookAppointment = async (data) => {
  const response = await api.post('/appointments', data);
  return response.data;
};

export const cancelAppointment = async (id, userId) => {
  const response = await api.put(`/appointments/${id}/cancel?userId=${userId}`);
  return response.data;
};

export const completeAppointment = async (id, userId) => {
  const response = await api.put(`/appointments/${id}/complete?userId=${userId}`);
  return response.data;
};

export const getAppointmentsByUser = async (userId) => {
  const response = await api.get(`/appointments/user/${userId}?requestingUserId=${userId}`);
  return response.data;
};

export const getAppointmentsByTherapist = async (therapistId, userId) => {
  const response = await api.get(`/appointments/therapist/${therapistId}?requestingUserId=${userId}`);
  return response.data;
};

// ==================== RESOURCE ENDPOINTS ====================

export const uploadResource = async (formData) => {
  const response = await api.post('/resources/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getResources = async (category, userId) => {
  const response = await api.get(`/resources?category=${category}&userId=${userId}`);
  return response.data;
};

export const getPendingResources = async (adminUserId) => {
  const response = await api.get(`/resources/pending?adminUserId=${adminUserId}`);
  return response.data;
};

export const approveResource = async (id, adminUserId) => {
  const response = await api.put(`/resources/${id}/approve?adminUserId=${adminUserId}`);
  return response.data;
};

export const rejectResource = async (id, adminUserId) => {
  const response = await api.put(`/resources/${id}/reject?adminUserId=${adminUserId}`);
  return response.data;
};

export const downloadResource = async (id, userId) => {
  const response = await api.get(`/resources/${id}/download?userId=${userId}`, {
    responseType: 'blob',
  });
  return response;
};

export const deleteResource = async (id, userId) => {
  const response = await api.delete(`/resources/${id}?userId=${userId}`);
  return response.data;
};

// ==================== PHOTO UPLOAD ====================

export const uploadTherapistPhoto = async (userId, file) => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post(`/therapists/upload-photo?userId=${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ==================== TIME SLOT ENDPOINTS ====================

export const getTherapistTimeSlots = async (therapistId, userId) => {
  const response = await api.get(`/timeslots/therapist/${therapistId}?userId=${userId}`);
  return response.data;
};

export const deleteTimeSlot = async (slotId, userId) => {
  const response = await api.delete(`/timeslots/${slotId}?userId=${userId}`);
  return response.data;
};

// ==================== EMAIL ENDPOINTS ====================

export const sendEmail = async (emailData) => {
  const response = await api.post('/email/send', emailData);
  return response.data;
};

export const sendContactMessage = async ({ name, email, message }) => {
  const response = await api.post('/email/send', {
    to: 'contacto@ouro.com',
    subject: `Consulta de ${name} <${email}>`,
    body: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
    html: false,
  });
  return response.data;
};

export default api;
