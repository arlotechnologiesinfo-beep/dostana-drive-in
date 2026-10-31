"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Check } from "lucide-react"
import { SubPage } from "@/components/customer/SubPage"
import { overallStep, statusLabel, TRACK_STEPS } from "@/lib/order-status"
import { useOrders } from "@/lib/use-orders"

export default function OrderTrackingPage() {
  const params = useParams()
  const tableId = String(params.tableId).padStart(2, "0")
  const orderId = String(params.orderId)
  const { orders, ready } = useOrders(tableId)
  const order = orders.find((o) => o.id === orderId)

  if (!ready) {
    return <SubPage tableId={tableId} title="Order" nav={false} backHref={`/table/${tableId}/orders`}><p className="text-sm text-[#77716D]">Loading your order…</p></SubPage>
  }
  if (!order) {
    return (
      <SubPage tableId={tableId} title="Order" nav={false} backHref={`/table/${tableId}/orders`}>
        <div className="rounded-[24px] bg-white px-6 py-12 text-center border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
          <h2 className="text-xl font-bold text-[#26160F]">We couldn&apos;t find that order</h2>
          <Link href={`/table/${tableId}/orders`} className="mt-4 inline-flex min-h-12 items-center rounded-full bg-[#F4772B] px-7 text-[15px] font-semibold text-white">
            My Orders
          </Link>
        </div>
      </SubPage>
    )
  }

  const step = overallStep(order)
  const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })

  return (
    <SubPage tableId={tableId} title={`Order #${order.id.replace("DOSTANA-", "")}`} nav={false} backHref={`/table/${tableId}/orders`}>
      <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-8">
        <section aria-label="Order progress" className="rounded-[22px] bg-white p-5 border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
          <p className="mb-4 text-sm text-[#77716D]">Table {parseInt(order.table_id, 10)}</p>
          {step < 0 ? (
            <p className="rounded-xl bg-[#FCE8E7] px-3 py-2 text-sm text-[#EF493B]">This order was cancelled. Ask a waiter if you need help.</p>
          ) : (
            <ol className="space-y-0">
              {TRACK_STEPS.map((label, i) => {
                const done = i <= step
                const active = i === step && step < 3
                return (
                  <li key={label} className="flex gap-4">
                    <span className="flex flex-col items-center">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          done ? "bg-[#63B65B] text-white" : "bg-[#F1E7DE] text-[#A39B95]"
                        } ${active ? "ring-4 ring-[#EAF6E5]" : ""}`}
                      >
                        {done ? <Check className="h-5 w-5" aria-hidden="true" /> : <span className="text-sm font-semibold">{i + 1}</span>}
                      </span>
                      {i < TRACK_STEPS.length - 1 && <span className={`my-1 w-0.5 flex-1 min-h-6 ${i < step ? "bg-[#63B65B]" : "bg-[#F1E7DE]"}`} aria-hidden="true" />}
                    </span>
                    <span className="pb-5">
                      <span className={`block text-[15px] font-semibold ${done ? "text-[#26160F]" : "text-[#A39B95]"}`}>
                        {label}
                        {active && <span className="sr-only"> (current)</span>}
                      </span>
                      <span className="block text-xs text-[#77716D]">
                        {i === 0 ? time(order.created_at) : done ? (i === step ? time(order.updated_at) : "Done") : "Pending"}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ol>
          )}
        </section>

        <div className="mt-4 space-y-4 lg:mt-0">
          {order.child_orders.map((c) => (
            <section key={c.id} aria-label={c.stall_name} className="rounded-[22px] bg-white p-4 border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="truncate text-base font-bold text-[#26160F]">{c.stall_name}</h2>
                <span className="shrink-0 rounded-full bg-[#FFE7D6] px-3 py-1 text-xs font-semibold text-[#E85D16]">{statusLabel(c.status)}</span>
              </div>
              <ul className="space-y-1 text-sm text-[#302019]">
                {c.items.map((i) => (
                  <li key={`${i.menu_item_id}-${i.variant_name ?? ""}`} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate">{i.quantity} × {i.name}</span>
                    <span className="shrink-0 font-medium">₹{i.unit_price * i.quantity}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section aria-label="Bill" className="rounded-[22px] bg-white p-5 border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-[#77716D]">Item Total</dt><dd className="font-medium">₹{order.subtotal}</dd></div>
              <div className="flex justify-between"><dt className="text-[#77716D]">Taxes &amp; Charges</dt><dd className="font-medium">₹{order.tax_amount}</dd></div>
              <div className="flex justify-between border-t border-[#F1E7DE] pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold">₹{order.grand_total}</dd></div>
              <div className="flex justify-between pt-1"><dt className="text-[#77716D]">Payment</dt><dd className="font-medium">{order.payment_method === "UPI" ? "UPI" : "Pay at Table"} · {order.payment_status === "PAID" ? "Paid" : "Pending"}</dd></div>
            </dl>
          </section>
        </div>
      </div>
    </SubPage>
  )
}
