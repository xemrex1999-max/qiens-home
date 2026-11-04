import { create } from 'zustand'

interface UIStore {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useUI = create<UIStore>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  isSearchOpen: false,
  setSearchOpen: (open: boolean) => set({ isSearchOpen: open }),
}))
