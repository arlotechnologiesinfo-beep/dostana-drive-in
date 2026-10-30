"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Banknote, Smartphone } from "lucide-react"
import { SubPage } from "@/components/customer/SubPage"
import { createTransactionalOrder } from "@/lib/orders-db"
import { useMounted } from "@/lib/use-mounted"
import { useCartStore } from "@/stores/cart"

type Method = "CASH_AT_TABLE" | "UPI"

const METHODS: { id: Method; title: string; desc: string; icon: typeof Banknote }[] = [
  { id: "CASH_AT_TABLE", title: "Pay at Table", desc: "Settle your bill at the table with a waiter", icon: Banknote },
  { id: "UPI", title: "UPI", desc: "Pay using any UPI app", icon: Smartphone },
]

export default function PaymentPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const router = useRouter()
  const mounted = useMounted()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)

  const [method, setMethod] = useState<Method>("CASH_AT_TABLE")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [placed, setPlaced] = useState(false)
  const idempotencyKey = useRef<string | null>(null)

  const lines = mounted ? items : []
  const subtotal = lines.reduce((n, i) => n + i.price * i.quantity, 0)
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + tax

  const placeOrder = () => {
    if (submitting || lines.length === 0) return
    setSubmitting(true)
    setError(null)
    idempotencyKey.current ??= `IDEM-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const result = createTransactionalOrder({
      table_id: tableId,
      customer_name: name.trim() || "Guest",
      customer_phone: "",
      payment_method: method,
      idempotency_key: idempotencyKey.current,
      items: lines.map((i) => ({
        menu_item_id: i.menu_item_id,
        stall_id: i.stall_id,
        variant_name: i.variant_name,
        quantity: i.quantity,
        special_instructions: i.special_instructions,
      })),
    })
    if (!result.success || !result.parent_order) {
      setError(result.error ?? "We couldn't place your order. Please try again.")
      setSubmitting(false)
      return
    }
    setPlaced(true)
    clearCart()
    router.replace(`/table/${tableId}/orders/${result.parent_order.id}/confirmed`)
  }

  if (placed) {
    return (
      <SubPage tableId={tableId} title="Payment" nav={false} backHref={`/table/${tableId}/orders`}>
        <p role="status" className="rounded-[24px] bg-white px-6 py-12 text-center text-sm text-[#77716D] shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
          Order placed. Taking you to your order…
        </p>
      </SubPage>
    )
  }

  if (mounted && lines.length === 0) {
    return (
      <SubPage tableId={tableId} title="Payment" nav={false} backHref={`/table/${tableId}/cart`}>
        <div className="rounded-[24px] bg-white px-6 py-12 text-center shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
          <h2 className="text-xl font-bold text-[#26160F]">Your cart is empty</h2>
          <p className="mt-1 text-sm text-[#77716D]">Add something from a stall before paying.</p>
          <Link href={`/table/${tableId}/stalls`} className="mt-4 inline-flex min-h-12 items-center rounded-full bg-[#F4772B] px-7 text-[15px] font-semibold text-white">
            Browse stalls
          </Link>
        </div>
      </SubPage>
    )
  }

  return (
    <SubPage tableId={tableId} title="Payment" nav={false} backHref={`/table/${tableId}/cart`}>
      <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-8">
        <div className="space-y-6">
          <fieldset>
            <legend className="mb-3 text-base font-bold text-[#26160F]">Select Payment Method</legend>
            <div className="space-y-3">
              {METHODS.map((m) => {
                const selected = method === m.id
                const Icon = m.icon
                return (
                  <label
                    key={m.id}
                    className={`flex min-h-[72px] cursor-pointer items-center gap-4 rounded-[20px] border-2 bg-white px-4 transition-colors ${
                      selected ? "border-[#F4772B]" : "border-transparent shadow-[0_6px_24px_rgba(48,32,25,0.07)]"
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFE7D6] text-[#E85D16]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold text-[#26160F]">{m.title}</span>
                      <span className="block text-xs text-[#77716D]">{m.desc}</span>
                    </span>
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={selected}
                      onChange={() => setMethod(m.id)}
                      className="h-5 w-5 accent-[#F4772B]"
                    />
                  </label>
                )
              })}
            </div>
            {method === "UPI" && <p className="mt-2 text-xs text-[#A39B95]">Demo checkout: UPI is simulated and no money is charged.</p>}
          </fieldset>

          <div>
            <label htmlFor="customer-name" className="mb-2 block text-base font-bold text-[#26160F]">
              Your name <span className="text-sm font-normal text-[#77716D]">(optional)</span>
            </label>
            <input
              id="customer-name"
              type="text"
              autoComplete="given-name"
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="So the waiter can greet you"
              className="h-12 w-full rounded-2xl border border-[#F1E7DE] bg-white px-4 text-sm text-[#302019] outline-none placeholder:text-[#A39B95] focus:border-[#F4772B]"
            />
          </div>
        </div>

        <section aria-label="Bill summary" className="mt-6 rounded-[22px] bg-white p-5 shadow-[0_6px_24px_rgba(48,32,25,0.07)] lg:mt-9">
          <p className="mb-3 text-sm text-[#77716D]">Table {parseInt(tableId, 10)} · {lines.length} {lines.length === 1 ? "line" : "lines"}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-[#77716D]">Item Total</dt><dd className="font-medium">₹{subtotal}</dd></div>
            <div className="flex justify-between"><dt className="text-[#77716D]">Taxes &amp; Charges</dt><dd className="font-medium">₹{tax}</dd></div>
            <div className="flex justify-between border-t border-[#F1E7DE] pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold">₹{total}</dd></div>
          </dl>
          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-[#FCE8E7] px-3 py-2 text-sm text-[#EF493B]">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={placeOrder}
            disabled={submitting || lines.length === 0}
            className="mt-4 hidden h-[52px] w-full items-center justify-center rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16] disabled:opacity-60 lg:flex"
          >
            {submitting ? "Placing order…" : `Place Order · ₹${total}`}
          </button>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-[#FFF9F2]/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 lg:hidden">
        <button
          type="button"
          onClick={placeOrder}
          disabled={submitting || lines.length === 0}
          className="mx-auto flex h-[52px] w-full max-w-[430px] items-center justify-center rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16] disabled:opacity-60 md:max-w-[720px]"
        >
          {submitting ? "Placing order…" : `Place Order · ₹${total}`}
        </button>
      </div>
    </SubPage>
  )
}
