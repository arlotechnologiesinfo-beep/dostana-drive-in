import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TextSize = "normal" | "large" | "xlarge"

interface StaffPrefsState {
  textSize: TextSize
  highContrast: boolean
  /** chime and vibration when a new order or request arrives */
  sound: boolean
  setTextSize: (t: TextSize) => void
  setHighContrast: (v: boolean) => void
  setSound: (v: boolean) => void
}

/** Display and alert preferences for kitchen, waiter and admin staff, saved on this device. */
export const useStaffPrefsStore = create<StaffPrefsState>()(
  persist(
    (set) => ({
      textSize: "normal",
      highContrast: false,
      sound: true,
      setTextSize: (textSize) => set({ textSize }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setSound: (sound) => set({ sound }),
    }),
    { name: "dostana-staff-prefs" }
  )
)
