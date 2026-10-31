"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChefHat, Eye, EyeOff } from "lucide-react"
import { HOME_STALLS } from "@/data/home-demo"
import { DEMO_STALL_EMAILS, stallIdForEmail } from "@/lib/demo-accounts"
import { DEFAULT_PASSWORD, useStallAuthStore } from "@/stores/stall-auth"

/** Stall manager sign in with email and password. Pattern 3, Form (auth card). Demo accounts only. */
export default function StallLoginPage() {
  const router = useRouter()
  const login = useStallAuthStore((s) => s.login)
  const session = useStallAuthStore((s) => s.session)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (session) router.replace("/stall-owner")
  }, [session, router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.")
    if (!password) return setError("Enter your password.")
    const stallId = stallIdForEmail(email)
    if (!stallId) return setError("That email or password isn't right.")
    setBusy(true)
    setError(null)
    const stall = HOME_STALLS.find((s) => s.id === stallId)!
    const res = await login(stallId, stall.name, password)
    setBusy(false)
    if (!res.ok) return setError(res.error === "That password isn't right." ? "That email or password isn't right." : (res.error ?? "Couldn't sign in."))
    router.replace("/stall-owner")
  }

  const field = "h-12 w-full rounded-2xl border border-[#F1E7DE] bg-white px-4 text-sm outline-none placeholder:text-[#A39B95] focus:border-[#F4772B]"

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF9F2] px-5 py-10">
      <form onSubmit={submit} noValidate className="w-full max-w-[460px] rounded-[28px] border border-[#F1E7DE] bg-white p-6 shadow-[0_6px_24px_rgba(48,32,25,0.06)] md:p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4772B]">
          <ChefHat className="h-7 w-7 text-white" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-[#26160F]">Stall sign in</h1>
        <p className="mt-1 text-sm text-[#77716D]">Manage your menu, prices, stock and orders.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="stall-email" className="mb-1 block text-sm font-semibold text-[#26160F]">Email</label>
            <input id="stall-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourstall@dostana.demo" className={field} aria-invalid={error ? true : undefined} />
          </div>
          <div>
            <label htmlFor="stall-pw" className="mb-1 block text-sm font-semibold text-[#26160F]">Password</label>
            <div className="relative">
              <input id="stall-pw" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${field} pr-12`} />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#77716D]">
                {show ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
          {error && <p role="alert" className="rounded-xl bg-[#FCE8E7] px-3 py-2 text-sm text-[#EF493B]">{error}</p>}
          <button type="submit" disabled={busy} className="h-[52px] w-full rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16] disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-[#FFF4EA] p-4 text-sm">
          <p className="font-semibold text-[#26160F]">Demo accounts</p>
          <p className="mt-1 text-xs text-[#77716D]">
            Password for all: <span className="font-semibold text-[#26160F]">{DEFAULT_PASSWORD}</span> (until a stall changes it). Tap a stall to fill its email.
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {HOME_STALLS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => {
                    setEmail(DEMO_STALL_EMAILS[s.id])
                    setPassword(DEFAULT_PASSWORD)
                    setError(null)
                  }}
                  className="flex min-h-11 w-full flex-col justify-center rounded-xl border border-[#F1E7DE] bg-white px-3 text-left"
                >
                  <span className="text-xs font-semibold text-[#26160F]">{s.name}</span>
                  <span className="truncate text-xs text-[#77716D]">{DEMO_STALL_EMAILS[s.id]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#A39B95]">Demo only. Forgot a changed password? The admin can reset it.</p>
        <Link href="/auth/login" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-[#E85D16]">Admin sign in</Link>
      </form>
    </main>
  )
}
