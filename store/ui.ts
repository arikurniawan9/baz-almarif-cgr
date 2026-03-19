// store/ui.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  isLoading: boolean;
  loadingMessage: string;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setIsLoading: (loading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  isLoading: false,
  loadingMessage: "Memproses data...",
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setIsLoading: (loading, message) => set({ 
    isLoading: loading, 
    loadingMessage: message || "Memproses data..." 
  }),
}));
