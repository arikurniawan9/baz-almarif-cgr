// store/ui.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  isLoading: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  isLoading: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
