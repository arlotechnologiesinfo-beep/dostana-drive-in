"use client"

import { useEffect, useState } from "react"
import { getOrdersForTable, type ParentOrder } from "@/lib/orders-db"
import { useMounted } from "@/lib/use-mounted"

/** Orders for a table, refreshed every few seconds and whenever another tab changes them. */
export function useOrders(tableId: string): { orders: ParentOrder[]; ready: boolean } {
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

  return { orders: mounted ? getOrdersForTable(tableId) : [], ready: mounted }
}
