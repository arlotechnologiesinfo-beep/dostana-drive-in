/**
 * DEMO accounts for trying the admin and stall screens. Anyone who reads this file can sign in,
 * so replace all of this with real authentication (Supabase Auth with roles) before launch.
 */
export const DEMO_ADMIN = { email: "admin@dostana.demo", password: "Admin@123", name: "Food court admin" }

export const DEMO_STALL_EMAILS: Record<string, string> = {
  "nani-tiffins": "nani@dostana.demo",
  "aroma-biryani": "aroma@dostana.demo",
  "dills-dlite": "dilli@dostana.demo",
  "tea-time": "tea@dostana.demo",
  "talks-tonic": "talks@dostana.demo",
  "cool-point": "coolpoint@dostana.demo",
}

export function stallIdForEmail(email: string): string | undefined {
  const e = email.trim().toLowerCase()
  return Object.entries(DEMO_STALL_EMAILS).find(([, v]) => v === e)?.[0]
}
