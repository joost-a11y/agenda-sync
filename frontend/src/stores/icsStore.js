import { create } from 'zustand';
import { icsService } from '../services/api';

export const useICSStore = create((set) => ({
  sources: [],
  logs: [],
  loading: false,
  syncing: false,

  fetchSources: async () => {
    set({ loading: true });
    try {
      const response = await icsService.getSources();
      set({ sources: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  addSource: async (url, displayName) => {
    try {
      const response = await icsService.addSource(url, displayName);
      set((state) => ({
        sources: [...state.sources, response.data],
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateSource: async (id, data) => {
    try {
      const response = await icsService.updateSource(id, data);
      set((state) => ({
        sources: state.sources.map((s) => (s.id === id ? response.data : s)),
      }));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteSource: async (id) => {
    try {
      await icsService.deleteSource(id);
      set((state) => ({
        sources: state.sources.filter((s) => s.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  syncNow: async () => {
    set({ syncing: true });
    try {
      const response = await icsService.syncNow();
      set({ syncing: false });
      return response.data;
    } catch (error) {
      set({ syncing: false });
      throw error;
    }
  },

  fetchLogs: async () => {
    try {
      const response = await icsService.getLogs();
      set({ logs: response.data });
    } catch (error) {
      throw error;
    }
  },
}));
