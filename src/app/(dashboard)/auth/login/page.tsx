"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Copy, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { DEMO_ADMIN } from "@/lib/demo-accounts"
import { useAdminAuthStore } from "@/stores/admin-auth"

/** Admin sign in. Pattern 3, Form (auth card). Demo accounts only: see demo-accounts.ts. */
export default function LoginPage() {
  const router = useRouter()
  const login = useAdminAuthStore((s) => s.login)
  const session = useAdminAuthStore((s) => s.session)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) router.replace("/admin")
  }, [session, router])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.")
    if (!password) return setError("Enter your password.")
    const res = login(email, password)
    if (!res.ok) return setError(res.error ?? "Couldn't sign in.")
    setError(null)
    router.replace("/admin")
  }

  const fill = () => {
    setEmail(DEMO_ADMIN.email)
    setPassword(DEMO_ADMIN.password)
    setError(null)
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
            <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={field} aria-invalid={error ? true : undefined} />
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
          <button type="submit" className="h-[52px] w-full rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16]">
            Sign in
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-[#FFF4EA] p-4 text-sm">
          <p className="font-semibold text-[#26160F]">Demo account</p>
          <dl className="mt-2 space-y-1 text-[#77716D]">
            <div className="flex justify-between gap-3"><dt>Email</dt><dd className="font-medium text-[#26160F]">{DEMO_ADMIN.email}</dd></div>
            <div className="flex justify-between gap-3"><dt>Password</dt><dd className="font-medium text-[#26160F]">{DEMO_ADMIN.password}</dd></div>
          </dl>
          <button type="button" onClick={fill} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#F4772B] px-4 font-semibold text-[#E85D16]">
            <Copy className="h-4 w-4" aria-hidden="true" /> Fill demo details
          </button>
        </div>
        <p className="mt-3 text-xs leading-5 text-[#A39B95]">Demo only. Real accounts replace this before launch.</p>
        <Link href="/stall-login" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-[#E85D16]">Stall manager sign in</Link>
      </form>
    </main>
  )
}
