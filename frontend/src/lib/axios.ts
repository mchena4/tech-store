import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const tokens = localStorage.getItem('auth_tokens');
      if (tokens) {
        try {
          const { access } = JSON.parse(tokens);
          if (access) {
            config.headers.Authorization = `Bearer ${access}`;
          }
        } catch (e) {
          console.error('Error parsing auth tokens', e);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;
      const tokens = localStorage.getItem('auth_tokens');
      if (tokens) {
        try {
          const { refresh } = JSON.parse(tokens);
          if (refresh) {
            const res = await axios.post(`${API_BASE_URL}/api/token/refresh/`, { refresh });
            const newAccess = res.data.access;

            const updatedTokens = { refresh, access: newAccess };
            localStorage.setItem('auth_tokens', JSON.stringify(updatedTokens));

            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem('auth_tokens');
          localStorage.removeItem('auth_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
