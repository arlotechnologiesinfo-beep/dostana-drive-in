"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Bell, CheckCircle2, ChefHat, ConciergeBell, Send, XCircle } from "lucide-react"
import { SubPage } from "@/components/customer/SubPage"
import { DEMO_NOTIFICATIONS, useNotificationsStore } from "@/stores/notifications"
import { useMounted } from "@/lib/use-mounted"
import { useNow, useOrderEvents } from "@/lib/use-order-events"
import type { OrderEventKind } from "@/lib/orders-db"

const KIND_STYLE: Record<OrderEventKind, { icon: typeof Bell; tone: string }> = {
  PLACED: { icon: Send, tone: "bg-[#FFE7D6] text-[#E85D16]" },
  ACCEPTED: { icon: ChefHat, tone: "bg-[#FFF1D0] text-[#7A5A10]" },
  READY: { icon: ConciergeBell, tone: "bg-[#EAF6E5] text-[#145A25]" },
  SERVED: { icon: CheckCircle2, tone: "bg-[#EAF6E5] text-[#145A25]" },
  CANCELLED_BY_CUSTOMER: { icon: XCircle, tone: "bg-[#FCE8E7] text-[#B3261E]" },
  CANCELLED_BY_STALL: { icon: XCircle, tone: "bg-[#FCE8E7] text-[#B3261E]" },
}

function ago(iso: string, now: number) {
  const s = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000))
  if (s < 60) return "Just now"
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

export default function NotificationsPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const mounted = useMounted()
  const { events } = useOrderEvents(tableId)
  const readIds = useNotificationsStore((s) => s.readIds)
  const markRead = useNotificationsStore((s) => s.markRead)

  useEffect(() => {
    markRead([...DEMO_NOTIFICATIONS.map((n) => n.id), ...events.map((e) => e.id)])
  }, [events, markRead])

  const now = useNow() ?? 0
  const card = "flex gap-3 rounded-[20px] border border-[#F1E7DE] bg-white p-4 shadow-[0_6px_24px_rgba(48,32,25,0.06)]"

  return (
    <SubPage tableId={tableId} title="Notifications">
      <ul className="space-y-3">
        {events.map((e) => {
          const { icon: Icon, tone } = KIND_STYLE[e.kind]
          const unread = mounted && !readIds.includes(e.id)
          return (
            <li key={e.id}>
              <Link href={`/table/${tableId}/orders/${e.parent_order_id}`} className={`${card} ${unread ? "border-[#F4772B]" : ""}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-[#26160F]">
                    {e.title}
                    {unread && <span className="sr-only"> (new)</span>}
                  </p>
                  <p className="mt-0.5 text-sm text-[#5E5650]">{e.body}</p>
                  <p className="mt-1 text-xs text-[#77716D]">{now ? ago(e.created_at, now) : ""} · View order</p>
                </div>
              </Link>
            </li>
          )
        })}
        {DEMO_NOTIFICATIONS.map((n) => (
          <li key={n.id} className={card}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE7D6] text-[#E85D16]">
              <Bell className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-[#26160F]">{n.title}</p>
              <p className="mt-0.5 text-sm text-[#5E5650]">{n.body}</p>
              <p className="mt-1 text-xs text-[#77716D]">Sample notification</p>
            </div>
          </li>
        ))}
      </ul>
      {events.length === 0 && (
        <p className="mt-6 text-sm text-[#5E5650]">When a stall accepts, cooks or serves your order, you&apos;ll see it here and as a pop-up.</p>
      )}
    </SubPage>
  )
}
