"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Table2, Bell, CheckCircle2, BarChart3, ChevronRight, Clock, ClipboardList, Store, Tag } from "lucide-react"
import Link from "next/link"
import { AdminLayout } from "@/components/dashboard/AdminLayout"
import { Badge } from "@/components/ui/badge"
import { getWaiterRequests, updateWaiterRequestStatus, type WaiterRequest } from "@/lib/orders-db"

const STATS = [
  { label: "Today's Revenue", value: "₹12,450", change: "+12%", trend: "up", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Orders Today", value: "48", change: "+8%", trend: "up", icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Active Tables", value: "18/25", change: "72%", trend: "up", icon: Table2, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Avg Order Value", value: "₹259", change: "+5%", trend: "up", icon: TrendingUp, color: "text-gold", bg: "bg-gold/10" },
]

const STALL_REVENUE = [
  { name: "Aroma Biryani", revenue: 4200, orders: 14, color: "from-yellow-500 to-amber-500" },
  { name: "Dilli's D'Lite", revenue: 3800, orders: 12, color: "from-red-500 to-orange-500" },
  { name: "Nani's Tiffins", revenue: 2100, orders: 15, color: "from-orange-500 to-red-500" },
  { name: "Cool Point", revenue: 1800, orders: 10, color: "from-blue-500 to-cyan-500" },
  { name: "Juice Corner", revenue: 1200, orders: 8, color: "from-green-500 to-emerald-500" },
]

export default function AdminDashboard() {
  const [waiterRequests, setWaiterRequests] = useState<WaiterRequest[]>([])

  const loadRequests = () => {
    setWaiterRequests(getWaiterRequests())
  }

  useEffect(() => {
    loadRequests()
    const interval = setInterval(loadRequests, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleUpdateReqStatus = (reqId: string, status: WaiterRequest["status"]) => {
    updateWaiterRequestStatus(reqId, status)
    loadRequests()
  }

  return (
    <AdminLayout title="Overview" subtitle="Welcome back, Food Court Admin">
      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-5 border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-1 ${stat.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Live Table Waiter Requests Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-6 border border-gold/20 glow-gold">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-foreground text-base" style={{ fontFamily: "var(--font-heading)" }}>
                Live Table Assistance Requests ({waiterRequests.filter((r) => r.status === "PENDING").length} Pending)
              </h2>
            </div>
            <button onClick={loadRequests} className="text-xs text-gold font-bold hover:underline">
              Refresh
            </button>
          </div>

          {waiterRequests.length === 0 ? (
            <div className="text-center py-6 text-xs text-muted-foreground">No active table waiter requests</div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide pr-1">
              {waiterRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between bg-surface/70 p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <Badge variant="gold" className="text-xs font-black">
                      Table {req.table_id}
                    </Badge>
                    <div>
                      <div className="text-sm font-bold text-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                        {req.request_type.replace("_", " ")}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(req.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === "PENDING" && (
                      <button
                        onClick={() => handleUpdateReqStatus(req.id, "ACKNOWLEDGED")}
                        className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs glow-red"
                      >
                        Acknowledge
                      </button>
                    )}
                    {req.status === "ACKNOWLEDGED" && (
                      <button
                        onClick={() => handleUpdateReqStatus(req.id, "RESOLVED")}
                        className="px-3 py-1.5 rounded-lg bg-success text-white font-bold text-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolve
                      </button>
                    )}
                    {req.status === "RESOLVED" && (
                      <span className="text-xs font-bold text-success">✓ Resolved</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Stalls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Top Stalls Today
              </h2>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {STALL_REVENUE.map((stall, i) => (
                <div key={stall.name} className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground w-4">#{i + 1}</div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stall.color} flex items-center justify-center shrink-0`}>
                    <span className="text-sm font-bold text-foreground">{stall.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{stall.name}</div>
                    <div className="text-xs text-muted-foreground">{stall.orders} orders</div>
                  </div>
                  <div className="font-bold text-sm text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    ₹{stall.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Manage Orders", href: "/admin/orders", icon: ClipboardList },
              { label: "Manage Stalls", href: "/admin/stalls", icon: Store },
              { label: "View Tables", href: "/admin/tables", icon: Table2 },
              { label: "Coupons", href: "/admin/coupons", icon: Tag },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-4 border border-border hover:border-border transition-colors flex items-center gap-3 group"
              >
                <link.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  {link.label}
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
