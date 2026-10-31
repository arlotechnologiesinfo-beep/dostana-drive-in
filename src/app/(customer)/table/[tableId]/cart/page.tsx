"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ShoppingBag, UtensilsCrossed } from "lucide-react"
import { QtyStepper } from "@/components/customer/QtyStepper"
import { SubPage } from "@/components/customer/SubPage"
import { useMounted } from "@/lib/use-mounted"
import { useCartStore } from "@/stores/cart"

const TAX_RATE = 0.05

export default function CartPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const mounted = useMounted()
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)

  const [confirmClear, setConfirmClear] = useState(false)
  const lines = mounted ? items : []
  const subtotal = lines.reduce((n, i) => n + i.price * i.quantity, 0)
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + tax

  const byStall = lines.reduce<Record<string, typeof lines>>((acc, i) => {
    ;(acc[i.stall_id] ??= []).push(i)
    return acc
  }, {})

  return (
    <SubPage
      tableId={tableId}
      title="Your Cart"
      nav={false}
      right={
        lines.length > 0 ? (
          confirmClear ? (
          <span className="flex items-center gap-1">
            <button type="button" onClick={() => { clearCart(); setConfirmClear(false) }} className="min-h-11 rounded-full bg-[#EF493B] px-3 text-xs font-semibold text-white">
              Remove all {lines.length} items
            </button>
            <button type="button" autoFocus onKeyDown={(e) => e.key === "Escape" && setConfirmClear(false)} onClick={() => setConfirmClear(false)} className="min-h-11 px-2 text-xs font-medium text-[#77716D]">Keep</button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirmClear(true)} className="min-h-11 text-sm font-medium text-[#E85D16]">
            Clear All
          </button>
        )
        ) : null
      }
    >
      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[24px] bg-white px-6 py-14 text-center border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE7D6]">
            <ShoppingBag className="h-6 w-6 text-[#E85D16]" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-bold text-[#26160F]">{mounted ? "Your cart is empty" : "Loading your cart"}</h2>
          <p className="max-w-[30ch] text-sm text-[#77716D]">Add dishes from any stall. They all go on one bill for Table {parseInt(tableId, 10)}.</p>
          <Link href={`/table/${tableId}/stalls`} className="mt-1 inline-flex min-h-12 items-center rounded-full bg-[#F4772B] px-7 text-[15px] font-semibold text-white">
            Browse stalls
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:items-start lg:gap-8">
          <div>
            <p className="mb-3 text-sm text-[#77716D]">Table {parseInt(tableId, 10)}</p>
            <div className="space-y-4">
              {Object.entries(byStall).map(([stallId, stallLines]) => (
                <section key={stallId} aria-label={stallLines[0].stall_name} className="rounded-[22px] bg-white p-4 border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
                  <h2 className="mb-3 text-base font-bold text-[#26160F]">{stallLines[0].stall_name}</h2>
                  <ul className="divide-y divide-[#F1E7DE]">
                    {stallLines.map((i) => (
                      <li key={i.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFF1E5]">
                          {i.image ? <Image src={i.image} alt="" fill sizes="56px" className="object-cover" /> : <UtensilsCrossed className="h-5 w-5 text-[#F4772B]/60" aria-hidden="true" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-[#26160F]">{i.name}</span>
                          {i.variant_name && <span className="block truncate text-xs text-[#77716D]">{i.variant_name}</span>}
                          {i.special_instructions && <span className="block truncate text-xs text-[#77716D]">Note: {i.special_instructions}</span>}
                          <span className="mt-0.5 block text-sm font-bold text-[#26160F]">₹{i.price * i.quantity}</span>
                        </span>
                        <QtyStepper value={i.quantity} label={i.name} onChange={(q) => updateQuantity(i.id, q)} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          <section aria-label="Bill summary" className="mt-4 rounded-[22px] bg-white p-5 border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)] lg:sticky lg:top-8 lg:mt-9">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#77716D]">Item Total</dt>
                <dd className="font-medium text-[#26160F]">₹{subtotal}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#77716D]">Taxes &amp; Charges</dt>
                <dd className="font-medium text-[#26160F]">₹{tax}</dd>
              </div>
              <div className="flex justify-between border-t border-[#F1E7DE] pt-3 text-base">
                <dt className="font-bold text-[#26160F]">Total</dt>
                <dd className="font-extrabold text-[#26160F]">₹{total}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs leading-4 text-[#A39B95]">Prices are confirmed again when you place the order.</p>
            <Link
              href={`/table/${tableId}/checkout`}
              className="mt-4 hidden h-[52px] items-center justify-center rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16] lg:flex"
            >
              Proceed to Order
            </Link>
          </section>
        </div>
      )}

      {lines.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-[#FFF9F2]/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 lg:hidden">
          <Link
            href={`/table/${tableId}/checkout`}
            className="mx-auto flex h-[52px] max-w-[430px] items-center justify-center rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16] md:max-w-[720px]"
          >
            Proceed to Order · ₹{total}
          </Link>
        </div>
      )}
    </SubPage>
  )
}
