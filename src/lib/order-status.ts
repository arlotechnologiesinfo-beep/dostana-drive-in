import type { OrderStatus, ParentOrder } from "@/lib/orders-db"

export const TRACK_STEPS = ["Order Confirmed", "Preparing at Stall", "Out for Serving", "Served at Table"] as const

const STEP_INDEX: Record<OrderStatus, number> = {
  ORDER_RECEIVED: 0,
  PREPARING: 1,
  READY: 2,
  DELIVERED: 3,
  CANCELLED: -1,
}

export function stepIndex(status: OrderStatus): number {
  return STEP_INDEX[status]
}

export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case "ORDER_RECEIVED":
      return "Received"
    case "PREPARING":
      return "Preparing"
    case "READY":
      return "Ready to serve"
    case "DELIVERED":
      return "Served"
    default:
      return "Cancelled"
  }
}

/** Furthest step every stall has reached; the whole order moves at the pace of its slowest stall. */
export function overallStep(order: ParentOrder): number {
  const live = order.child_orders.filter((c) => c.status !== "CANCELLED")
  if (live.length === 0) return -1
  return Math.min(...live.map((c) => STEP_INDEX[c.status]))
}

export function isOngoing(order: ParentOrder): boolean {
  const step = overallStep(order)
  return step >= 0 && step < 3
}

export function itemCount(order: ParentOrder): number {
  return order.child_orders.reduce((n, c) => n + c.items.reduce((m, i) => m + i.quantity, 0), 0)
}
