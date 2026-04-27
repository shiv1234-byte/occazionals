import axios from 'axios';

const API = axios.create({
  // ✅ Pura URL check karein (Ensure trailing slash na ho)
  baseURL: 'https://occazionals-backend.onrender.com/api',
  timeout: 20000, // ⚡ 20s kar diya kyunki Render 'Spin-up' mein time leta hai
  headers: {
    'Content-Type': 'application/json',
  }
});

// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear(); // ⚡ Best practice: Sab clear kar do refresh par
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default API;