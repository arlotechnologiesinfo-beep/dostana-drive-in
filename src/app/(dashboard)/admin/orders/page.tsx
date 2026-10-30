"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Filter,
  ChefHat,
  Package,
  CheckCircle2,
  Clock,
  Bell,
  RefreshCw,
  Eye,
  ChevronDown,
} from "lucide-react"
import { AdminLayout } from "@/components/dashboard/AdminLayout"
import { Badge } from "@/components/ui/badge"

type OrderStatus = "ORDER_RECEIVED" | "PREPARING" | "READY" | "DELIVERED"

interface AdminOrder {
  id: string
  table: string
  customer: string
  phone: string
  stalls: string[]
  items: number
  amount: number
  status: OrderStatus
  payment: "UPI" | "CASH_AT_TABLE"
  time: string
  eta: string
}

const MOCK_ORDERS: AdminOrder[] = [
  { id: "ORD-A1B2", table: "Table 5",  customer: "Rahul K",    phone: "9876543210", stalls: ["Aroma Biryani", "Juice Corner"], items: 3, amount: 340, status: "PREPARING",      payment: "UPI",           time: "2 min ago",  eta: "8 min" },
  { id: "ORD-C3D4", table: "Table 12", customer: "Priya M",    phone: "9123456789", stalls: ["Nani's Tiffins"],                items: 2, amount: 110, status: "READY",          payment: "CASH_AT_TABLE", time: "5 min ago",  eta: "Ready" },
  { id: "ORD-E5F6", table: "Table 8",  customer: "Sanjay R",   phone: "9988776655", stalls: ["Dilli's D'Lite", "Cool Point"],  items: 4, amount: 520, status: "ORDER_RECEIVED", payment: "UPI",           time: "8 min ago",  eta: "15 min" },
  { id: "ORD-G7H8", table: "Table 20", customer: "Ananya S",   phone: "9000111222", stalls: ["Tea Time"],                     items: 1, amount: 25,  status: "DELIVERED",      payment: "CASH_AT_TABLE", time: "12 min ago", eta: "—" },
  { id: "ORD-I9J0", table: "Table 3",  customer: "Vikram T",   phone: "8877665544", stalls: ["Talks & Tonic"],                items: 2, amount: 120, status: "PREPARING",      payment: "UPI",           time: "15 min ago", eta: "5 min" },
  { id: "ORD-K1L2", table: "Table 7",  customer: "Meera P",    phone: "9955443322", stalls: ["Aroma Biryani"],                items: 2, amount: 260, status: "READY",          payment: "UPI",           time: "18 min ago", eta: "Ready" },
  { id: "ORD-M3N4", table: "Table 15", customer: "Arjun D",    phone: "7788990011", stalls: ["Juice Corner", "Cool Point"],   items: 3, amount: 180, status: "DELIVERED",      payment: "CASH_AT_TABLE", time: "25 min ago", eta: "—" },
  { id: "ORD-O5P6", table: "Table 2",  customer: "Divya K",    phone: "6677889900", stalls: ["Nani's Tiffins", "Tea Time"],   items: 4, amount: 135, status: "ORDER_RECEIVED", payment: "CASH_AT_TABLE", time: "1 min ago",  eta: "18 min" },
]

const STATUS_FILTERS = [
  { key: "ALL",            label: "All Orders",  icon: Filter },
  { key: "ORDER_RECEIVED", label: "New",         icon: Bell },
  { key: "PREPARING",      label: "Preparing",   icon: ChefHat },
  { key: "READY",          label: "Ready",       icon: Package },
  { key: "DELIVERED",      label: "Delivered",   icon: CheckCircle2 },
]

