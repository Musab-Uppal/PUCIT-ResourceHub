import { create } from 'zustand';
import api from '../api/axios';

/*
 * Why Zustand over Context?
 * - No provider wrapper needed — any component can read/write state directly
 * - Selectors prevent unnecessary re-renders (components only re-render when
 *   their specific slice of state changes)
 * - Tiny bundle size (~1KB)
 *
 * Access token lives in Zustand memory (not localStorage) — safe from XSS.
 * We also sync it to window.__authToken__ so the Axios interceptor can read it
 * without importing the store (avoids circular deps).
 */
const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isLoading: true, // true until we've checked /auth/me on app load

  setAuth: (user, accessToken) => {
    window.__authToken__ = accessToken;
    set({ user, accessToken, isLoading: false });
  },

  clearAuth: () => {
    window.__authToken__ = null;
    set({ user: null, accessToken: null, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),

  // Called on app mount — restores session from httpOnly refresh cookie
  restoreSession: async () => {
    try {
      const { data } = await api.post('/auth/refresh');
      window.__authToken__ = data.accessToken;

      const { data: meData } = await api.get('/auth/me');
      set({ user: meData.user, accessToken: data.accessToken, isLoading: false });
    } catch {
      // No valid refresh cookie — user is logged out, that's fine
      set({ user: null, accessToken: null, isLoading: false });
    }
  },
}));

export default useAuthStore;
