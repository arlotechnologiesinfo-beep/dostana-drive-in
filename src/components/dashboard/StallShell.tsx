"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, BookOpen, ChefHat, LogOut } from "lucide-react"
import { useStallGuard } from "@/lib/use-stall-guard"
import { useStallAuthStore } from "@/stores/stall-auth"

const TABS = [
  { href: "/stall-owner", label: "Orders", icon: ChefHat },
  { href: "/stall-owner/menu", label: "Menu", icon: BookOpen },
  { href: "/stall-owner/revenue", label: "Revenue", icon: BarChart3 },
]

/** Signed-in frame for a stall manager: stall name, section tabs and sign out. */
export function StallShell({ children }: { children: (stall: { id: string; name: string }) => React.ReactNode }) {
  const { ready, session } = useStallGuard()
  const logout = useStallAuthStore((s) => s.logout)
  const router = useRouter()
  const pathname = usePathname()

  if (!ready || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F2]">
        <p role="status" className="text-sm text-[#77716D]">Checking your sign-in…</p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      <header className="sticky top-0 z-30 border-b border-[#F1E7DE] bg-white">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-4 py-3 md:px-8">
          <div className="min-w-0">
            <p className="text-xs text-[#77716D]">Stall manager</p>
            <p className="truncate text-base font-extrabold text-[#26160F] md:text-lg">{session.stallName}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              router.replace("/stall-login")
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#F1E7DE] px-4 text-sm font-semibold text-[#302019] hover:bg-[#FFF4EA]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
          </button>
        </div>
        <nav aria-label="Stall sections" className="mx-auto flex max-w-[1100px] gap-1 overflow-x-auto px-3 md:px-7">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-12 shrink-0 items-center gap-2 border-b-[3px] px-4 text-sm font-semibold ${
                  active ? "border-[#F4772B] text-[#E85D16]" : "border-transparent text-[#77716D] hover:text-[#26160F]"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" /> {label}
              </Link>
            )
          })}
        </nav>
      </header>
      {children({ id: session.stallId, name: session.stallName })}
    </div>
  )
}
