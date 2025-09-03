import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header for authenticated requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  sendOTP: (email: string) => api.post('/auth/send-otp', { email }),
  verifyOTP: (email: string, otp: string, name?: string, dob?: string) => 
    api.post('/auth/verify-otp', { email, otp, name, dob }),
  googleLogin: (idToken: string) => api.post('/auth/google', { idToken }),
  getUserProfile: () => api.get('/auth/profile'),
};

// Note services
export const noteService = {
  getNotes: () => api.get('/notes'),
  createNote: (title: string, content: string) => api.post('/notes', { title, content }),
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
};

export default api;
