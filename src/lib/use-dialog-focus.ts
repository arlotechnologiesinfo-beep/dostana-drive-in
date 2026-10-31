"use client"

import { useEffect, type RefObject } from "react"

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/**
 * Modal behaviour for an overlay: moves focus inside when it opens, keeps Tab inside,
 * closes on Escape, and returns focus to the element that opened it.
 * `initial` is a selector for the element to focus first (default: first focusable).
 */
export function useDialogFocus(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void, initial?: string) {
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const el = ref.current
    const nodes = () => (el ? Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null) : [])
    const target = (initial && el?.querySelector<HTMLElement>(initial)) || nodes()[0]
    target?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== "Tab") return
      const list = nodes()
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      opener?.focus?.()
    }
  }, [open, ref, onClose, initial])
}
