"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star, CheckCircle2, MessageSquare } from "lucide-react"

interface OrderReviewModalProps {
  orderId: string
  tableId: string
  isOpen: boolean
  onClose: () => void
}

export function OrderReviewModal({ orderId, tableId, isOpen, onClose }: OrderReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          table_id: tableId,
          rating,
          comment,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          onClose()
        }, 2000)
      } else {
        alert("Failed to submit review.")
      }
    } catch {
      alert("Network error.")
    } finally {
      setIsSubmitting(false)
    }
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

        {/* Modal Container */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          className="relative w-full max-w-md bg-surface border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 overflow-hidden z-10 space-y-4 text-center"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-white text-base" style={{ fontFamily: "var(--font-heading)" }}>
              Rate Your Dining Experience
            </h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            <div className="py-8 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
              <h4 className="font-bold text-white text-lg" style={{ fontFamily: "var(--font-heading)" }}>
                Thank You for Your Review!
              </h4>
              <p className="text-xs text-muted-foreground">Your feedback helps us make Dostana Drive-In even better.</p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <p className="text-xs text-muted-foreground">
                How was your meal for Order <strong className="text-white">#{orderId}</strong> at Table {tableId}?
              </p>

              {/* Star Rating */}
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? "text-gold fill-gold glow-gold" : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Comment Input */}
              <div className="text-left space-y-1">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5" style={{ fontFamily: "var(--font-heading)" }}>
                  <MessageSquare className="w-3.5 h-3.5 text-gold" />
                  Your Feedback (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your thoughts about food taste, stall service, etc..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input-field text-xs p-3 h-20 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 rounded-2xl bg-primary glow-red text-white font-bold text-sm hover:bg-primary-dark transition-all rave-glow"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
