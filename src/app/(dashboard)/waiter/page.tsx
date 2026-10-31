"use client"

import { useEffect, useState } from "react"
import { Bell, Check, ConciergeBell } from "lucide-react"
import { useNewItemAlert } from "@/components/dashboard/StaffA11y"
import { AdminLayout } from "@/components/dashboard/AdminLayout"
import {
  getWaiterRequests,
  updateChildOrderStatus,
  updateWaiterRequestStatus,
  type ParentOrder,
  type WaiterRequest,
} from "@/lib/orders-db"

type Tab = "all" | "serve" | "requests"

const REQUEST_LABEL: Record<WaiterRequest["request_type"], string> = {
  CALL_WAITER: "Call waiter",
  NEED_WATER: "Needs water",
  NEED_BILL: "Needs the bill",
  EXTRA_PLATES: "Extra plates",
  NEED_ASSISTANCE: "Needs assistance",
  NEED_CLEANING: "Needs cleaning",
}

interface ServeTask {
  key: string
  table: string
  stall: string
  items: string
  parentId: string
  childId: string
  at: string
}

function readOrders(): ParentOrder[] {
  try {
    return JSON.parse(localStorage.getItem("dostana_orders") ?? "[]")
  } catch {
    return []
  }
}

const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })

/** Service desk. Pattern 10, Inbox (variant A): time-ordered work for waiters. */
export default function WaiterPage() {
  const [tab, setTab] = useState<Tab>("all")
  const [orders, setOrders] = useState<ParentOrder[]>([])
  const [requests, setRequests] = useState<WaiterRequest[]>([])

  useEffect(() => {
    const load = () => {
      setOrders(readOrders())
      setRequests(getWaiterRequests())
    }
    load()
    const t = window.setInterval(load, 3000)
    return () => window.clearInterval(t)
  }, [])

  const serve: ServeTask[] = orders
    .flatMap((o) =>
      o.child_orders
        .filter((c) => c.status === "READY")
        .map((c) => ({
          key: c.id,
          table: o.table_id,
          stall: c.stall_name,
          items: c.items.map((i) => `${i.quantity} × ${i.name}`).join(", "),
          parentId: o.id,
          childId: c.id,
          at: c.updated_at,
        }))
    )
    .sort((a, b) => a.at.localeCompare(b.at))

  const open = requests.filter((r) => r.status !== "RESOLVED").sort((a, b) => a.created_at.localeCompare(b.created_at))

  useNewItemAlert(
    [
      ...serve.map((t) => ({ id: t.key, label: `Table ${parseInt(t.table, 10)} order ready to serve` })),
      ...open.filter((r) => r.status === "PENDING").map((r) => ({ id: r.id, label: `Table ${parseInt(r.table_id, 10)}: ${REQUEST_LABEL[r.request_type]}` })),
    ],
    true
  )

  const markServed = (t: ServeTask) => {
    updateChildOrderStatus(t.parentId, t.childId, "DELIVERED")
    setOrders(readOrders())
  }
  const setRequest = (id: string, status: WaiterRequest["status"]) => {
    updateWaiterRequestStatus(id, status)
    setRequests(getWaiterRequests())
  }

  const btn = "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors"

  return (
    <AdminLayout title="Service desk" subtitle="Dishes ready to serve and requests from tables">
      <div className="mx-auto w-full max-w-[960px] px-4 py-5 lg:px-8">
        <div role="tablist" aria-label="Filter tasks" className="mb-5 flex gap-2 overflow-x-auto">
          {([
            ["all", `All (${serve.length + open.length})`],
            ["serve", `Serve (${serve.length})`],
            ["requests", `Requests (${open.length})`],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold ${tab === id ? "bg-[#F4772B] text-white" : "bg-white text-[#302019] shadow-[0_2px_8px_rgba(48,32,25,0.06)]"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <ul className="space-y-3">
          {(tab === "all" || tab === "serve") &&
            serve.map((t) => (
              <li key={t.key} className="flex flex-wrap items-center gap-4 rounded-[20px] bg-white p-4 shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF6E5] text-[#145A25]">
                  <ConciergeBell className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 basis-48">
                  <span className="block text-lg font-bold text-[#26160F]">Table {parseInt(t.table, 10)} · Ready to serve</span>
                  <span className="block truncate text-sm text-[#77716D]">{t.stall}: {t.items}</span>
                  <span className="block text-xs text-[#A39B95]">Ready at {time(t.at)}</span>
                </span>
                <button onClick={() => markServed(t)} className={`${btn} bg-[#F4772B] text-white hover:bg-[#E85D16]`}>
                  <Check className="h-5 w-5" aria-hidden="true" /> Mark served
                </button>
              </li>
            ))}

          {(tab === "all" || tab === "requests") &&
            open.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-4 rounded-[20px] bg-white p-4 shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFE7D6] text-[#E85D16]">
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 basis-48">
                  <span className="block text-lg font-bold text-[#26160F]">Table {parseInt(r.table_id, 10)} · {REQUEST_LABEL[r.request_type]}</span>
                  <span className="block text-xs text-[#A39B95]">
                    {r.status === "PENDING" ? "New" : "Acknowledged"} at {time(r.created_at)}
                  </span>
                </span>
                {r.status === "PENDING" && (
                  <button onClick={() => setRequest(r.id, "ACKNOWLEDGED")} className={`${btn} border border-[#F4772B] text-[#E85D16]`}>
                    Acknowledge
                  </button>
                )}
                <button onClick={() => setRequest(r.id, "RESOLVED")} className={`${btn} bg-[#F4772B] text-white hover:bg-[#E85D16]`}>
                  Done
                </button>
              </li>
            ))}
        </ul>

        {((tab === "all" && serve.length + open.length === 0) ||
          (tab === "serve" && serve.length === 0) ||
          (tab === "requests" && open.length === 0)) && (
          <p className="rounded-[20px] bg-white px-6 py-12 text-center text-sm text-[#77716D] shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
            All caught up. New dishes and table requests show up here as they happen.
          </p>
        )}
      </div>
    </AdminLayout>
  )
}
