import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ProfileState {
  name: string
  setName: (name: string) => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: "",
      setName: (name) => set({ name }),
    }),
    { name: "dostana-profile" }
  )
)
