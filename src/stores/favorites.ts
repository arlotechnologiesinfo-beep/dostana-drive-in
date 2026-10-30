import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FavoritesState {
  stalls: string[]
  dishes: string[]
  toggleStall: (id: string) => void
  toggleDish: (id: string) => void
}

const toggle = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id]

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      stalls: [],
      dishes: [],
      toggleStall: (id) => set((s) => ({ stalls: toggle(s.stalls, id) })),
      toggleDish: (id) => set((s) => ({ dishes: toggle(s.dishes, id) })),
    }),
    { name: "dostana-favorites" }
  )
)
