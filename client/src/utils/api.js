import axios from 'axios';
import { API_URL } from './config'; // config.js se dynamic URL import karein

const API = axios.create({
  baseURL: API_URL, 
});

// Interceptor to handle common errors (Optional but professional)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Connection Error:", error.message);
    return Promise.reject(error);
  }
);

export const fetchProducts = (type) => API.get(`/products${type ? `?type=${type}` : ''}`);

export const fetchProductById = (id) => API.get(`/products/${id}`);

// Agar chatbot bhi use kar rahe hain toh:
export const fetchChatbotResponse = (query) => API.post('/chatbot', { query });
