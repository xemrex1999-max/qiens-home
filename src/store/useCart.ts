import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string;
  cartItemId: string; // id-color string to separate variants
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
  selectedColor?: string;
  selectedFabric?: string;
  selectedWood?: string;
}

interface CartStore {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addItem: (item) => {
        const existing = get().cart.find((i) => i.cartItemId === item.cartItemId)
        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.cartItemId === item.cartItemId ? { ...i, qty: i.qty + item.qty } : i
            ),
          })
        } else {
          set({ cart: [...get().cart, item] })
        }
      },
      removeItem: (cartItemId) => {
        set({ cart: get().cart.filter((i) => i.cartItemId !== cartItemId) })
      },
      updateQty: (cartItemId, qty) => {
        if (qty < 1) return
        set({
          cart: get().cart.map((i) => (i.cartItemId === cartItemId ? { ...i, qty } : i)),
        })
      },
      clearCart: () => set({ cart: [] }),
      getTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.qty, 0)
      },
    }),
    {
      name: 'qienshome-cart-storage',
    }
  )
)
