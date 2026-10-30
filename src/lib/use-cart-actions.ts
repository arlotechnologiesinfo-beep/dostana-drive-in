"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { AddableDish } from "@/lib/catalog"
import { useMounted } from "@/lib/use-mounted"
import { useCartStore } from "@/stores/cart"

export interface CartToastState {
  id: number
  text: string
}

/** Cart reads and writes for browsing screens, plus a short confirmation toast. */
export function useCartActions() {
  const mounted = useMounted()
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const [toast, setToast] = useState<CartToastState | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const show = useCallback((text: string) => {
    window.clearTimeout(timer.current)
    setToast({ id: Date.now(), text })
    timer.current = window.setTimeout(() => setToast(null), 2200)
  }, [])

  const quantityFor = (id: string) => (mounted ? (items.find((i) => i.menu_item_id === id)?.quantity ?? 0) : 0)
  const count = mounted ? items.reduce((n, i) => n + i.quantity, 0) : 0
  const total = mounted ? items.reduce((n, i) => n + i.price * i.quantity, 0) : 0

  const add = (dish: AddableDish) => {
    addItem({
      stall_id: dish.stallId,
      stall_name: dish.stallName,
      menu_item_id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      image: dish.image ?? "",
    })
    show(`${dish.name} added · Cart ₹${useCartStore.getState().getTotal()}`)
  }

  const setQty = (dish: { id: string }, quantity: number) => {
    updateQuantity(dish.id, quantity)
    if (quantity > 0) show(`Cart ₹${useCartStore.getState().getTotal()}`)
  }

  return { quantityFor, count, total, add, setQty, toast }
}
