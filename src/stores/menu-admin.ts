import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * Stall-managed menu changes, layered over the base menu.
 * Base items get a partial override (price, stock, live toggle, removed flag);
 * items a manager adds are stored in full with `custom: true`.
 */
export interface StaffItem {
  id: string
  stallId: string
  name: string
  price: number
  category: string
  description?: string
  veg: boolean
  image?: string
  /** live switch: false hides the item from ordering ("sold out") */
  available: boolean
  /** units left; null means unlimited */
  stock: number | null
  custom: boolean
  removed?: boolean
  updatedAt: string
  updatedBy?: string
}

export type ItemPatch = Partial<Omit<StaffItem, "id" | "stallId" | "custom">>

interface MenuAdminState {
  items: Record<string, Partial<StaffItem> & { id: string }>
  /** stall accepting orders; missing means open */
  stallOpen: Record<string, boolean>
  addItem: (item: Omit<StaffItem, "id" | "custom" | "updatedAt">, by: string) => string
  patchItem: (id: string, patch: ItemPatch, by: string) => void
  removeItem: (id: string, by: string) => void
  setStallOpen: (stallId: string, open: boolean) => void
  /** called when an order is placed */
  consumeStock: (id: string, quantity: number, baseStock: number | null) => void
}

export const useMenuAdminStore = create<MenuAdminState>()(
  persist(
    (set) => ({
      items: {},
      stallOpen: {},

      addItem: (item, by) => {
        const id = `custom-${item.stallId}-${Date.now().toString(36)}`
        set((s) => ({
          items: { ...s.items, [id]: { ...item, id, custom: true, updatedAt: new Date().toISOString(), updatedBy: by } },
        }))
        return id
      },

      patchItem: (id, patch, by) =>
        set((s) => ({
          items: { ...s.items, [id]: { ...s.items[id], id, ...patch, updatedAt: new Date().toISOString(), updatedBy: by } },
        })),

      removeItem: (id, by) =>
        set((s) => {
          const existing = s.items[id]
          if (existing?.custom) {
            const next = { ...s.items }
            delete next[id]
            return { items: next }
          }
          return { items: { ...s.items, [id]: { ...existing, id, removed: true, updatedAt: new Date().toISOString(), updatedBy: by } } }
        }),

      setStallOpen: (stallId, open) => set((s) => ({ stallOpen: { ...s.stallOpen, [stallId]: open } })),

      consumeStock: (id, quantity, baseStock) =>
        set((s) => {
          const current = s.items[id]?.stock !== undefined ? s.items[id]!.stock! : baseStock
          if (current === null || current === undefined) return s
          const left = Math.max(0, current - quantity)
          return {
            items: {
              ...s.items,
              [id]: { ...s.items[id], id, stock: left, ...(left === 0 ? { available: false } : {}), updatedAt: new Date().toISOString() },
            },
          }
        }),
    }),
    { name: "dostana-menu-admin" }
  )
)
