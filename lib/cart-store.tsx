"use client"

import { create } from "zustand"

type CartItem = {
  id: number
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number, size: string, color: string) => void
  updateQuantity: (id: number, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const items = get().items
    const existingItem = items.find((i) => i.id === item.id && i.size === item.size && i.color === item.color)

    if (existingItem) {
      set({
        items: items.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        ),
      })
    } else {
      set({ items: [...items, item] })
    }
  },
  removeItem: (id, size, color) =>
    set((state) => ({
      items: state.items.filter((item) => !(item.id === id && item.size === size && item.color === color)),
    })),
  updateQuantity: (id, size, color, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id && item.size === size && item.color === color ? { ...item, quantity } : item,
      ),
    })),
  clearCart: () => set({ items: [] }),
  getTotalItems: () => {
    const items = get().items
    return items.reduce((total, item) => total + item.quantity, 0)
  },
  getTotalPrice: () => {
    const items = get().items
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
}))
