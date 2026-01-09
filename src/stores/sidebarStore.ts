import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
  toggleOpen: () => void;
  toggleCollapsed: () => void;
  closeMobile: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: false,
      isCollapsed: false,
      setIsOpen: (isOpen: boolean) => set({ isOpen }),
      setIsCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
      closeMobile: () => set({ isOpen: false }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({ isCollapsed: state.isCollapsed }),
    }
  )
);
