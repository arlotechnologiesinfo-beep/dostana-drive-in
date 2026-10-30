"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChefHat, Eye, EyeOff } from "lucide-react"
import { HOME_STALLS } from "@/data/home-demo"
import { useStallAuthStore } from "@/stores/stall-auth"

/** Stall manager sign-in. Pattern 3, Form (auth card). */
export default function StallLoginPage() {
  const router = useRouter()
  const login = useStallAuthStore((s) => s.login)
  const session = useStallAuthStore((s) => s.session)
  const [stallId, setStallId] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (session) router.replace("/stall-owner")
  }, [session, router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stallId) return setError("Choose your stall.")
    if (!password) return setError("Enter your password.")
    setBusy(true)
    setError(null)
    const stall = HOME_STALLS.find((s) => s.id === stallId)!
    const res = await login(stallId, stall.name, password)
    setBusy(false)
    if (!res.ok) return setError(res.error ?? "Couldn't sign in.")
    router.replace("/stall-owner")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF9F2] px-5 py-10">
      <form onSubmit={submit} noValidate className="w-full max-w-[420px] rounded-[28px] bg-white p-6 shadow-[0_12px_32px_rgba(48,32,25,0.1)] md:p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4772B]">
          <ChefHat className="h-7 w-7 text-white" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-[#26160F]">Stall sign in</h1>
        <p className="mt-1 text-sm text-[#77716D]">Manage your menu, prices, stock and orders.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="stall" className="mb-1 block text-sm font-semibold text-[#26160F]">Your stall</label>
            <select
              id="stall"
              value={stallId}
              onChange={(e) => setStallId(e.target.value)}
              className="h-12 w-full rounded-2xl border border-[#F1E7DE] bg-white px-4 text-sm outline-none focus:border-[#F4772B]"
            >
              <option value="">Choose a stall</option>
              {HOME_STALLS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pw" className="mb-1 block text-sm font-semibold text-[#26160F]">Password</label>
            <div className="relative">
              <input
                id="pw"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={error ? true : undefined}
                className="h-12 w-full rounded-2xl border border-[#F1E7DE] bg-white pl-4 pr-12 text-sm outline-none focus:border-[#F4772B]"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-[#77716D]"
              >
                {show ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
          {error && <p role="alert" className="rounded-xl bg-[#FCE8E7] px-3 py-2 text-sm text-[#EF493B]">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="h-[52px] w-full rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16] disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>

        <p className="mt-5 text-xs leading-5 text-[#A39B95]">
          Demo sign-in. First-time password is <span className="font-semibold text-[#77716D]">stall@123</span>; change it after signing in. Forgot it? Ask the admin to reset.
        </p>
        <Link href="/auth/login" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-[#E85D16]">Admin sign in</Link>
      </form>
    </main>
  )
}
