"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Tag,
  Percent,
  IndianRupee,
  Calendar,
  ToggleLeft,
  ToggleRight,
  X,
  Trash2,
  Check,
  Copy,
} from "lucide-react"
import { AdminLayout } from "@/components/dashboard/AdminLayout"

type DiscountType = "PERCENTAGE" | "FLAT"

interface Coupon {
  id: string
  code: string
  description: string
  discountType: DiscountType
  discountValue: number
  minOrder: number
  maxDiscount?: number
  validUntil: string
  isActive: boolean
  usageLimit: number
  usedCount: number
}

const INITIAL_COUPONS: Coupon[] = [
  { id: "c1", code: "WELCOME20",   description: "Welcome discount for first-time visitors",         discountType: "PERCENTAGE", discountValue: 20, minOrder: 200, maxDiscount: 100, validUntil: "2026-12-31", isActive: true,  usageLimit: 500,  usedCount: 148 },
  { id: "c2", code: "BIRYANI50",   description: "Flat ₹50 off on orders from Aroma Biryani",        discountType: "FLAT",       discountValue: 50, minOrder: 250,                   validUntil: "2026-09-30", isActive: true,  usageLimit: 200,  usedCount: 87  },
  { id: "c3", code: "WEEKEND10",   description: "10% off on all weekend orders",                     discountType: "PERCENTAGE", discountValue: 10, minOrder: 150, maxDiscount: 80,  validUntil: "2026-12-31", isActive: true,  usageLimit: 1000, usedCount: 312 },
  { id: "c4", code: "FREETEA",     description: "Free tea with orders above ₹300",                   discountType: "FLAT",       discountValue: 25, minOrder: 300,                   validUntil: "2026-08-31", isActive: false, usageLimit: 100,  usedCount: 100 },
  { id: "c5", code: "MONSOON30",   description: "Monsoon special — 30% off desserts",               discountType: "PERCENTAGE", discountValue: 30, minOrder: 100, maxDiscount: 60,  validUntil: "2026-10-15", isActive: true,  usageLimit: 300,  usedCount: 42  },
]

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE" as DiscountType,
    discountValue: "",
    minOrder: "",
    maxDiscount: "",
    validUntil: "",
    usageLimit: "",
  })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    )
  }

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
    showToast("Coupon deleted")
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    showToast(`Copied: ${code}`)
  }

  const createCoupon = () => {
    if (!newCoupon.code || !newCoupon.discountValue) return
    const c: Coupon = {
      id:            `c${Date.now()}`,
      code:          newCoupon.code.toUpperCase(),
      description:   newCoupon.description || "New discount coupon",
      discountType:  newCoupon.discountType,
      discountValue: Number(newCoupon.discountValue),
      minOrder:      Number(newCoupon.minOrder) || 0,
      maxDiscount:   newCoupon.maxDiscount ? Number(newCoupon.maxDiscount) : undefined,
      validUntil:    newCoupon.validUntil || "2026-12-31",
      isActive:      true,
      usageLimit:    Number(newCoupon.usageLimit) || 100,
      usedCount:     0,
    }
    setCoupons((prev) => [c, ...prev])
    setShowModal(false)
    setNewCoupon({ code: "", description: "", discountType: "PERCENTAGE", discountValue: "", minOrder: "", maxDiscount: "", validUntil: "", usageLimit: "" })
    showToast(`Coupon ${c.code} created!`)
  }

  const activeCoupons   = coupons.filter((c) => c.isActive).length
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usedCount, 0)

  return (
    <AdminLayout title="Coupons" subtitle={`${activeCoupons} active coupons · ${totalRedemptions} total redemptions`}>
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

      <div className="p-4 lg:p-6 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active Coupons",    value: activeCoupons, color: "text-success" },
            { label: "Total Coupons",     value: coupons.length, color: "text-foreground" },
            { label: "Total Redemptions", value: totalRedemptions, color: "text-gold" },
          ].map((s) => (
            <div key={s.label} className="bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl p-4 border border-border text-center">
              <div className={`text-2xl font-black ${s.color}`} style={{ fontFamily: "var(--font-heading)" }}>
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded-xl glow-red hover:bg-primary-dark transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>
        </div>

        {/* Coupons List */}
        <div className="space-y-3">
          {coupons.map((coupon, i) => {
            const usagePercent = Math.round((coupon.usedCount / coupon.usageLimit) * 100)
            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-2xl border p-4 transition-all ${
                  coupon.isActive ? "border-border" : "border-border opacity-55"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      coupon.discountType === "PERCENTAGE" ? "bg-primary/10 border border-primary/20" : "bg-gold/10 border border-gold/20"
                    }`}>
                      {coupon.discountType === "PERCENTAGE" ? (
                        <Percent className="w-5 h-5 text-primary" />
                      ) : (
                        <IndianRupee className="w-5 h-5 text-gold" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="font-black text-foreground text-sm tracking-wider"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center hover:bg-[#FFF4EA] transition-colors"
                        >
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{coupon.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleCoupon(coupon.id)}>
                      {coupon.isActive ? (
                        <ToggleRight className="w-6 h-6 text-success" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="w-7 h-7 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} OFF`}
                    {coupon.maxDiscount && ` (max ₹${coupon.maxDiscount})`}
                  </span>
                  <span>Min order: ₹{coupon.minOrder}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Until {coupon.validUntil}
                  </span>
                </div>

                {/* Usage Bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{coupon.usedCount} used</span>
                    <span>{coupon.usageLimit} limit ({usagePercent}%)</span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-all"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Create Coupon Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/70 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50 bg-white shadow-[0_6px_24px_rgba(48,32,25,0.07)] rounded-3xl border border-border p-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                  Create Coupon
                </h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  placeholder="Coupon Code (e.g. SAVE20) *"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="input-field text-sm h-11"
                  style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.1em" }}
                />
                <input
                  placeholder="Description"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="input-field text-sm h-11"
                />
                <div className="grid grid-cols-2 gap-3">
                  {(["PERCENTAGE", "FLAT"] as DiscountType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewCoupon({ ...newCoupon, discountType: type })}
                      className={`h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all ${
                        newCoupon.discountType === type
                          ? "bg-primary text-white border-primary"
                          : "bg-surface border-border text-muted-foreground"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {type === "PERCENTAGE" ? <Percent className="w-4 h-4" /> : <IndianRupee className="w-4 h-4" />}
                      {type === "PERCENTAGE" ? "Percentage" : "Flat Amount"}
                    </button>
                  ))}
                </div>
                {[
                  { placeholder: `Discount Value ${newCoupon.discountType === "PERCENTAGE" ? "(%)" : "(₹)"} *`, key: "discountValue" },
                  { placeholder: "Min Order Value (₹)", key: "minOrder" },
                  { placeholder: "Max Discount Cap (₹, optional)", key: "maxDiscount" },
                  { placeholder: "Usage Limit (e.g. 100)", key: "usageLimit" },
                ].map((f) => (
                  <input
                    key={f.key}
                    placeholder={f.placeholder}
                    type="number"
                    value={newCoupon[f.key as keyof typeof newCoupon]}
                    onChange={(e) => setNewCoupon({ ...newCoupon, [f.key]: e.target.value })}
                    className="input-field text-sm h-11"
                  />
                ))}
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Valid Until</label>
                  <input
                    type="date"
                    value={newCoupon.validUntil}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                    className="input-field text-sm h-11"
                  />
                </div>
                <button
                  onClick={createCoupon}
                  disabled={!newCoupon.code || !newCoupon.discountValue}
                  className="w-full h-12 rounded-2xl bg-primary glow-red text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Create Coupon
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
