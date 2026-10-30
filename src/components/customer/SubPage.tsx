"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BottomNav } from "@/components/customer/BottomNav"

interface SubPageProps {
  tableId: string
  title: string
  children: React.ReactNode
  /** show the floating bottom navigation (default true) */
  nav?: boolean
  backHref?: string
  right?: React.ReactNode
}

/** Shared shell for customer screens: centred title, back link, responsive width and optional bottom navigation. */
export function SubPage({ tableId, title, children, nav = true, backHref, right }: SubPageProps) {
  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      <main
        className={`mx-auto w-full max-w-[430px] px-5 pt-[max(env(safe-area-inset-top),16px)] md:max-w-[720px] md:px-8 md:pt-8 lg:max-w-[960px] ${
          nav ? "pb-[152px]" : "pb-[120px]"
        }`}
      >
        <header className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:mb-8">
          <Link
            href={backHref ?? `/table/${tableId}`}
            aria-label="Back"
            className="flex h-11 w-11 items-center justify-center justify-self-start rounded-full bg-white shadow-[0_4px_16px_rgba(48,32,25,0.08)]"
          >
            <ArrowLeft className="h-5 w-5 text-[#26160F]" aria-hidden="true" />
          </Link>
          <h1 className="max-w-[56vw] truncate text-center text-lg font-bold leading-7 text-[#26160F] md:text-2xl">{title}</h1>
          <div className="flex justify-end whitespace-nowrap">{right}</div>
        </header>
        {children}
      </main>
      {nav && <BottomNav tableId={tableId} />}
    </div>
  )
}
