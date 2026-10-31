"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bell, ConciergeBell, Droplets, Receipt, Utensils, Sparkles, HelpCircle, CheckCircle2, Clock } from "lucide-react"

interface CallWaiterModalProps {
  tableId: string
  isOpen: boolean
  onClose: () => void
}

const REQUEST_TYPES = [
  { id: "CALL_WAITER", label: "Call Waiter", icon: Bell, desc: "Request waiter to visit Table " },
  { id: "NEED_WATER", label: "Need Water", icon: Droplets, desc: "Fresh drinking water" },
  { id: "NEED_BILL", label: "Need Bill", icon: Receipt, desc: "Final session bill" },
  { id: "EXTRA_PLATES", label: "Extra Plates", icon: Utensils, desc: "Plates & cutlery" },
  { id: "NEED_ASSISTANCE", label: "Need Assistance", icon: HelpCircle, desc: "General help" },
  { id: "NEED_CLEANING", label: "Need Cleaning", icon: Sparkles, desc: "Table cleaning" },
] as const

export function CallWaiterModal({ tableId, isOpen, onClose }: CallWaiterModalProps) {
  const [selectedType, setSelectedType] = useState<typeof REQUEST_TYPES[number]["id"] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [cooldownSeconds, setCooldownSeconds] = useState<number | null>(null)

  if (!isOpen) return null

  const handleSendRequest = async () => {
    if (!selectedType || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/waiter-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table_id: tableId,
          request_type: selectedType,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        if (data.cooldown_seconds) {
          setCooldownSeconds(data.cooldown_seconds)
        } else {
          alert(data.error || "Failed to send request.")
        }
      } else {
        setSuccessMessage("Staff notified! A team member is on their way to Table " + tableId)
        setTimeout(() => {
          setSuccessMessage(null)
          setSelectedType(null)
          onClose()
        }, 2200)
      }
    } catch {
      alert("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#26160F]/40"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          className="relative max-h-[92vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-t-3xl border border-[#F1E7DE] bg-white p-5 pb-[max(env(safe-area-inset-bottom),24px)] sm:rounded-3xl sm:pb-5 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <ConciergeBell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  Call Waiter & Assistance
                </h3>
                <span className="text-xs text-gold font-semibold">Table {tableId} Assistance</span>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close" className="w-11 h-11 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Alert */}
          {successMessage ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-success/15 border border-success/30 rounded-2xl p-6 text-center space-y-2"
            >
              <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
              <h4 className="font-bold text-foreground text-base" style={{ fontFamily: "var(--font-heading)" }}>
                Request Sent!
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {successMessage}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Cooldown Alert */}
              {cooldownSeconds && (
                <div className="bg-gold/15 border border-gold/30 rounded-xl p-3 flex items-center gap-2.5 text-xs text-gold">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Please wait {cooldownSeconds} seconds before sending another request to Table {tableId}.</span>
                </div>
              )}

              {/* Grid of Request Types */}
              <div className="grid grid-cols-2 gap-3">
                {REQUEST_TYPES.map((req) => {
                  const Icon = req.icon
                  const isSelected = selectedType === req.id
                  return (
                    <button
                      key={req.id}
                      onClick={() => { setSelectedType(req.id); setCooldownSeconds(null) }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-primary/15 border-primary text-primary"
                          : "bg-surface border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-primary" : "text-gold"}`} />
                      <div className="font-bold text-xs" style={{ fontFamily: "var(--font-heading)" }}>
                        {req.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{req.desc}</div>
                    </button>
                  )
                })}
              </div>

              {/* Send Action */}
              <button
                onClick={handleSendRequest}
                disabled={!selectedType || isSubmitting}
                className={`w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedType && !isSubmitting
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span>{isSubmitting ? "Sending Request..." : "Send Request to Staff"}</span>
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
