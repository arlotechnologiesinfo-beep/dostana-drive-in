"use client"

import { useCartStore } from "@/stores/cart"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  MapPin,
  MessageSquare,
  Tag,
} from "lucide-react"
import { STALLS } from "@/data/menu"

interface DesktopCartSidebarProps {
  tableId: string
}

export function DesktopCartSidebar({ tableId }: DesktopCartSidebarProps) {
  const router = useRouter()
  const {
    items,
    updateQuantity,
    updateSpecialInstructions,
    removeItem,
    getTotal,
    getItemsByStall,
  } = useCartStore()

  const itemsByStall = getItemsByStall()
  const total = getTotal()
  const tax = Math.round(total * 0.05)
  const grandTotal = total + tax

  return (
    <aside className="hidden lg:block sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto glass-card rounded-3xl p-5 scrollbar-hide">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Table {tableId} Order
            </h3>
            <span className="text-[11px] text-gold font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Live Session Cart
            </span>
          </div>
        </div>
        <span className="text-xs font-bold text-muted-foreground bg-surface px-2.5 py-1 rounded-full border border-border">
          {items.reduce((s, i) => s + i.quantity, 0)} items
        </span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-foreground text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            Your Cart is Empty
          </h4>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-[200px] mx-auto">
            Click on any dish to add items from our 7 kitchens!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Items by stall */}
          {Object.entries(itemsByStall).map(([stallId, stallItems]) => {
            const stallInfo = STALLS.find((s) => s.id === stallId)
            return (
              <div key={stallId} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stallInfo?.emoji || "🍽️"}</span>
                  <span className="font-bold text-foreground text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                    {stallItems[0].stall_name}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="space-y-2">
                  {stallItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-surface p-3 rounded-xl border border-border flex items-center justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground text-xs truncate" style={{ fontFamily: "var(--font-heading)" }}>
                          {item.name}
                        </div>
                        <div className="text-primary font-bold text-xs mt-0.5" style={{ fontFamily: "var(--font-heading)" }}>
                          ₹{item.price * item.quantity}
                        </div>
                      </div>

                      {/* Qty Stepper */}
                      <div className="qty-stepper scale-90">
                        <button onClick={() => item.quantity === 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="w-3.5 h-3.5 text-white" />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Bill Summary */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-semibold">₹{total}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>GST (5%)</span>
              <span className="text-foreground font-semibold">₹{tax}</span>
            </div>
            <div className="flex justify-between text-sm pt-1 border-t border-border/60">
              <span className="font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Grand Total</span>
              <span className="font-black text-lg text-gradient" style={{ fontFamily: "var(--font-heading)" }}>₹{grandTotal}</span>
            </div>
          </div>

          {/* Checkout CTA Button */}
          <button
            onClick={() => router.push(`/table/${tableId}/checkout`)}
            className="w-full h-12 rounded-2xl bg-primary glow-maroon text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-dark transition-all rave-glow"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  )
}
