"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, ChevronDown, MapPin, Sparkles, User } from "lucide-react"

interface HomeHeaderProps {
  tableId: string
  tableNumber: number
  greeting: string
  hasUnread: boolean
  onCallWaiter: () => void
}

export function HomeHeader({ tableId, tableNumber, greeting, hasUnread, onCallWaiter }: HomeHeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative px-5 pt-[max(env(safe-area-inset-top),16px)] md:px-8 md:pt-8 lg:px-10">
      <div className="flex items-center justify-between">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-label={`Dining at table ${tableNumber}`}
            className="flex min-h-11 items-center gap-3 text-left"
          >
            <MapPin className="h-6 w-6 shrink-0 fill-[#F4772B] text-[#F4772B]" strokeWidth={1.5} aria-hidden="true" />
            <span className="block">
              <span className="block text-xs font-medium uppercase leading-4 tracking-wide text-[#77716D]">Dine at</span>
              <span className="flex items-center gap-1 text-lg font-bold leading-6 text-[#26160F]">
                Table {tableNumber}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </span>
            </span>
          </button>

          {open && (
            <>
              <button
                type="button"
                aria-label="Close table details"
                className="fixed inset-0 z-30 cursor-default"
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-label="Table details"
                className="absolute left-0 top-full z-40 mt-2 w-64 rounded-2xl bg-white p-4 shadow-[0_12px_32px_rgba(48,32,25,0.08)]"
              >
                <p className="text-sm font-semibold text-[#26160F]">Table {tableNumber}</p>
                <p className="mt-1 text-xs text-[#77716D]">Your table session is active. Orders go to this table.</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onCallWaiter()
                  }}
                  className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#F4772B] text-sm font-semibold text-white transition-colors hover:bg-[#E85D16]"
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  Assistance
                </button>
                <Link href={`/table/${tableId}/switch`} className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#F4772B] text-sm font-semibold text-[#E85D16]">Change table</Link>
                <Link href={`/table/${tableId}/more`} className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#FFF4EA] text-sm font-semibold text-[#26160F]">More options</Link>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/table/${tableId}/notifications`}
            aria-label={hasUnread ? "Notifications, new" : "Notifications"}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(48,32,25,0.08)] transition-transform active:scale-95"
          >
            <Bell className="h-5 w-5 text-[#26160F]" aria-hidden="true" />
            {hasUnread && <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#EF493B]" />}
          </Link>
          <Link
            href={`/table/${tableId}/profile`}
            aria-label="Your profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#FFD9C2] shadow-[0_4px_16px_rgba(48,32,25,0.08)] transition-transform active:scale-95"
          >
            <User className="h-5 w-5 text-[#E85D16]" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#FFE7D6] via-[#FFD9C2] to-[#FFC9A3] p-5 shadow-[0_8px_24px_rgba(244,119,43,0.08)] md:p-8">
        <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-[#F4772B]/15" aria-hidden="true" />
        <p className="relative inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#E85D16] md:text-sm">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {greeting}
        </p>
        <h1 className="relative mt-3 text-[26px] font-extrabold leading-[1.15] text-[#26160F] md:text-[36px] lg:text-[46px]">
          What would you like
          <br />
          to eat <span className="text-[#E85D16]">today?</span>
        </h1>
        <p className="relative mt-2 text-sm text-[#77716D]">Order from six stalls, served at Table {tableNumber}.</p>
      </div>
    </header>
  )
}
