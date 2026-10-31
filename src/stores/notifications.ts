import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AppNotification {
  id: string
  title: string
  body: string
  demo?: true
}

/** Sample notifications; real order updates come from the order events feed. */
export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "demo-welcome",
    title: "Welcome to DOSTANA DRIVE IN",
    body: "Order from every stall at your table with one cart and one checkout.",
    demo: true,
  },
  {
    id: "demo-royal-biryani",
    title: "Today's special: Royal Biryani",
    body: "Sample offer: flat 30% off at AROMA BIRYANI today.",
    demo: true,
  },
]

interface NotificationsState {
  readIds: string[]
  markRead: (ids: string[]) => void
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      readIds: [],
      markRead: (ids) => set((s) => ({ readIds: Array.from(new Set([...s.readIds, ...ids])).slice(-400) })),
    }),
    { name: "dostana-notifications" }
  )
)
