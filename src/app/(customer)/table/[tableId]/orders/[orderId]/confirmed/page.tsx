"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Check, Leaf } from "lucide-react"
import { getStall } from "@/lib/catalog"
import { useOrders } from "@/lib/use-orders"

export default function OrderConfirmedPage() {
  const params = useParams()
  const tableId = String(params.tableId).padStart(2, "0")
  const orderId = String(params.orderId)
  const { orders, ready } = useOrders(tableId)
  const order = orders.find((o) => o.id === orderId)

  const slowest = order ? Math.max(...order.child_orders.map((c) => getStall(c.stall_id)?.prepMax ?? 20)) : 20

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF9F2] px-5 py-10">
      <div className="w-full max-w-[430px] text-center md:max-w-[520px]">
        <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#EAF6E5]" aria-hidden="true" />
          <Leaf className="absolute -left-2 top-4 h-8 w-8 -rotate-45 text-[#63B65B]" aria-hidden="true" />
          <Leaf className="absolute -right-2 bottom-6 h-8 w-8 rotate-12 text-[#63B65B]" aria-hidden="true" />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#63B65B] text-white shadow-[0_12px_28px_rgba(99,182,91,0.4)]">
            <Check className="h-12 w-12" strokeWidth={3} aria-hidden="true" />
          </span>
        </div>

        <h1 className="mt-6 text-[28px] font-extrabold leading-9 text-[#26160F] md:text-4xl">Order Placed Successfully!</h1>
        <p className="mx-auto mt-2 max-w-[32ch] text-sm leading-6 text-[#77716D]">
          Your delicious food is being prepared. Enjoy your meal!
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 rounded-[22px] bg-white p-5 text-left shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
          <div>
            <dt className="text-xs text-[#77716D]">Order ID</dt>
            <dd className="mt-0.5 text-[15px] font-bold text-[#26160F]">{ready && order ? `#${order.id.replace("DOSTANA-", "")}` : "…"}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#77716D]">Estimated Time</dt>
            <dd className="mt-0.5 text-[15px] font-bold text-[#26160F]">Up to {slowest} min</dd>
          </div>
          <div>
            <dt className="text-xs text-[#77716D]">Table</dt>
            <dd className="mt-0.5 text-[15px] font-bold text-[#26160F]">{parseInt(tableId, 10)}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#77716D]">Total</dt>
            <dd className="mt-0.5 text-[15px] font-bold text-[#26160F]">{ready && order ? `₹${order.grand_total}` : "…"}</dd>
          </div>
        </dl>

        <div className="mt-6 space-y-3">
          <Link
            href={`/table/${tableId}/orders/${orderId}`}
            className="flex h-[52px] items-center justify-center rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16]"
          >
            View Order Status
          </Link>
          <Link
            href={`/table/${tableId}`}
            className="flex h-[52px] items-center justify-center rounded-full border border-[#F4772B] bg-white text-[15px] font-semibold text-[#E85D16]"
          >
            Continue Ordering
          </Link>
        </div>
      </div>
    </main>
  )
}
