import { create } from 'zustand';
import { authService } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,

  register: async (email, password) => {
    set({ loading: true });
    try {
      const response = await authService.register(email, password);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
      return user;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await authService.login(email, password);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, loading: false });
      return user;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  setUser: (user) => set({ user }),
}));
