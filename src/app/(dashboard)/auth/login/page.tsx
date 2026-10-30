"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, Store } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (role: "admin" | "stall_owner") => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)

    if (role === "admin") {
      router.push("/admin")
    } else {
      router.push("/stall-login")
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4 glow-red">
            <span className="text-foreground font-black text-xl" style={{ fontFamily: "var(--font-heading)" }}>D</span>
          </div>
          <h1
            className="text-2xl font-black text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            DOSTANA DRIVE IN
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Owner & Admin Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-3xl p-6 border border-border space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-11 text-sm h-12"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-11 text-sm h-12"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>

          <button
            onClick={() => handleLogin("admin")}
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-primary glow-red text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-all"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Quick Demo Access */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">
            Direct Demo Dashboard Access
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleLogin("admin")}
              disabled={isLoading}
              className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-3.5 border border-border hover:border-border flex items-center justify-center gap-2 text-foreground font-semibold text-xs transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Admin Panel</span>
            </button>
            <button
              onClick={() => handleLogin("stall_owner")}
              disabled={isLoading}
              className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-3.5 border border-border hover:border-border flex items-center justify-center gap-2 text-foreground font-semibold text-xs transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Store className="w-4 h-4 text-gold" />
              <span>Stall Owner</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          New stall owner?{" "}
          <a
            href="/auth/register"
            className="text-primary font-semibold hover:underline"
          >
            Register your stall
          </a>
        </p>
      </motion.div>
    </div>
  )
}
