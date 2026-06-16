import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// On any 401 (e.g. a visitor's account was auto-deleted after its 48h TTL, or the
// cookie expired), broadcast an event so AuthContext can clear the session. We
// dispatch an event instead of redirecting here — a hard redirect on the initial
// unauthenticated load caused an infinite reload loop, so PrivateRoute handles
// navigation via React Router once the user state is cleared.
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(err);
  }
);

export default api;
