import axios from 'axios';

const API = axios.create({
  // Ye wahi URL hai jo Render ne aapko diya hai
  baseURL: 'https://occazionals-backend.onrender.com/api', 
});

export default API;