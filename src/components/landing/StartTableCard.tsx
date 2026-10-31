"use client"

import { QrCode, Smartphone } from "lucide-react"
import { FloatingFoodFrame } from "@/components/landing/Parallax"
import { QrIllustration } from "@/components/landing/QrIllustration"
import { TableEntryForm } from "@/components/landing/TableEntryForm"

/** "Start ordering at your table": scan the QR or choose a table number and continue. */
export function StartTableCard() {
  return (
    <section id="scan-qr" aria-labelledby="scan-title" className="px-5 py-14 md:px-8 md:py-24">
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[40px] border-2 border-[#FFE0CC] bg-gradient-to-b from-white via-[#FFF9F2] to-[#FFE7D6] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1100 560" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path d="M1100 160C900 120 760 200 700 330" stroke="#F4772B" strokeOpacity="0.14" />
          <path d="M1100 260C920 240 800 320 760 440" stroke="#F4772B" strokeOpacity="0.14" />
          <path d="M1100 360C940 360 840 430 820 540" stroke="#F4772B" strokeOpacity="0.14" />
        </svg>
        <div className="relative grid items-center gap-10 px-6 pt-12 md:grid-cols-[1.1fr_0.9fr] md:gap-4 md:px-14 md:pt-0">
          <div className="md:py-16">
            <h2 id="scan-title" className="text-[32px] font-extrabold leading-[1.1] text-[#26160F] md:text-[46px]">
              Start ordering at your table!
            </h2>
            <p className="mt-3 max-w-[34ch] text-base leading-7 text-[#77716D] md:text-lg">
              Scan the QR on your table, or choose your table number. One cart for all six stalls. No app to download.
            </p>
            <div className="mt-7 max-w-[520px] rounded-3xl border border-[#F1E7DE] bg-white p-4 shadow-[0_6px_24px_rgba(48,32,25,0.06)] md:p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#26160F]">
                <Smartphone className="h-4 w-4 text-[#F4772B]" aria-hidden="true" />
                Select your table number
              </p>
              <TableEntryForm id="scan-table" buttonLabel="Continue" />
            </div>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm font-medium text-[#26160F]">
              {["Scan the QR", "Pick from six stalls", "Pay once, track each dish"].map((t, i) => (
                <li key={t} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_2px_8px_rgba(48,32,25,0.06)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F4772B] text-xs font-bold text-white">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <FloatingFoodFrame>
            <div className="relative mx-auto h-[360px] w-[250px] overflow-hidden rounded-t-[44px] border-[8px] border-b-0 border-[#26160F] bg-white md:h-[430px] md:w-[300px]">
              <span className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-[#26160F]" aria-hidden="true" />
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 pb-6 pt-8 text-center">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E85D16]">
                  <QrCode className="h-4 w-4" aria-hidden="true" /> Table 12
                </p>
                <p className="text-[15px] font-medium leading-5 text-[#302019]">Scan the QR code on your table to order</p>
                <div className="rounded-2xl border border-[#F1E7DE] bg-white p-3">
                  <QrIllustration className="h-auto w-[150px] md:w-[170px]" />
                </div>
                <p className="text-[11px] text-[#A39B95]">Sample graphic. Every table has its own QR.</p>
              </div>
            </div>
          </FloatingFoodFrame>
        </div>
      </div>
    </section>
  )
}
