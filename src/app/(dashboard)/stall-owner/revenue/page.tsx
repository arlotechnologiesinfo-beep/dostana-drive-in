"use client"

import { useState } from "react"
import { useStallGuard } from "@/lib/use-stall-guard"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingBag,
  Star,
  ArrowLeft,
  BarChart3,
  Users,
} from "lucide-react"
import Link from "next/link"

type Period = "today" | "week" | "month"

const PERIOD_DATA = {
  today: {
    revenue:    4200,
    orders:     18,
    avgOrder:   233,
    growth:     "+12%",
    growthUp:   true,
  },
  week: {
    revenue:    28450,
    orders:     112,
    avgOrder:   254,
    growth:     "+8%",
    growthUp:   true,
  },
  month: {
    revenue:    115800,
    orders:     438,
    avgOrder:   264,
    growth:     "+22%",
    growthUp:   true,
  },
}

const DAILY_REVENUE = [
  { day: "Mon", amount: 3200 },
  { day: "Tue", amount: 4100 },
  { day: "Wed", amount: 2800 },
  { day: "Thu", amount: 5200 },
  { day: "Fri", amount: 6800 },
  { day: "Sat", amount: 8400 },
  { day: "Sun", amount: 4200 },
]

const TOP_ITEMS = [
  { name: "Chicken Dum Biryani", orders: 86,  revenue: 18920, percent: 100 },
  { name: "Mutton Biryani",      orders: 52,  revenue: 14560, percent: 77  },
  { name: "Fish Biryani",        orders: 38,  revenue: 9880,  percent: 52  },
  { name: "Chicken Pulao",       orders: 31,  revenue: 6200,  percent: 37  },
  { name: "Veg Pulao",           orders: 24,  revenue: 3840,  percent: 28  },
  { name: "Raita",               orders: 61,  revenue: 2440,  percent: 14  },
]

const HOURLY = [20, 30, 15, 10, 8, 18, 55, 80, 95, 100, 85, 70, 60, 75, 90, 85, 70, 55, 40, 30, 20, 10, 5, 2]

function RevenueInner() {
  const [period, setPeriod] = useState<Period>("today")
  const data = PERIOD_DATA[period]
  const maxDay = Math.max(...DAILY_REVENUE.map((d) => d.amount))

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="border-b border-border px-4 py-4 flex items-center gap-3 sticky top-0 z-40 bg-background/95">
        <Link
          href="/stall-owner"
          className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="font-bold text-sm text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Revenue Analytics
          </div>
          <div className="text-xs text-muted-foreground">Aroma Biryani & Pulao</div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Period Selector */}
        <div className="flex gap-2">
          {(["today", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                period === p
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {p === "today" ? "Today" : p === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label:  "Revenue",
              value:  `₹${data.revenue.toLocaleString()}`,
              icon:   IndianRupee,
              color:  "text-gold",
              bg:     "bg-gold/10",
            },
            {
              label:  "Orders",
              value:  data.orders,
              icon:   ShoppingBag,
              color:  "text-blue-400",
              bg:     "bg-blue-500/10",
            },
            {
              label:  "Avg Order",
              value:  `₹${data.avgOrder}`,
              icon:   BarChart3,
              color:  "text-purple-400",
              bg:     "bg-purple-500/10",
            },
            {
              label:  "Growth",
              value:  data.growth,
              icon:   data.growthUp ? TrendingUp : TrendingDown,
              color:  data.growthUp ? "text-success" : "text-red-400",
              bg:     data.growthUp ? "bg-success/10" : "bg-red-500/10",
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-4 border border-border"
              >
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div
                  className={`text-2xl font-black ${kpi.color}`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {kpi.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{kpi.label}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Revenue by Day (bar chart) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-5 border border-border"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-foreground text-sm" style={{ fontFamily: "var(--font-heading)" }}>
              Revenue — Last 7 Days
            </h2>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-end gap-2 h-28">
            {DAILY_REVENUE.map((d) => {
              const height = (d.amount / maxDay) * 100
              const isToday = d.day === "Sun"
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                      isToday ? "bg-primary" : "bg-[#FFF4EA]"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{d.day}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>₹{Math.min(...DAILY_REVENUE.map((d) => d.amount)).toLocaleString()}</span>
            <span>₹{maxDay.toLocaleString()}</span>
          </div>
        </motion.div>

        {/* Peak Hours */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-5 border border-border"
        >
          <h2 className="font-bold text-foreground text-sm mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Peak Hours Today
          </h2>
          <div className="flex items-end gap-0.5 h-20">
            {HOURLY.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-primary to-gold transition-all hover:opacity-80"
                style={{ height: `${h}%`, opacity: h > 60 ? 1 : 0.4 + h / 200 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>12 AM</span>
          </div>
        </motion.div>

        {/* Top Selling Items */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-5 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground text-sm" style={{ fontFamily: "var(--font-heading)" }}>
              Top Selling Items
            </h2>
            <Star className="w-4 h-4 text-gold fill-gold" />
          </div>
          <div className="space-y-4">
            {TOP_ITEMS.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">#{i + 1}</span>
                    <span className="text-sm text-foreground font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                      ₹{item.revenue.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{item.orders} orders</div>
                  </div>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-gold"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function StallOwnerRevenuePage() {
  const { ready } = useStallGuard()
  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p role="status" className="text-sm text-muted-foreground">Checking your sign-in…</p>
      </main>
    )
  }
  return <RevenueInner />
}
