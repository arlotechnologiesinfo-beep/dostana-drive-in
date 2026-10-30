import { create } from "zustand"
import { NO_FILTERS, type HomeFilters } from "@/lib/home-filters"

/** Filters and the selected category are shared by the home, search and listing screens. */
interface BrowseState {
  filters: HomeFilters
  categoryId: string | null
  setFilters: (filters: HomeFilters) => void
  setCategoryId: (id: string | null) => void
  reset: () => void
}

export const useBrowseStore = create<BrowseState>()((set) => ({
  filters: NO_FILTERS,
  categoryId: null,
  setFilters: (filters) => set({ filters }),
  setCategoryId: (categoryId) => set({ categoryId }),
  reset: () => set({ filters: NO_FILTERS, categoryId: null }),
}))
