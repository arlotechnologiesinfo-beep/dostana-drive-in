"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ClipboardList,
  ChefHat,
  Package,
  CheckCircle2,
  LogOut,
  DollarSign,
  TrendingUp,
  Bell,
  Clock,
  ChevronRight,
  BookOpen,
  BarChart3,
  RefreshCw,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { STALLS } from "@/data/menu"
import { announce, OfflineBanner, SkipLink, StaffTools, useNewItemAlert } from "@/components/dashboard/StaffA11y"
import { useStallGuard } from "@/lib/use-stall-guard"
import { useStallAuthStore } from "@/stores/stall-auth"
import { rejectChildOrder, updateChildOrderStatus, type OrderStatus, type ParentOrder, type ChildStallOrder } from "@/lib/orders-db"

const STATUS_TABS: { key: OrderStatus; label: string; icon: typeof ClipboardList }[] = [
  { key: "ORDER_RECEIVED", label: "New", icon: Bell },
  { key: "PREPARING", label: "Cooking", icon: ChefHat },
  { key: "READY", label: "Ready", icon: Package },
  { key: "DELIVERED", label: "Served", icon: CheckCircle2 },
  { key: "CANCELLED", label: "Cancelled", icon: XCircle },
]

const REJECT_REASONS = ["Item is finished", "Kitchen is too busy", "Stall is closing", "Other reason"]

