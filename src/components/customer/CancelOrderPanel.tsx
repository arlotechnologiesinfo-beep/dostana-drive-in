"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Clock, HelpCircle, PhoneCall } from "lucide-react"
import { cancelOrderByCustomer, createWaiterRequest, getCancelState, type ParentOrder } from "@/lib/orders-db"
import { useNow } from "@/lib/use-order-events"

const card = "rounded-[22px] border border-[#F1E7DE] bg-white p-5 shadow-[0_6px_24px_rgba(48,32,25,0.06)]"

function mmss(total: number) {
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

/** Cancel for 2 minutes while no stall has accepted; afterwards, point the customer to the stall. */
export function CancelOrderPanel({ tableId, order }: { tableId: string; order: ParentOrder }) {
  const allServed = order.child_orders.every((c) => c.status === "DELIVERED" || c.status === "CANCELLED")
  const state = getCancelState(order)
  const now = useNow(!allServed && state.state === "open")
  const [confirming, setConfirming] = useState(false)
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null)
  const keepRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (confirming) keepRef.current?.focus()
  }, [confirming])

  if (allServed) return null

  const live = now === null ? state : getCancelState(order, now)
  const stallNames = Array.from(new Set(order.child_orders.filter((c) => c.status !== "CANCELLED").map((c) => c.stall_name))).join(", ")
  const orderNo = order.id.replace("DOSTANA-", "")

  const askStall = () => {
    const res = createWaiterRequest(tableId, "NEED_ASSISTANCE", `Order #${orderNo}: customer needs ${stallNames} to help (cancel or change).`)
    setMessage(
      res.success
        ? { tone: "ok", text: "A waiter has been asked to bring you to the stall or contact it for you." }
        : { tone: "error", text: res.error ?? "We couldn't send that. Please ask a waiter at your table." }
    )
  }

  const doCancel = () => {
    const res = cancelOrderByCustomer(tableId, order.id)
    setConfirming(false)
    setMessage(res.success ? { tone: "ok", text: "Your order is cancelled." } : { tone: "error", text: res.error ?? "We couldn't cancel this order." })
  }

  return (
    <section aria-label="Cancel order" className={card}>
      {live.state === "open" ? (
        <>
          <h2 className="flex items-center gap-2 text-base font-bold text-[#26160F]">
            <Clock className="h-5 w-5 text-[#E85D16]" aria-hidden="true" /> Changed your mind?
          </h2>
          <p className="mt-1 text-sm text-[#5E5650]">
            You can cancel for <strong className="tabular-nums">{mmss(live.secondsLeft)}</strong> more, as long as the stall hasn&apos;t accepted your order.
          </p>
          {!confirming ? (
            <button type="button" onClick={() => setConfirming(true)} className="mt-3 min-h-12 rounded-full border border-[#B3261E] px-6 text-[15px] font-semibold text-[#B3261E]">
              Cancel order
            </button>
          ) : (
            <div role="alertdialog" aria-label={`Cancel order ${orderNo}`} className="mt-3 rounded-2xl bg-[#FCE8E7] p-4">
              <p className="text-sm font-semibold text-[#26160F]">Cancel order #{orderNo} (₹{order.grand_total})?</p>
              <p className="mt-1 text-sm text-[#5E5650]">All stalls in this order will be told. This can&apos;t be undone.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button ref={keepRef} type="button" onClick={() => setConfirming(false)} className="min-h-12 rounded-full bg-white px-6 text-[15px] font-semibold text-[#26160F] border border-[#F1E7DE]">
                  Keep order
                </button>
                <button type="button" onClick={doCancel} className="min-h-12 rounded-full bg-[#B3261E] px-6 text-[15px] font-semibold text-white">
                  Yes, cancel order #{orderNo}
                </button>
              </div>
            </div>
          )}
        </>
      ) : live.reason === "CANCELLED" ? (
        <p className="text-sm text-[#5E5650]">This order is cancelled. If something doesn&apos;t look right, ask a waiter or <Link href={`/table/${tableId}/help`} className="font-semibold text-[#E85D16] underline">visit Help</Link>.</p>
      ) : (
        <>
          <h2 className="flex items-center gap-2 text-base font-bold text-[#26160F]">
            <HelpCircle className="h-5 w-5 text-[#E85D16]" aria-hidden="true" />
            {live.reason === "ACCEPTED" ? "The stall has started your order" : "The 2-minute cancel time is over"}
          </h2>
          <p className="mt-1 text-sm text-[#5E5650]">
            To cancel or change this order, please contact the stall ({stallNames}). We can ask a waiter to help you.
          </p>
          <button type="button" onClick={askStall} className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#F4772B] px-6 text-[15px] font-semibold text-white">
            <PhoneCall className="h-4 w-4" aria-hidden="true" /> Ask the stall for help
          </button>
        </>
      )}
      {message && (
        <p role="status" className={`mt-3 rounded-xl px-3 py-2 text-sm font-medium ${message.tone === "ok" ? "bg-[#EAF6E5] text-[#145A25]" : "bg-[#FCE8E7] text-[#B3261E]"}`}>
          {message.text}
        </p>
      )}
      <Link href={`/table/${tableId}/help`} className="mt-3 inline-block text-sm font-semibold text-[#E85D16] underline">Need more help? Open Help and FAQs</Link>
    </section>
  )
}
