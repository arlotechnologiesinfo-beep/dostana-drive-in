"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { Bell } from "lucide-react"
import { SubPage } from "@/components/customer/SubPage"
import { DEMO_NOTIFICATIONS, useNotificationsStore } from "@/stores/notifications"
import { useMounted } from "@/lib/use-mounted"

export default function NotificationsPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const mounted = useMounted()
  const readIds = useNotificationsStore((s) => s.readIds)
  const markAllRead = useNotificationsStore((s) => s.markAllRead)

  useEffect(() => {
    markAllRead()
  }, [markAllRead])

  return (
    <SubPage tableId={tableId} title="Notifications">
      <ul className="space-y-3">
        {DEMO_NOTIFICATIONS.map((n) => {
          const unread = mounted && !readIds.includes(n.id)
          return (
            <li key={n.id} className="flex gap-3 rounded-[20px] bg-white p-4 shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE7D6] text-[#E85D16]">
                <Bell className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-[#26160F]">
                  {n.title}
                  {unread && <span className="sr-only"> (new)</span>}
                </p>
                <p className="mt-0.5 text-sm text-[#77716D]">{n.body}</p>
                {n.demo && <p className="mt-1 text-xs text-[#A39B95]">Sample notification</p>}
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-6 text-sm text-[#77716D]">Order updates from each stall will appear here as they happen.</p>
    </SubPage>
  )
}
