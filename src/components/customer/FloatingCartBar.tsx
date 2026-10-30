"use client"

import Link from "next/link"
import { ArrowRight, ShoppingCart } from "lucide-react"
import { useMounted } from "@/lib/use-mounted"
import { useCartStore } from "@/stores/cart"

interface FloatingCartBarProps {
  tableId: string
  /** lift above the bottom navigation when it is shown */
  withNav?: boolean
}

/** Pinned "View Cart" bar for screens without the bottom navigation. */
export function FloatingCartBar({ tableId, withNav = false }: FloatingCartBarProps) {
  const mounted = useMounted()
  const items = useCartStore((s) => s.items)
  const count = mounted ? items.reduce((n, i) => n + i.quantity, 0) : 0
  const total = mounted ? items.reduce((n, i) => n + i.price * i.quantity, 0) : 0
  if (count === 0) return null

  return (
    <div className={`pointer-events-none fixed inset-x-0 z-40 px-4 ${withNav ? "bottom-[104px]" : "bottom-4"} pb-[env(safe-area-inset-bottom)]`}>
      <Link
        href={`/table/${tableId}/cart`}
        className="pointer-events-auto mx-auto flex h-14 max-w-[430px] items-center justify-between rounded-full bg-[#F4772B] pl-5 pr-4 text-white shadow-[0_10px_28px_rgba(244,119,43,0.4)] transition-colors hover:bg-[#E85D16] md:max-w-[560px]"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          {count} {count === 1 ? "item" : "items"} · ₹{total}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-bold">
          View Cart
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </Link>
    </div>
  )
}
