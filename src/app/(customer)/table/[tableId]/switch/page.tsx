"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { MapPin } from "lucide-react"
import { SubPage } from "@/components/customer/SubPage"

export default function TableSwitchPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  return (
    <SubPage tableId={tableId} title="Table Switch" nav={false} backHref={`/table/${tableId}/more`}>
      <section aria-label="Current table" className="flex items-center gap-4 rounded-[24px] bg-white p-5 shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFE7D6]">
          <MapPin className="h-6 w-6 text-[#E85D16]" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm text-[#77716D]">Current Table</span>
          <span className="block text-2xl font-extrabold text-[#26160F]">Table {parseInt(tableId, 10)}</span>
        </span>
        <Link
          href="/select-table"
          className="inline-flex min-h-11 items-center rounded-full border border-[#F4772B] px-5 text-sm font-semibold text-[#E85D16]"
        >
          Change Table
        </Link>
      </section>
      <p className="mt-4 text-sm leading-6 text-[#77716D]">
        Moved to another table? Choose the new table number or scan the QR code on it. Orders you already placed stay with the table they were placed from.
      </p>
    </SubPage>
  )
}
