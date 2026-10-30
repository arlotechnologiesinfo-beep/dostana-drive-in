"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Lock,
  Phone,
  Store,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    ownerName:  "",
    stallName:  "",
    email:      "",
    phone:      "",
    password:   "",
    confirm:    "",
  })
  const [showPass, setShowPass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const isValid =
    form.ownerName &&
    form.stallName &&
    form.email &&
    form.phone.length >= 10 &&
    form.password.length >= 8 &&
    form.password === form.confirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsLoading(false)
    setSuccess(true)
    setTimeout(() => router.push("/auth/login"), 2500)
  }

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value })

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Registration Submitted!
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs">
            Your stall registration is under review. We'll activate your account within 24 hours.
          </p>
          <p className="text-muted-foreground text-xs mt-3">Redirecting to login...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">
      {/* Background Orb */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-gold to-primary flex items-center justify-center mb-4">
            <Store className="w-7 h-7 text-foreground" />
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Join Dostana
          </h1>
          <p className="text-muted-foreground text-xs mt-1">Register your stall on the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Owner Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Owner / Contact Name *"
              value={form.ownerName}
              onChange={update("ownerName")}
              className="input-field pl-11 text-sm h-12"
              required
            />
          </div>

          {/* Stall Name */}
          <div className="relative">
            <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Stall / Kitchen Name *"
              value={form.stallName}
              onChange={update("stallName")}
              className="input-field pl-11 text-sm h-12"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={update("email")}
              className="input-field pl-11 text-sm h-12"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              placeholder="Mobile Number *"
              value={form.phone}
              onChange={update("phone")}
              className="input-field pl-11 text-sm h-12"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password (min 8 chars) *"
              value={form.password}
              onChange={update("password")}
              className="input-field pl-11 pr-12 text-sm h-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Confirm Password *"
              value={form.confirm}
              onChange={update("confirm")}
              className={`input-field pl-11 text-sm h-12 ${
                form.confirm && form.password !== form.confirm
                  ? "border-destructive focus:ring-destructive"
                  : ""
              }`}
              required
            />
          </div>

          {form.confirm && form.password !== form.confirm && (
            <p className="text-xs text-destructive pl-1">Passwords do not match</p>
          )}

          {/* Password Strength Hint */}
          {form.password && (
            <div className="flex gap-1.5 px-1">
              {[8, 12, 16].map((len) => (
                <div
                  key={len}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    form.password.length >= len ? "bg-success" : "bg-surface"
                  }`}
                />
              ))}
              <span className="text-[10px] text-muted-foreground ml-1">
                {form.password.length < 8 ? "Weak" : form.password.length < 12 ? "Good" : "Strong"}
              </span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-full h-12 rounded-2xl bg-primary glow-red text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>

        <p className="text-center text-[10px] text-muted-foreground/50 mt-3">
          By registering, you agree to Dostana's Terms of Service.
        </p>
      </motion.div>
    </div>
  )
}
