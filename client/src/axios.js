import axios from 'axios';

const API = axios.create({
  // ✅ 1. Sahi Base URL (Make sure trailing slash na ho)
  baseURL: 'https://occazionals-backend.onrender.com/api',
  
  // ✅ 2. Timeout (Render kabhi kabhi slow hota hai, isliye 10s ka wait karega)
  timeout: 10000, 
  
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ 3. REQUEST INTERCEPTOR: Har request ke saath Token bhejne ke liye
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Ya jo bhi aapne AuthContext mein set kiya hai
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ 4. RESPONSE INTERCEPTOR: Agar 401 (Unauthorized) aaye toh login pe bhejne ke liye
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login'; // Optional: Redirect if session expires
    }
    return Promise.reject(error);
  }
);

export default API;