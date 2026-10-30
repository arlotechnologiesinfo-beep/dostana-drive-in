"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, Sparkles, MessageSquare, ShoppingBag, ArrowRight } from "lucide-react"
import type { MenuItem } from "@/types"
import { getRecommendationsForItem, STALLS } from "@/data/menu"
import { useCartStore } from "@/stores/cart"

interface FoodItemDetailModalProps {
  item: MenuItem | null
  tableId: string
  onClose: () => void
  onSelectRecommended?: (recItem: MenuItem) => void
}

export function FoodItemDetailModal({
  item,
  tableId,
  onClose,
  onSelectRecommended,
}: FoodItemDetailModalProps) {
  const { addItem } = useCartStore()
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [instructions, setInstructions] = useState("")
  const [isAddedSuccess, setIsAddedSuccess] = useState(false)

  useEffect(() => {
    if (item) {
      setQuantity(1)
      setInstructions("")
      setIsAddedSuccess(false)
      if (item.variants && item.variants.length > 0) {
        setSelectedVariant(item.variants[0].name)
      } else {
        setSelectedVariant(null)
      }
    }
  }, [item])

  if (!item) return null

  const stall = STALLS.find((s) => s.id === item.stall_id)
  const recommendations = getRecommendationsForItem(item)

  // Determine current unit price
  const currentVariantObj = item.variants?.find((v) => v.name === selectedVariant)
  const unitPrice = currentVariantObj ? currentVariantObj.price : item.price
  const totalPrice = unitPrice * quantity

  const handleAddToCart = () => {
    addItem({
      stall_id: item.stall_id,
      stall_name: stall?.name || item.stall_id,
      menu_item_id: item.id,
      variant_name: selectedVariant || undefined,
      name: selectedVariant ? `${item.name} (${selectedVariant})` : item.name,
      price: unitPrice,
      quantity,
      special_instructions: instructions || undefined,
      image: item.image || stall?.coverImage || "",
    })

    setIsAddedSuccess(true)
    setTimeout(() => {
      setIsAddedSuccess(false)
      onClose()
    }, 600)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal / Bottom Sheet Container */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 32 }}
          className="relative w-full max-w-lg bg-surface border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col z-10"
        >
          {/* Header Image */}
          <div className="relative h-56 sm:h-64 shrink-0 overflow-hidden bg-muted">
            <img
              src={item.image || stall?.coverImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges on Image */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.is_veg ? <div className="veg-dot" /> : <div className="non-veg-dot" />}
                {item.badge && (
                  <span className="badge-bestseller text-[10px] uppercase font-black tracking-wider">
                    {item.badge}
                  </span>
                )}
                {item.is_bestseller && (
                  <span className="badge-bestseller text-[10px]">⭐ BESTSELLER</span>
                )}
              </div>
              {stall && (
                <span className="text-[11px] font-semibold text-white/80 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                  {stall.emoji} {stall.name}
                </span>
              )}
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="p-5 overflow-y-auto space-y-5 flex-1 scrollbar-hide">
            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-black text-foreground leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  {item.name}
                </h2>
                <div className="text-xl font-black text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                  ₹{unitPrice}
                </div>
              </div>
              {item.subtitle && (
                <p className="text-gold text-xs font-semibold mt-1" style={{ fontFamily: "var(--font-heading)" }}>
                  {item.subtitle}
                </p>
              )}
              {item.description && (
                <p className="text-muted-foreground text-xs leading-relaxed mt-1.5">
                  {item.description}
                </p>
              )}
            </div>

            {/* Size Variant Selector (Single / Full / Family) */}
            {item.variants && item.variants.length > 0 && (
              <div className="bg-muted/40 p-3.5 rounded-2xl border border-white/6 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                    Select Portion Size
                  </span>
                  <span className="text-muted-foreground">Required</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {item.variants.map((v) => {
                    const isSelected = selectedVariant === v.name
                    return (
                      <button
                        key={v.name}
                        onClick={() => setSelectedVariant(v.name)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? "bg-primary/15 border-primary text-primary glow-red"
                            : "bg-surface border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="font-bold text-xs" style={{ fontFamily: "var(--font-heading)" }}>
                          {v.name}
                        </div>
                        <div className="text-xs font-black mt-0.5" style={{ fontFamily: "var(--font-heading)" }}>
                          ₹{v.price}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                <MessageSquare className="w-3.5 h-3.5 text-gold" />
                Special Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Extra spicy, no onions, extra chutney..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="input-field text-xs h-11"
              />
            </div>

            {/* Goes well with Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Goes well with</span>
                </div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => onSelectRecommended && onSelectRecommended(rec)}
                      className="shrink-0 w-36 glass-card p-2.5 rounded-2xl border border-white/6 cursor-pointer hover:border-white/20 transition-all"
                    >
                      <div className="font-semibold text-foreground text-xs truncate" style={{ fontFamily: "var(--font-heading)" }}>
                        {rec.name}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary font-bold text-xs" style={{ fontFamily: "var(--font-heading)" }}>
                          ₹{rec.price}
                        </span>
                        <span className="text-[10px] text-gold font-bold">+ Add</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar: Quantity & Add Button */}
          <div className="p-4 bg-surface-2 border-t border-border flex items-center justify-between gap-4 shrink-0">
            {/* Quantity Stepper */}
            <div className="qty-stepper">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="w-4 h-4 text-white" />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={isAddedSuccess}
              className="flex-1 h-12 rounded-2xl bg-primary glow-maroon text-white font-bold text-sm flex items-center justify-between px-5 hover:bg-primary-dark transition-all rave-glow"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span>{isAddedSuccess ? "Added to Cart! 🎉" : "Add to Cart"}</span>
              <div className="flex items-center gap-1">
                <span>₹{totalPrice}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
