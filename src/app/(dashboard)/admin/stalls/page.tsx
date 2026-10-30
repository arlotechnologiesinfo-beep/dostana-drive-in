"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  Clock,
  TrendingUp,
  ShoppingCart,
  ToggleLeft,
  ToggleRight,
  Flame,
  Plus,
  X,
  Check,
  Store,
} from "lucide-react"
import { AdminLayout } from "@/components/dashboard/AdminLayout"

interface StallData {
  id: string
  name: string
  gradient: string
  description: string
  rating: number
  prepTime: string
  items: number
  todayOrders: number
  todayRevenue: number
  isActive: boolean
  isPopular: boolean
}

const INITIAL_STALLS: StallData[] = [
  { id: "nani-tiffins",  name: "Nani's Tiffins",       gradient: "from-orange-600 to-red-700",    description: "Authentic South Indian tiffins",           rating: 4.7, prepTime: "10–15 min", items: 13, todayOrders: 15, todayRevenue: 975,  isActive: true,  isPopular: true  },
  { id: "tea-time",      name: "Tea Time",              gradient: "from-amber-600 to-yellow-700",  description: "Your daily dose of warmth and chill",      rating: 4.6, prepTime: "5–10 min",  items: 18, todayOrders: 8,  todayRevenue: 320,  isActive: true,  isPopular: false },
  { id: "juice-corner",  name: "Juice Corner",          gradient: "from-green-600 to-emerald-700", description: "Freshly squeezed, blended, and served",    rating: 4.5, prepTime: "5–10 min",  items: 15, todayOrders: 10, todayRevenue: 480,  isActive: true,  isPopular: true  },
  { id: "talks-tonic",   name: "Talks & Tonic",         gradient: "from-pink-600 to-rose-700",     description: "The chatpata corner",                      rating: 4.8, prepTime: "10–12 min", items: 13, todayOrders: 12, todayRevenue: 820,  isActive: true,  isPopular: false },
  { id: "dills-dlite",   name: "Dilli's D'Lite",        gradient: "from-red-600 to-orange-700",    description: "Authentic Delhi ki flavor",                 rating: 4.4, prepTime: "15 min",    items: 22, todayOrders: 14, todayRevenue: 1680, isActive: true,  isPopular: true  },
  { id: "aroma-biryani", name: "Aroma Biryani & Pulao", gradient: "from-yellow-600 to-amber-700",  description: "Every grain of rice tells a story",        rating: 4.9, prepTime: "15–20 min", items: 9,  todayOrders: 18, todayRevenue: 2800, isActive: true,  isPopular: true  },
  { id: "cool-point",    name: "Cool Point",            gradient: "from-blue-600 to-cyan-700",     description: "Life is short, eat dessert first",         rating: 4.7, prepTime: "5 min",     items: 16, todayOrders: 11, todayRevenue: 680,  isActive: true,  isPopular: false },
]

export default function AdminStallsPage() {
  const [stalls, setStalls] = useState<StallData[]>(INITIAL_STALLS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const toggleActive = (id: string) => {
    setStalls((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    )
    const stall = stalls.find((s) => s.id === id)
    showToast(`${stall?.name} is now ${stall?.isActive ? "inactive" : "active"}`)
  }

  const togglePopular = (id: string) => {
    setStalls((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPopular: !s.isPopular } : s))
    )
    const stall = stalls.find((s) => s.id === id)
    showToast(`${stall?.name} popular badge ${stall?.isPopular ? "removed" : "added"}`)
  }

  const totalRevenue = stalls.reduce((sum, s) => sum + s.todayRevenue, 0)
  const totalOrders  = stalls.reduce((sum, s) => sum + s.todayOrders, 0)
  const activeCount  = stalls.filter((s) => s.isActive).length

  return (
    <AdminLayout title="Stalls" subtitle={`${activeCount} of ${stalls.length} stalls active`}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface border border-border rounded-xl px-5 py-3 flex items-center gap-2 shadow-2xl"
          >
            <Check className="w-4 h-4 text-success" />
            <span className="text-sm text-foreground">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active Stalls",   value: `${activeCount}/${stalls.length}`, color: "text-emerald-400" },
            { label: "Today's Orders",  value: totalOrders,                        color: "text-blue-400" },
            { label: "Today's Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: "text-gold" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-4 border border-border text-center">
              <div className={`text-xl font-black ${stat.color}`} style={{ fontFamily: "var(--font-heading)" }}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Add Stall Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded-xl glow-red hover:bg-primary-dark transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Plus className="w-4 h-4" />
            Add Stall
          </button>
        </div>

        {/* Stalls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {stalls.map((stall, i) => (
            <motion.div
              key={stall.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl border overflow-hidden transition-all ${
                stall.isActive ? "border-border" : "border-border opacity-60"
              }`}
            >
              {/* Gradient Header */}
              <div className={`h-24 bg-gradient-to-br ${stall.gradient} relative flex items-end px-4 pb-3`}>
                <div className="absolute top-3 right-3">
                  {stall.isPopular && (
                    <span className="badge-bestseller flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5" />HOT
                    </span>
                  )}
                </div>
                <Store className="h-8 w-8 text-primary" aria-hidden="true" />
                <div className="ml-3 flex-1 min-w-0">
                  <h3
                    className="font-bold text-foreground text-sm truncate"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {stall.name}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span>{stall.rating}</span>
                    <Clock className="w-3 h-3" />
                    <span>{stall.prepTime}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="px-4 py-3 grid grid-cols-3 gap-3 border-b border-border">
                <div className="text-center">
                  <div className="font-bold text-sm text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    {stall.items}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Menu Items</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    {stall.todayOrders}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Orders Today</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm text-gold" style={{ fontFamily: "var(--font-heading)" }}>
                    ₹{stall.todayRevenue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Revenue</div>
                </div>
              </div>

              {/* Controls */}
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                {/* Active Toggle */}
                <button
                  onClick={() => toggleActive(stall.id)}
                  className="flex items-center gap-2 text-xs font-semibold transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stall.isActive ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-success" />
                      <span className="text-success">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">Inactive</span>
                    </>
                  )}
                </button>

                {/* Popular Toggle */}
                <button
                  onClick={() => togglePopular(stall.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    stall.isPopular
                      ? "bg-gold/15 text-gold border border-gold/30"
                      : "bg-muted/50 text-muted-foreground border border-border hover:border-gold/30 hover:text-gold"
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <Flame className="w-3.5 h-3.5" />
                  {stall.isPopular ? "Popular" : "Mark Popular"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Stall Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/70 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50 bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-3xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  Add New Stall
                </h2>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { placeholder: "Stall Name *", type: "text" },
                  { placeholder: "Description", type: "text" },
                  
                  { placeholder: "Prep Time (e.g. 10–15 min)", type: "text" },
                ].map((field) => (
                  <input
                    key={field.placeholder}
                    placeholder={field.placeholder}
                    type={field.type}
                    className="input-field text-sm h-11"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                ))}
                <button
                  onClick={() => { showToast("Stall added! (Demo mode — connect Supabase for persistence)"); setShowAddModal(false) }}
                  className="w-full h-12 rounded-2xl bg-primary glow-red text-white font-bold text-sm"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Create Stall
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
