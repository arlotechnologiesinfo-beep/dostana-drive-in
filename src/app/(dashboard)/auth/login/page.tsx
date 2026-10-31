"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"

/** Admin sign in. Pattern 3, Form (auth card). Demo only: no real authentication yet. */
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.")
    if (!password) return setError("Enter your password.")
    setError(null)
    setBusy(true)
    await new Promise((r) => setTimeout(r, 400))
    setBusy(false)
    router.push("/admin")
  }

  const field = "h-12 w-full rounded-2xl border border-[#F1E7DE] bg-white px-4 text-sm outline-none placeholder:text-[#A39B95] focus:border-[#F4772B]"

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF9F2] px-5 py-10">
      <form onSubmit={submit} noValidate className="w-full max-w-[420px] rounded-[28px] border border-[#F1E7DE] bg-white p-6 shadow-[0_6px_24px_rgba(48,32,25,0.06)] md:p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#26160F]">
          <ShieldCheck className="h-7 w-7 text-[#F5B544]" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-[#26160F]">Admin sign in</h1>
        <p className="mt-1 text-sm text-[#77716D]">Manage stalls, tables, orders and offers.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-sm font-semibold text-[#26160F]">Email</label>
            <input id="admin-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={field} aria-invalid={error ? true : undefined} />
          </div>
          <div>
            <label htmlFor="admin-pw" className="mb-1 block text-sm font-semibold text-[#26160F]">Password</label>
            <div className="relative">
              <input id="admin-pw" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${field} pr-12`} />
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

        <p className="mt-5 text-xs leading-5 text-[#A39B95]">Demo sign-in: any valid email and password opens the admin screens until real authentication is connected.</p>
        <Link href="/stall-login" className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-[#E85D16]">Stall manager sign in</Link>
      </form>
    </main>
  )
}
