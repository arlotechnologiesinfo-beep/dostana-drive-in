"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check } from "lucide-react"
import type { CartToastState } from "@/lib/use-cart-actions"

export function CartToast({ toast, withNav = true }: { toast: CartToastState | null; withNav?: boolean }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 ${withNav ? "bottom-[112px]" : "bottom-[88px]"}`}
        >
          <span className="flex max-w-[360px] items-center gap-2 rounded-full bg-[#26160F] px-4 py-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(38,22,15,0.08)]">
            <Check className="h-4 w-4 shrink-0 text-[#63B65B]" aria-hidden="true" />
            <span className="truncate">{toast.text}</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
