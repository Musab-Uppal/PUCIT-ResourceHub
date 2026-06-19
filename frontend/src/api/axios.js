import axios from 'axios';

/*
 * Base URL:
 * - In dev: Vite proxy rewrites /api → http://localhost:5000, so we just use /api
 * - In production: set VITE_API_URL in Vercel env vars to your Render backend URL
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // send httpOnly refresh cookie on every request
});

/*
 * Request interceptor: attach the access token from Zustand store.
 * We import the store lazily to avoid circular dependency issues.
 */
api.interceptors.request.use((config) => {
  // Dynamic import to avoid circular dep (store imports api, api imports store)
  const token = window.__authToken__;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/*
 * Response interceptor: handle token expiry transparently.
 * When any request gets a 401, try refreshing once then retry.
 * If refresh also fails (e.g. cookie expired), force logout.
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue this request until the ongoing refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        const newToken = data.accessToken;

        // Update the global token (Zustand store will also be synced by the refresh caller)
        window.__authToken__ = newToken;
        original.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        window.__authToken__ = null;
        // Trigger logout in the store
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
