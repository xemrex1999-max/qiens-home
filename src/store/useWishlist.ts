import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  wishlist: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      toggleItem: (item) => {
        const exists = get().wishlist.find((i) => i.id === item.id)
        if (exists) {
          set({ wishlist: get().wishlist.filter((i) => i.id !== item.id) })
        } else {
          set({ wishlist: [...get().wishlist, item] })
        }
      },
      isInWishlist: (id) => {
        return get().wishlist.some((i) => i.id === id)
      },
      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'qienshome-wishlist-storage',
    }
  )
)
