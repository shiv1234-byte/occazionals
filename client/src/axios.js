import axios from 'axios';

const API = axios.create({
  // ✅ 1. Sahi Base URL
  baseURL: 'https://occazionals-backend.onrender.com/api',
  
  // ✅ 2. Timeout (Render free tier ke liye 15s zyada safe hai)
  timeout: 15000, 
  
  headers: {
    'Content-Type': 'application/json',
  }
});

// ✅ 3. REQUEST INTERCEPTOR: Har request ke saath Token bhejne ke liye
API.interceptors.request.use(
  (config) => {
    // LocalStorage se token fetch karein
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

// ✅ 4. RESPONSE INTERCEPTOR: Errors handle karne ke liye
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 💡 Case A: Agar server respond na kare (Timeout)
    if (error.code === 'ECONNABORTED') {
      console.error("Server is taking too long to respond. Please try again.");
    }

    // 💡 Case B: Unauthorized (401) - Token expire ya missing
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Redirecting to login...");
      
      // Data clear karein
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
      
      // Redirect to login (Optional: uncomment if needed)
      // window.location.href = '/login'; 
    }

    return Promise.reject(error);
  }
);

export default API;