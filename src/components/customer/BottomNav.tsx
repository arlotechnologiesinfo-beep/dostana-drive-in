"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConciergeBell, House, LayoutGrid, ShoppingCart, Tag } from "lucide-react"
import { useCartStore } from "@/stores/cart"
import { useMounted } from "@/lib/use-mounted"

interface BottomNavProps {
  tableId: string
}

type NavId = "home" | "order" | "cart" | "offers" | "more"

function activeIdFor(pathname: string, base: string): NavId {
  if (pathname.includes("/orders")) return "order"
  if (pathname.includes("/cart") || pathname.includes("/checkout")) return "cart"
  if (pathname.includes("/rewards")) return "offers"
  if (/\/(more|profile|notifications|stalls|search)/.test(pathname)) return "more"
  if (pathname === base || pathname.includes("/stall/")) return "home"
  return "home"
}

export function BottomNav({ tableId }: BottomNavProps) {
  const pathname = usePathname()
  const mounted = useMounted()
  const items = useCartStore((s) => s.items)
  const count = mounted ? items.reduce((n, i) => n + i.quantity, 0) : 0
  const total = mounted ? items.reduce((n, i) => n + i.price * i.quantity, 0) : 0

  const base = `/table/${tableId}`
  const active = activeIdFor(pathname, base)

  const tab = (id: NavId, label: string, href: string, Icon: typeof House) => {
    const isActive = active === id
    return (
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className="flex h-full min-w-0 flex-col items-center justify-center gap-0.5"
      >
        <span
          className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 ${
            isActive ? "bg-[#FFE7D6]" : ""
          }`}
        >
          <Icon className={`h-[22px] w-[22px] ${isActive ? "text-[#F4772B]" : "text-[#77716D]"}`} aria-hidden="true" />
        </span>
        <span className={`text-xs leading-4 ${isActive ? "font-semibold text-[#F4772B]" : "font-medium text-[#77716D]"}`}>
          {label}
        </span>
      </Link>
    )
  }

  return (
    <nav aria-label="Main" className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      <div className="pointer-events-auto mx-auto max-w-[430px] px-4 md:max-w-[560px] pb-[max(env(safe-area-inset-bottom),12px)]">
        <div className="relative grid h-[72px] grid-cols-5 items-center rounded-full bg-white shadow-[0_8px_32px_rgba(48,32,25,0.12)]">
          {tab("home", "Home", base, House)}
          {tab("order", "Order", `${base}/orders`, ConciergeBell)}

          <div className="relative flex h-full items-start justify-center">
            <Link
              href={`${base}/cart`}
              aria-current={active === "cart" ? "page" : undefined}
              aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}, ₹${total}` : "Cart, empty"}
              className="absolute -top-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4772B] shadow-[0_10px_24px_rgba(244,119,43,0.45)] ring-4 ring-[#FFF9F2] transition-transform active:scale-95"
            >
              <ShoppingCart className="h-7 w-7 text-white" aria-hidden="true" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#26160F] px-1 text-xs font-bold leading-none text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>

          {tab("offers", "Offers", `${base}/rewards`, Tag)}
          {tab("more", "More", `${base}/more`, LayoutGrid)}
        </div>
      </div>
    </nav>
  )
}
