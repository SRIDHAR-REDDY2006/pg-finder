import axios from 'axios';

const API = axios.create({ baseURL: 'https://pg-finder-backend-1amj.onrender.com/api' });

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user');
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return req;
});

export default API;