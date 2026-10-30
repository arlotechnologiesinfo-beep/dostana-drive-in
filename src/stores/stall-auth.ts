import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * DEMO-GRADE stall manager login. Passwords are hashed and checked in the browser,
 * so this is NOT secure: anyone with the browser can read or edit it. Replace with
 * Supabase Auth (role STALL_OWNER + stall_id) and server-side row-level security
 * before real use. Keep the same shape so screens do not change.
 */
export const DEFAULT_PASSWORD = "stall@123"
const MAX_ATTEMPTS = 5
const LOCK_MS = 60_000

async function hash(stallId: string, password: string): Promise<string> {
  const data = new TextEncoder().encode(`dostana:${stallId}:${password}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("")
}

export interface StallSession {
  stallId: string
  stallName: string
  since: string
}

interface StallAuthState {
  /** custom password hashes; a missing entry means the default password applies */
  hashes: Record<string, string>
  session: StallSession | null
  failures: Record<string, { count: number; lockedUntil: number }>
  login: (stallId: string, stallName: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  changePassword: (stallId: string, current: string, next: string) => Promise<{ ok: boolean; error?: string }>
  /** admin action: back to the default password */
  resetPassword: (stallId: string) => void
  usesDefault: (stallId: string) => boolean
}

export const useStallAuthStore = create<StallAuthState>()(
  persist(
    (set, get) => ({
      hashes: {},
      session: null,
      failures: {},

      login: async (stallId, stallName, password) => {
        const now = Date.now()
        const f = get().failures[stallId]
        if (f && f.lockedUntil > now) {
          return { ok: false, error: `Too many attempts. Try again in ${Math.ceil((f.lockedUntil - now) / 1000)} seconds.` }
        }
        const expected = get().hashes[stallId] ?? (await hash(stallId, DEFAULT_PASSWORD))
        const ok = (await hash(stallId, password)) === expected
        if (!ok) {
          const count = (f?.count ?? 0) + 1
          set((s) => ({
            failures: { ...s.failures, [stallId]: { count: count >= MAX_ATTEMPTS ? 0 : count, lockedUntil: count >= MAX_ATTEMPTS ? now + LOCK_MS : 0 } },
          }))
          return { ok: false, error: count >= MAX_ATTEMPTS ? "Too many attempts. Locked for 60 seconds." : "That password isn't right." }
        }
        set((s) => ({ session: { stallId, stallName, since: new Date().toISOString() }, failures: { ...s.failures, [stallId]: { count: 0, lockedUntil: 0 } } }))
        return { ok: true }
      },

      logout: () => set({ session: null }),

      changePassword: async (stallId, current, next) => {
        if (next.length < 8) return { ok: false, error: "Use at least 8 characters." }
        const expected = get().hashes[stallId] ?? (await hash(stallId, DEFAULT_PASSWORD))
        if ((await hash(stallId, current)) !== expected) return { ok: false, error: "Your current password isn't right." }
        const h = await hash(stallId, next)
        set((s) => ({ hashes: { ...s.hashes, [stallId]: h } }))
        return { ok: true }
      },

      resetPassword: (stallId) =>
        set((s) => {
          const hashes = { ...s.hashes }
          delete hashes[stallId]
          return { hashes }
        }),

      usesDefault: (stallId) => get().hashes[stallId] === undefined,
    }),
    { name: "dostana-stall-auth" }
  )
)
