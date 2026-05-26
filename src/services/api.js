import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adjuntar el token JWT en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ouro_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Manejar errores globalmente; limpiar sesión si el token expiró
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ouro_token');
      localStorage.removeItem('ouro_user');
      window.location.href = '/login';
    }
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

export const getTherapistBySlug = async (slug) => {
  const response = await api.get(`/therapists/slug/${slug}`);
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

export const getMpConnectUrl = async () => {
  const response = await api.get('/therapists/mp-connect');
  return response.data;
};

export const getPendingTherapists = async () => {
  const response = await api.get('/therapists/pending');
  return response.data;
};

export const approveTherapist = async (id) => {
  const response = await api.put(`/therapists/${id}/approve`);
  return response.data;
};

export const rejectTherapist = async (id) => {
  const response = await api.put(`/therapists/${id}/reject`);
  return response.data;
};

// ==================== CLIENT ENDPOINTS ====================

export const createClient = async (clientData) => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

export const getAllClients = async ({ page = 0, size = 20 } = {}) => {
  const response = await api.get(`/clients?page=${page}&size=${size}`);
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

export const getAvailableDays = async (therapistId, year, month, specialty = null) => {
  const base = `/appointments/available-days?therapistId=${therapistId}&year=${year}&month=${month}`;
  const url = specialty ? `${base}&specialty=${encodeURIComponent(specialty)}` : base;
  const response = await api.get(url);
  return response.data;
};

export const getAvailableSlots = async (therapistId, date, specialty = null) => {
  const base = `/appointments/available-slots?therapistId=${therapistId}&date=${date}`;
  const url = specialty ? `${base}&specialty=${encodeURIComponent(specialty)}` : base;
  const response = await api.get(url);
  return response.data;
};

export const bookAppointment = async (data) => {
  const response = await api.post('/appointments', data);
  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.put(`/appointments/${id}/cancel`);
  return response.data;
};

export const completeAppointment = async (id) => {
  const response = await api.put(`/appointments/${id}/complete`);
  return response.data;
};

export const getAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}`);
  return response.data;
};

export const getAppointmentsByUser = async (userId) => {
  const response = await api.get(`/appointments/user/${userId}`);
  return response.data;
};

export const getAppointmentsByTherapist = async (therapistId) => {
  const response = await api.get(`/appointments/therapist/${therapistId}`);
  return response.data;
};

// ==================== RESOURCE ENDPOINTS ====================

export const uploadResource = async (formData) => {
  const response = await api.post('/resources/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getResources = async (category) => {
  const response = await api.get(`/resources?category=${encodeURIComponent(category)}`);
  return response.data;
};

export const getPendingResources = async () => {
  const response = await api.get('/resources/pending');
  return response.data;
};

export const approveResource = async (id) => {
  const response = await api.put(`/resources/${id}/approve`);
  return response.data;
};

export const rejectResource = async (id) => {
  const response = await api.put(`/resources/${id}/reject`);
  return response.data;
};

export const downloadResource = async (id) => {
  const response = await api.get(`/resources/${id}/download`, {
    responseType: 'blob',
  });
  return response;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
};

// ==================== PHOTO UPLOAD ====================

export const uploadTherapistPhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post('/therapists/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ==================== TIME SLOT ENDPOINTS ====================

export const getTherapistTimeSlots = async (therapistId) => {
  const response = await api.get(`/timeslots/therapist/${therapistId}`);
  return response.data;
};

export const deleteTimeSlot = async (slotId) => {
  const response = await api.delete(`/timeslots/${slotId}`);
  return response.data;
};

// ==================== RATING ENDPOINTS ====================

export const crearCalificacion = async (data) => {
  const response = await api.post('/ratings', data);
  return response.data;
};

export const getRatingEstado = async (therapistId) => {
  const response = await api.get(`/ratings/therapist/${therapistId}/estado`);
  return response.data;
};

export const getCalificacionesTerapeuta = async (therapistId) => {
  const response = await api.get(`/ratings/therapist/${therapistId}`);
  return response.data;
};

// ==================== ADMIN USER ENDPOINTS ====================

export const getAllUsersPaginados = async ({ search = '', role = '', page = 0, size = 20 }) => {
  const response = await api.get(
    `/users/admin?search=${encodeURIComponent(search)}&role=${role}&page=${page}&size=${size}`
  );
  return response.data;
};

export const adminDeleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}/admin`);
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
