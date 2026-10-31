"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight, ConciergeBell } from "lucide-react"
import { SubPage } from "@/components/customer/SubPage"
import { isOngoing, itemCount, overallStep, TRACK_STEPS } from "@/lib/order-status"
import { useOrders } from "@/lib/use-orders"

export default function MyOrdersPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const { orders, ready } = useOrders(tableId)
  const [tab, setTab] = useState<"ongoing" | "past">("ongoing")

  const list = orders.filter((o) => (tab === "ongoing" ? isOngoing(o) : !isOngoing(o)))

  return (
    <SubPage tableId={tableId} title="My Orders">
      <div role="tablist" aria-label="Order status" className="mb-5 grid grid-cols-2 rounded-full bg-white p-1 shadow-[0_2px_8px_rgba(48,32,25,0.06)] md:max-w-sm">
        {(["ongoing", "past"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`min-h-11 rounded-full text-sm font-semibold capitalize transition-colors ${tab === t ? "bg-[#F4772B] text-white" : "text-[#77716D]"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {!ready ? (
        <p className="text-sm text-[#77716D]">Loading your orders…</p>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[24px] bg-white px-6 py-14 text-center border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFE7D6]">
            <ConciergeBell className="h-6 w-6 text-[#E85D16]" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-bold text-[#26160F]">{tab === "ongoing" ? "No orders in progress" : "No past orders yet"}</h2>
          <p className="max-w-[30ch] text-sm text-[#77716D]">{tab === "ongoing" ? "Orders you place from this table show up here." : "Served orders move here."}</p>
          <Link href={`/table/${tableId}`} className="mt-1 inline-flex min-h-12 items-center rounded-full bg-[#F4772B] px-7 text-[15px] font-semibold text-white">
            Start ordering
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
          {list.map((o) => {
            const step = overallStep(o)
            return (
              <li key={o.id}>
                <Link
                  href={`/table/${tableId}/orders/${o.id}`}
                  className="flex items-center gap-3 rounded-[22px] bg-white p-4 border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)] transition-transform active:scale-[0.99]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-[15px] font-bold text-[#26160F]">Order #{o.id.replace("DOSTANA-", "")}</span>
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${step >= 3 ? "bg-[#EAF6E5] text-[#145A25]" : "bg-[#FFE7D6] text-[#E85D16]"}`}>
                        {step < 0 ? "Cancelled" : TRACK_STEPS[step]}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs text-[#77716D]">
                      Table {parseInt(o.table_id, 10)} · {o.child_orders.map((c) => c.stall_name).join(", ")}
                    </span>
                    <span className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-[#302019]">{itemCount(o)} {itemCount(o) === 1 ? "item" : "items"} · ₹{o.grand_total}</span>
                      <span className="text-xs text-[#A39B95]">{new Date(o.created_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[#A39B95]" aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </SubPage>
  )
}
