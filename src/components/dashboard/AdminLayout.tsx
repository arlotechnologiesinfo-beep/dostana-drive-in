"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useMounted } from "@/lib/use-mounted"
import { OfflineBanner, SkipLink, StaffTools } from "@/components/dashboard/StaffA11y"
import { useAdminAuthStore } from "@/stores/admin-auth"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Table2,
  Tag,
  Settings,
  LogOut,
  Clock,
  Menu,
  X,
  ChevronRight,
  Bell,
  Store,
  ChefHat,
  ConciergeBell,
  KeyRound,
} from "lucide-react"

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview",  href: "/admin" },
  { icon: ClipboardList,   label: "Orders",    href: "/admin/orders" },
  { icon: Store,           label: "Stalls",    href: "/admin/stalls" },
  { icon: UtensilsCrossed, label: "Menus",     href: "/admin/menu" },
  { icon: Table2,          label: "Tables",    href: "/admin/tables" },
  { icon: Tag,             label: "Coupons",   href: "/admin/coupons" },
  { icon: Settings,        label: "Settings",  href: "/admin/settings" },
  { icon: KeyRound,        label: "Stall logins", href: "/admin/logins" },
  { icon: ChefHat,         label: "Kitchen",   href: "/stall-owner" },
  { icon: ConciergeBell,   label: "Waiter",    href: "/waiter" },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const mounted = useMounted()
  const session = useAdminAuthStore((s) => s.session)
  const logout = useAdminAuthStore((s) => s.logout)

  useEffect(() => {
    if (mounted && !session) router.replace("/auth/login")
  }, [mounted, session, router])

  const now = mounted ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""

  if (!mounted || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p role="status" className="text-sm text-muted-foreground">Checking your sign-in…</p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <SkipLink />
      {/* ─── Desktop Sidebar ─────────────────────────── */}
      <aside className="w-64 border-r border-border bg-white hidden lg:flex flex-col shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_8px_20px_rgba(244,119,43,0.35)]">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <div
                className="font-black text-sm text-foreground tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                DOSTANA
              </div>
              <div className="text-xs text-muted-foreground">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-primary text-white font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-[#FFF4EA]"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            className="w-full min-h-11 flex items-center gap-3 px-4 py-3 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-[#FFF4EA] transition-all"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Store className="w-4 h-4" />
            View Customer Site
          </Link>
          <button
            onClick={() => {
              logout()
              router.replace("/auth/login")
            }}
            className="w-full min-h-11 flex items-center gap-3 px-4 py-3 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-[#FFF4EA] transition-all"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Mobile Drawer ────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-[#26160F]/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-border z-50 flex flex-col lg:hidden"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                    <UtensilsCrossed className="w-4 h-4 text-white" />
                  </div>
                  <div
                    className="font-black text-sm text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    DOSTANA Admin
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        isActive
                          ? "bg-primary text-white font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-[#FFF4EA]"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content Area ───────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <OfflineBanner />
        {/* Top Bar */}
        <div className="border-b border-border px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-background">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              aria-label="Open menu" className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StaffTools />
            <button aria-label="Notifications" className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center relative">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="bg-white shadow-[0_4px_16px_rgba(48,32,25,0.08)] rounded-xl px-3 py-2 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span
                className="text-xs font-semibold text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {now}
              </span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main id="main" tabIndex={-1} className="flex-1 outline-none">{children}</main>
      </div>
    </div>
  )
}
