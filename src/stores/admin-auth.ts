import { create } from "zustand"
import { persist } from "zustand/middleware"
import { DEMO_ADMIN } from "@/lib/demo-accounts"

/** DEMO-GRADE admin sign-in, checked in the browser. Not secure: see demo-accounts.ts. */
const MAX_ATTEMPTS = 5
const LOCK_MS = 60_000

interface AdminAuthState {
  session: { email: string; name: string; since: string } | null
  failures: { count: number; lockedUntil: number }
  login: (email: string, password: string) => { ok: boolean; error?: string }
  logout: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      session: null,
      failures: { count: 0, lockedUntil: 0 },

      login: (email, password) => {
        const now = Date.now()
        const f = get().failures
        if (f.lockedUntil > now) return { ok: false, error: `Too many attempts. Try again in ${Math.ceil((f.lockedUntil - now) / 1000)} seconds.` }
        const ok = email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password
        if (!ok) {
          const count = f.count + 1
          set({ failures: { count: count >= MAX_ATTEMPTS ? 0 : count, lockedUntil: count >= MAX_ATTEMPTS ? now + LOCK_MS : 0 } })
          return { ok: false, error: count >= MAX_ATTEMPTS ? "Too many attempts. Locked for 60 seconds." : "That email or password isn't right." }
        }
        set({ session: { email: DEMO_ADMIN.email, name: DEMO_ADMIN.name, since: new Date().toISOString() }, failures: { count: 0, lockedUntil: 0 } })
        return { ok: true }
      },

      logout: () => set({ session: null }),
    }),
    { name: "dostana-admin-auth" }
  )
)
