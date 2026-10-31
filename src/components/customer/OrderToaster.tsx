"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Bell, X } from "lucide-react"
import { useOrderEvents } from "@/lib/use-order-events"
import type { OrderEvent } from "@/lib/orders-db"

const SHOW_MS = 7000

/**
 * Pops up a message on every customer screen the moment a stall accepts, cooks or serves an order,
 * and reads it out to screen readers. Events already there on first load are not announced again.
 */
export function OrderToaster() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const { events, ready } = useOrderEvents(tableId)
  const seen = useRef<Set<string> | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const [shown, setShown] = useState<OrderEvent | null>(null)

  useEffect(() => {
    if (!ready) return
    if (seen.current === null) {
      seen.current = new Set(events.map((e) => e.id))
      return
    }
    const fresh = events.filter((e) => !seen.current!.has(e.id))
    if (fresh.length === 0) return
    fresh.forEach((e) => seen.current!.add(e.id))
    const latest = fresh[0]
    setShown(latest)
    navigator.vibrate?.([100, 60, 100])
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setShown(null), SHOW_MS)
  }, [events, ready])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-3 z-[90] flex justify-center px-3">
      {shown && (
        <div className="pointer-events-auto flex w-full max-w-[420px] items-start gap-3 rounded-2xl border border-[#F1E7DE] bg-white p-3 pl-4 shadow-[0_12px_32px_rgba(48,32,25,0.08)] animate-[toast-in_200ms_ease-out]">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE7D6] text-[#E85D16]">
            <Bell className="h-5 w-5" aria-hidden="true" />
          </span>
          <Link href={`/table/${tableId}/orders/${shown.parent_order_id}`} onClick={() => setShown(null)} className="min-w-0 flex-1">
            <span className="block text-[15px] font-bold text-[#26160F]">{shown.title}</span>
            <span className="block text-sm text-[#5E5650]">{shown.body}</span>
          </Link>
          <button type="button" onClick={() => setShown(null)} aria-label="Dismiss notification" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#77716D]">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