export default function StallOwnerDashboard() {
  const { ready, session } = useStallGuard()
  const logout = useStallAuthStore((st) => st.logout)
  const selectedStallId = session?.stallId ?? ""
  const [activeTab, setActiveTab] = useState<OrderStatus>("ORDER_RECEIVED")
  const [allParentOrders, setAllParentOrders] = useState<ParentOrder[]>([])
  const [rejecting, setRejecting] = useState<string | null>(null)
  const [reason, setReason] = useState(REJECT_REASONS[0])

  const currentStall = STALLS.find((s) => s.id === selectedStallId) || STALLS[5]

  const loadOrders = () => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("dostana_orders")
      if (raw) {
        setAllParentOrders(JSON.parse(raw))
      }
    } catch (e) {
      console.error("Failed to read orders:", e)
    }
  }

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 3000)
    return () => clearInterval(interval)
  }, [])

  // Extract all child orders matching selectedStallId
  const stallChildOrders: { child: ChildStallOrder; parent: ParentOrder }[] = []
  for (const parent of allParentOrders) {
    for (const child of parent.child_orders) {
      if (child.stall_id === selectedStallId) {
        stallChildOrders.push({ child, parent })
      }
    }
  }

  const filteredOrders = stallChildOrders.filter((o) => o.child.status === activeTab)

  useNewItemAlert(
    stallChildOrders.filter((o) => o.child.status === "ORDER_RECEIVED").map((o) => ({ id: o.child.id, label: `new order from Table ${parseInt(o.parent.table_id, 10)}` })),
    ready
  )

  const orderCounts = STATUS_TABS.reduce((acc, tab) => {
    acc[tab.key] = stallChildOrders.filter((o) => o.child.status === tab.key).length
    return acc
  }, {} as Record<OrderStatus, number>)

  const handleUpdateStatus = (parentOrderId: string, childOrderId: string, newStatus: OrderStatus) => {
    updateChildOrderStatus(parentOrderId, childOrderId, newStatus)
    announce(newStatus === "PREPARING" ? "Order accepted. The customer has been told." : newStatus === "READY" ? "Marked cooked. The customer and waiter have been told." : "Marked served.")
    loadOrders()
  }

  const handleReject = (parentOrderId: string, childOrderId: string) => {
    rejectChildOrder(parentOrderId, childOrderId, reason)
    announce("Order declined. The customer has been told why.")
    setRejecting(null)
    loadOrders()
  }

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case "ORDER_RECEIVED":
        return "PREPARING"
      case "PREPARING":
        return "READY"
      case "READY":
        return "DELIVERED"
      default:
        return null
    }
  }

  const todayRevenue = stallChildOrders
    .filter((o) => o.child.status === "DELIVERED")
    .reduce((sum, o) => sum + o.child.total_amount, 0)

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p role="status" className="text-sm text-muted-foreground">Checking your sign-in…</p>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <SkipLink />
      <OfflineBanner />
      {/* Header */}
      <div className="border-b border-border px-4 py-4 sticky top-0 z-40 bg-background/95">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Stall Switcher */}
            <h1 className="text-base font-extrabold text-foreground md:text-lg">{currentStall.name}</h1>
            <div className="hidden md:block">
              <p className="text-xs text-muted-foreground">Kitchen Display System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StaffTools />
            <button
              onClick={loadOrders}
              aria-label="Refresh orders" className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/stall-owner/menu"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Menu Management
            </Link>
            <Button variant="ghost" size="icon" aria-label="Sign out" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 gap-3">
        <div className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-4 text-center">
          <DollarSign className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <div className="font-black text-foreground text-lg" style={{ fontFamily: "var(--font-heading)" }}>
            ₹{todayRevenue}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Delivered Revenue</div>
        </div>
        <div className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-4 text-center">
          <ClipboardList className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <div className="font-black text-foreground text-lg" style={{ fontFamily: "var(--font-heading)" }}>
            {stallChildOrders.length}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Kitchen Orders</div>
        </div>
        <div className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-4 text-center">
          <TrendingUp className="w-5 h-5 text-gold mx-auto mb-1" />
          <div className="font-black text-foreground text-lg" style={{ fontFamily: "var(--font-heading)" }}>
            {currentStall.name.split(" ")[0]}
          </div>
          <div className="text-xs text-[#7A5A10] uppercase font-bold tracking-wider">Stall Operational</div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {STATUS_TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[100px] flex flex-col items-center gap-1 py-3 rounded-2xl text-xs font-bold transition-all border ${
                  activeTab === tab.key
                    ? "bg-primary text-white border-primary glow-red"
                    : "bg-surface border-border text-muted-foreground hover:border-border hover:text-foreground"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {orderCounts[tab.key] > 0 && (
                  <Badge variant={activeTab === tab.key ? "secondary" : "default"} className="h-5 min-w-5 text-[10px] px-1.5">
                    {orderCounts[tab.key]}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders List */}
      <main id="main" tabIndex={-1} aria-label="Orders" className="max-w-7xl mx-auto px-4 space-y-3 outline-none">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-3xl border border-border">
            <ChefHat className="mx-auto mb-2 h-10 w-10 text-primary" aria-hidden="true" />
            <p className="text-muted-foreground text-sm">No {activeTab.replace("_", " ").toLowerCase()} orders for {currentStall.name}</p>
          </div>
        ) : (
          filteredOrders.map(({ child, parent }, i) => {
            const nextStatus = getNextStatus(child.status)
            return (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-4 border border-border space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-[#7A5A10]">
                        #{child.id}
                      </span>
                      <Badge variant="secondary" className="bg-[#FFE7D6] text-[#7A2E05] text-sm font-bold">
                        Table {parent.table_id}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Customer: <strong>{parent.customer_name}</strong> ({parent.customer_phone})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-foreground text-base" style={{ fontFamily: "var(--font-heading)" }}>
                      ₹{child.total_amount}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">
                      Parent #{parent.id}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1 bg-surface/60 p-3 rounded-xl border border-border">
                  {child.items.map((item, j) => (
                    <div key={j} className="flex items-start justify-between text-base">
                      <span className="text-foreground font-semibold">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-bold text-[#7A5A10]">₹{item.unit_price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Action button */}
                {nextStatus && (
                  <Button
                    className="w-full h-[52px] bg-[#C2410C] hover:bg-[#9A3412] text-white text-base font-bold rounded-xl"
                    onClick={() => handleUpdateStatus(parent.id, child.id, nextStatus)}
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {nextStatus === "PREPARING" && "Accept order and start cooking"}
                    {nextStatus === "READY" && "Cooked: tell customer and waiter"}
                    {nextStatus === "DELIVERED" && "Mark as served at table"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {child.status === "ORDER_RECEIVED" && (
                  rejecting === child.id ? (
                    <div role="group" aria-label="Decline this order" className="rounded-xl border border-border bg-[#FFF9F2] p-3">
                      <label htmlFor={`why-${child.id}`} className="mb-1 block text-sm font-semibold">Why can&apos;t you make it? The customer will see this.</label>
                      <select id={`why-${child.id}`} value={reason} onChange={(e) => setReason(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold">
                        {REJECT_REASONS.map((x) => <option key={x}>{x}</option>)}
                      </select>
                      <div className="mt-3 flex gap-2">
                        <button type="button" autoFocus onClick={() => setRejecting(null)} className="min-h-12 flex-1 rounded-xl border border-border bg-white text-sm font-bold">Keep order</button>
                        <button type="button" onClick={() => handleReject(parent.id, child.id)} className="min-h-12 flex-1 rounded-xl bg-[#B3261E] text-sm font-bold text-white">Decline #{child.id}</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => { setRejecting(child.id); setReason(REJECT_REASONS[0]) }} className="min-h-11 w-full rounded-xl border border-[#B3261E] text-sm font-bold text-[#B3261E]">
                      Can&apos;t make this order
                    </button>
                  )
                )}
                {child.status === "CANCELLED" && (
                  <p className="rounded-xl bg-[#FCE8E7] px-3 py-2 text-sm font-semibold text-[#B3261E]">
                    {child.cancelled_by === "CUSTOMER" ? "Cancelled by the customer" : `Declined: ${child.cancel_reason}`}
                  </p>
                )}
                {child.status === "DELIVERED" && (
                  <Badge variant="success" className="w-full justify-center py-2 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Order Delivered to Table {parent.table_id}
                  </Badge>
                )}
              </motion.div>
            )
          })
        )}
      </main>
    </div>
  )
}
