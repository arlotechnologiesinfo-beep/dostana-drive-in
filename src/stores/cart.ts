import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/types"

interface CartState {
  items: CartItem[]
  tableId: string | null
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (idOrMenuItemId: string) => void
  updateQuantity: (idOrMenuItemId: string, quantity: number) => void
  updateSpecialInstructions: (idOrMenuItemId: string, instructions: string) => void
  clearCart: () => void
  setTableId: (tableId: string) => void
  getTotal: () => number
  getItemCount: () => number
  getItemsByStall: () => Record<string, CartItem[]>
}

const getItemKey = (item: { menu_item_id: string; variant_name?: string }) =>
  item.variant_name ? `${item.menu_item_id}-${item.variant_name}` : item.menu_item_id

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableId: null,

      addItem: (item) =>
        set((state) => {
          const itemKey = getItemKey(item)
          const existing = state.items.find(
            (i) => i.id === itemKey || getItemKey(i) === itemKey
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === itemKey || getItemKey(i) === itemKey
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { ...item, id: itemKey }],
          }
        }),

      removeItem: (idOrMenuItemId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => i.id !== idOrMenuItemId && i.menu_item_id !== idOrMenuItemId
          ),
        })),

      updateQuantity: (idOrMenuItemId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => i.id !== idOrMenuItemId && i.menu_item_id !== idOrMenuItemId
                )
              : state.items.map((i) =>
                  i.id === idOrMenuItemId || i.menu_item_id === idOrMenuItemId
                    ? { ...i, quantity }
                    : i
                ),
        })),

      updateSpecialInstructions: (idOrMenuItemId, instructions) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === idOrMenuItemId || i.menu_item_id === idOrMenuItemId
              ? { ...i, special_instructions: instructions }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      setTableId: (tableId) => set({ tableId }),

      getTotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getItemsByStall: () => {
        const { items } = get()
        return items.reduce(
          (acc, item) => {
            if (!acc[item.stall_id]) {
              acc[item.stall_id] = []
            }
            acc[item.stall_id].push(item)
            return acc
          },
          {} as Record<string, CartItem[]>
        )
      },
    }),
    {
      name: "dostana-cart",
    }
  )
)

// Multi-user / multi-tab synchronization listener
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "dostana-cart" && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue)
        if (parsed?.state?.items) {
          useCartStore.setState({
            items: parsed.state.items,
            tableId: parsed.state.tableId,
          })
        }
      } catch (e) {
        console.error("Cart sync error:", e)
      }
    }
  })
}
