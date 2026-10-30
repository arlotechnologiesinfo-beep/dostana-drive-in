"use client"

import Link from "next/link"
import { QrCode } from "lucide-react"
import { TableEntryForm } from "@/components/landing/TableEntryForm"
import { useMounted } from "@/lib/use-mounted"
import { useRecentTablesStore } from "@/stores/recent-tables"

export default function SelectTablePage() {
  const mounted = useMounted()
  const recent = useRecentTablesStore((s) => s.tables)
  const tables = mounted ? recent : []

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF9F2] px-5 py-10">
      <div className="w-full max-w-[430px] md:max-w-[480px]">
        <h1 className="text-[28px] font-extrabold leading-9 text-[#26160F]">Select Your Table</h1>
        <p className="mt-1 text-sm text-[#77716D]">Enter or scan your table QR to start ordering.</p>

        <div className="mt-6 rounded-[24px] bg-white p-5 shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
          <TableEntryForm id="select-table" buttonLabel="Continue" />
        </div>

        <p className="my-5 text-center text-sm text-[#A39B95]">or</p>

        <section aria-label="Scan QR code" className="flex flex-col items-center gap-2 rounded-[24px] border-2 border-dashed border-[#F4A97A] bg-[#FFF4EA] px-6 py-8 text-center">
          <QrCode className="h-14 w-14 text-[#F4772B]" aria-hidden="true" />
          <h2 className="text-base font-bold text-[#26160F]">Scan QR Code</h2>
          <p className="max-w-[30ch] text-sm text-[#77716D]">Open your phone camera and point it at the QR code on your table.</p>
        </section>

        {tables.length > 0 && (
          <section aria-label="Recent tables" className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-[#77716D]">Recent Tables</h2>
            <ul className="flex flex-wrap gap-2">
              {tables.map((t) => (
                <li key={t}>
                  <Link href={`/table/${t}`} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[#F1E7DE] bg-white px-4 text-sm font-semibold text-[#26160F] hover:border-[#F4772B]">
                    {parseInt(t, 10)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}