const STATUS_LABELS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "New",
  PREPARING: "Preparing",
  READY: "Ready",
  DELIVERED: "Delivered",
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  PREPARING:      "bg-gold/15 text-gold border border-gold/30",
  READY:          "bg-success/15 text-success border border-success/30",
  DELIVERED:      "bg-[#FFF4EA] text-muted-foreground border border-border",
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  ORDER_RECEIVED: "PREPARING",
  PREPARING:      "READY",
  READY:          "DELIVERED",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS)
  const [activeFilter, setActiveFilter] = useState("ALL")
  const [search, setSearch] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredOrders = orders.filter((o) => {
    const matchFilter = activeFilter === "ALL" || o.status === activeFilter
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.table.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = STATUS_FILTERS.reduce((acc, f) => {
    acc[f.key] = f.key === "ALL" ? orders.length : orders.filter((o) => o.status === f.key).length
    return acc
  }, {} as Record<string, number>)

  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        const next = NEXT_STATUS[o.status]
        return next ? { ...o, status: next } : o
      })
    )
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 700)
  }

  return (
    <AdminLayout title="Orders" subtitle="Live kitchen pipeline across all stalls">
      <div className="p-4 lg:p-6 space-y-5">
        {/* ─ Controls ─ */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order ID, table, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 h-11 text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
          <button
            onClick={handleRefresh}
            className={`h-11 px-4 rounded-xl bg-surface border border-border flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${isRefreshing ? "animate-spin" : ""}`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* ─ Filter Tabs ─ */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {STATUS_FILTERS.map((filter) => {
            const Icon = filter.icon
            const isActive = activeFilter === filter.key
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Icon className="w-4 h-4" />
                {filter.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-[#FFF4EA] text-foreground" : "bg-[#FFF4EA] text-muted-foreground"
                  }`}
                >
                  {counts[filter.key]}
                </span>
              </button>
            )
          })}
        </div>

        {/* ─ Orders Table (desktop) / Cards (mobile) ─ */}
        {/* Desktop Table */}
        <div className="hidden lg:block bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Order ID", "Table", "Customer", "Stalls", "Items", "Amount", "Payment", "Status", "Time", "Action"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 first:pl-5 last:pr-5"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/50 last:border-0 hover:bg-[#FFF4EA] transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono text-sm font-bold text-foreground">{order.id}</td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{order.table}</td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm text-foreground">{order.customer}</div>
                    <div className="text-xs text-muted-foreground">{order.phone}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {order.stalls.map((s) => (
                        <span key={s} className="text-[10px] bg-muted/50 text-muted-foreground px-1.5 py-0.5 rounded-full">
                          {s.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-muted-foreground">{order.items}</td>
                  <td className="px-4 py-3.5 font-bold text-sm text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    ₹{order.amount}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${order.payment === "UPI" ? "bg-blue-500/15 text-blue-400" : "bg-gold/15 text-gold"}`}>
                      {order.payment === "UPI" ? "UPI" : "Cash"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-xs text-muted-foreground">{order.time}</div>
                    <div className="text-[10px] text-gold">ETA: {order.eta}</div>
                  </td>
                  <td className="px-4 pr-5 py-3.5">
                    {NEXT_STATUS[order.status] ? (
                      <button
                        onClick={() => advanceStatus(order.id)}
                        className="text-[11px] bg-primary text-white px-3 py-1.5 rounded-lg font-bold hover:bg-primary-dark transition-colors whitespace-nowrap"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        → {STATUS_LABELS[NEXT_STATUS[order.status]!]}
                      </button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Done</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No orders matching the current filter
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {filteredOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-4 border border-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-mono text-sm font-bold text-foreground">{order.id}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{order.table} · {order.customer} · {order.time}</div>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${STATUS_COLORS[order.status]}`}>
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-wrap gap-1">
                  {order.stalls.map((s) => (
                    <span key={s} className="text-[10px] bg-muted/50 text-muted-foreground px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <span className="font-bold text-sm text-foreground" style={{ fontFamily: "var(--font-heading)" }}>₹{order.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  ETA: <span className="text-foreground font-medium">{order.eta}</span>
                </div>
                {NEXT_STATUS[order.status] ? (
                  <button
                    onClick={() => advanceStatus(order.id)}
                    className="text-xs bg-primary text-white px-4 py-1.5 rounded-lg font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Mark as {STATUS_LABELS[NEXT_STATUS[order.status]!]}
                  </button>
                ) : (
                  <span className="text-xs text-success font-semibold">✓ Delivered</span>
                )}
              </div>
            </motion.div>
          ))}
          {filteredOrders.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">No orders found</div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
