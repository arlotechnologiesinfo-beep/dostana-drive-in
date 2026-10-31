"use client"

import { useEffect, useState } from "react"
import { getOrderEvents, type OrderEvent } from "@/lib/orders-db"
import { useMounted } from "@/lib/use-mounted"

/** Order updates for a table, refreshed every few seconds and instantly when another tab writes one. */
export function useOrderEvents(tableId: string): { events: OrderEvent[]; ready: boolean } {
  const mounted = useMounted()
  const [, setTick] = useState(0)

  useEffect(() => {
    const refresh = () => setTick((n) => n + 1)
    const timer = window.setInterval(refresh, 3000)
    window.addEventListener("storage", refresh)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener("storage", refresh)
    }
  }, [])

  return { events: mounted ? getOrderEvents(tableId) : [], ready: mounted }
}

/** Current time, ticking once a second. Starts at null so server and first client render match. */
export function useNow(active = true): number | null {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    if (!active) return
    const tick = () => setNow(Date.now())
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [active])
  return now
}
