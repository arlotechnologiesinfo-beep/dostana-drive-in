import { create } from "zustand"
import { persist } from "zustand/middleware"

interface RecentTablesState {
  tables: string[]
  remember: (tableId: string) => void
}

export const useRecentTablesStore = create<RecentTablesState>()(
  persist(
    (set) => ({
      tables: [],
      remember: (tableId) =>
        set((s) => ({ tables: [tableId, ...s.tables.filter((t) => t !== tableId)].slice(0, 5) })),
    }),
    { name: "dostana-recent-tables" }
  )
)
