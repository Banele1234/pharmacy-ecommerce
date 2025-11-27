"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Product } from "@/lib/types"
import { CartService } from "@/lib/firebase/services/cart"
import { toast } from "sonner"

interface CartStore {
  items: CartItem[]
  loading: boolean
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotal: () => number
  getItemCount: () => number
  setItems: (items: CartItem[]) => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      setItems: (items: CartItem[]) => {
        set({ items })
      },

      addItem: async (product: Product, quantity = 1) => {
        const { items } = get()
        
        // First update local state for immediate feedback
        set((state) => {
          const existingItem = state.items.find((item) => item.productId === product.id)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item,
              ),
            }
          }

          return {
            items: [...state.items, { productId: product.id, product, quantity }],
          }
        })

        // Then sync with Firebase if user is logged in
        try {
          // You'll need to get the current user from your auth context
          // For now, we'll assume you have a way to get the current user ID
          // const user = useAuth().user; // Get from your auth context
          // if (user?.uid) {
          //   await CartService.addToCart(user.uid, product, quantity)
          // }
          
          // For now, we'll just show success
          toast.success(`${product.name} added to cart!`)
        } catch (error) {
          console.error('Failed to sync cart with backend:', error)
          // Revert local changes if backend sync fails
          set({ items })
          toast.error('Failed to add item to cart')
        }
      },

      removeItem: async (productId: string) => {
        const { items } = get()
        
        // First update local state
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))

        // Then sync with Firebase
        try {
          // const user = useAuth().user;
          // if (user?.uid) {
          //   await CartService.removeFromCart(user.uid, productId)
          // }
          
          toast.success('Item removed from cart')
        } catch (error) {
          console.error('Failed to sync cart with backend:', error)
          // Revert local changes
          set({ items })
          toast.error('Failed to remove item from cart')
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        const { items } = get()
        
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        // First update local state
        set((state) => ({
          items: state.items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        }))

        // Then sync with Firebase
        try {
          // const user = useAuth().user;
          // if (user?.uid) {
          //   await CartService.updateCartItem(user.uid, productId, quantity)
          // }
        } catch (error) {
          console.error('Failed to sync cart with backend:', error)
          // Revert local changes
          set({ items })
          toast.error('Failed to update quantity')
        }
      },

      clearCart: async () => {
        const { items } = get()
        
        // First update local state
        set({ items: [] })

        // Then sync with Firebase
        try {
          // const user = useAuth().user;
          // if (user?.uid) {
          //   await CartService.clearCart(user.uid)
          // }
          
          toast.success('Cart cleared')
        } catch (error) {
          console.error('Failed to sync cart with backend:', error)
          // Revert local changes
          set({ items })
          toast.error('Failed to clear cart')
        }
      },

      getTotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: "pharmacy-cart",
    },
  ),
)