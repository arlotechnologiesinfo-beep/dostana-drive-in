"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, ChevronDown, ChevronRight, Crown, MapPin, User } from "lucide-react"

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
            className="flex min-h-11 items-center gap-2.5 text-left"
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
                className="absolute left-0 top-full z-40 mt-2 w-64 rounded-2xl bg-white p-4 shadow-[0_12px_32px_rgba(48,32,25,0.14)]"
              >
                <p className="text-sm font-semibold text-[#26160F]">Table {tableNumber}</p>
                <p className="mt-0.5 text-xs text-[#77716D]">Your table session is active. Orders go to this table.</p>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onCallWaiter()
                  }}
                  className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#F4772B] text-sm font-semibold text-white transition-colors hover:bg-[#E85D16]"
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  Call waiter
                </button>
                <p className="mt-3 text-xs text-[#A39B95]">Wrong table? Scan the QR code on your table or ask a waiter.</p>
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
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-[#FFD9C2] shadow-[0_4px_16px_rgba(48,32,25,0.12)] transition-transform active:scale-95"
          >
            <User className="h-5 w-5 text-[#E85D16]" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-6 text-[#E85D16] md:text-lg">{greeting},</p>
          <h1 className="text-[clamp(18px,4.9vw,26px)] font-extrabold leading-[1.25] text-[#26160F] md:text-[36px] md:leading-[1.2] lg:text-[46px]">
            What would you like
            <br />
            to eat today? <span aria-hidden="true">😊</span>
          </h1>
        </div>

        <Link
          href={`/table/${tableId}/rewards`}
          className="group flex w-[116px] shrink-0 flex-col gap-1.5 rounded-[18px] bg-[#FFE7D6] p-3 md:w-[240px] md:gap-2 md:rounded-[22px] md:p-5 transition-transform active:scale-[0.98]"
        >
          <span className="flex items-center justify-between">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4772B]">
              <Crown className="h-4 w-4 text-white" aria-hidden="true" />
            </span>
            <ChevronRight className="h-4 w-4 text-[#E85D16] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold leading-4 text-[#26160F] md:text-lg md:leading-6">Join Gold</span>
          <span className="text-xs leading-4 text-[#77716D] md:text-sm md:leading-5">Exclusive dining benefits</span>
        </Link>
      </div>
    </header>
  )
}
