import Link from "next/link"
import { ArrowRight, ChevronDown, QrCode } from "lucide-react"
import { CtaDishes } from "@/components/landing/CtaDishes"

const FAQS = [
  { q: "How do I order at Dostana Drive In?", a: "Scan the QR code on your table or choose your table number. Browse all six stalls, add dishes to one cart, and place a single order." },
  { q: "Can I order from more than one stall at once?", a: "Yes. Your cart holds dishes from every stall. We split the order so each stall gets only its own items, and you track each one separately." },
  { q: "How do I pay?", a: "Choose UPI or pay at the table when you place your order. One bill covers all stalls." },
  { q: "Do I need to download an app?", a: "No. Everything works in your phone's browser once you scan the QR code on your table." },
  { q: "What if I need help or want to call a waiter?", a: "Tap your table number at the top of the home screen and choose Assistance. A waiter is notified straight away." },
  { q: "Can I change my table?", a: "Yes. Open More, then Table Switch, or tap your table number and choose Change table." },
  { q: "Does Dostana Gold exist yet?", a: "Gold is coming soon. The benefits shown on this page are plans, not live offers." },
]

export function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-[860px] px-5 py-14 md:px-8 md:py-20">
      <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#E85D16]">Questions</p>
      <h2 id="faq-title" className="mt-2 text-center text-[30px] font-extrabold leading-9 text-[#26160F] md:text-[44px] md:leading-[1.15]">
        Frequently asked questions
      </h2>
      <div className="mt-8 space-y-3 md:mt-12">
        {FAQS.map((f) => (
          <details key={f.q} className="group rounded-3xl border border-[#F1E7DE] bg-white shadow-[0_2px_8px_rgba(48,32,25,0.04)] open:border-[#F4B58A] open:bg-[#FFF9F2]">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 text-base font-semibold text-[#26160F] md:px-7 md:text-lg [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFE7D6] text-[#E85D16]">
                <ChevronDown className="h-5 w-5 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
              </span>
            </summary>
            <p className="px-5 pb-5 text-[15px] leading-7 text-[#77716D] md:px-7">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="px-5 pb-16 md:px-8 md:pb-24">
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[36px] bg-gradient-to-br from-[#26160F] via-[#3B2214] to-[#5A3318] px-5 pb-12 pt-12 text-center md:px-16 md:pb-20 md:pt-20">
        <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#F4772B]/25" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[#F5B544]/20" aria-hidden="true" />
        <div className="relative">
          <h2 id="cta-title" className="mx-auto max-w-[18ch] text-[32px] font-extrabold leading-[1.1] text-white md:text-[52px]">
            Hungry? Your table is ready.
          </h2>
          <p className="mx-auto mt-4 max-w-[40ch] text-base leading-7 text-white/80 md:text-lg">
            Six stalls, one cart, one bill. Scan the QR on your table or pick your table number to begin.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="#scan-qr" className="inline-flex h-14 items-center gap-2 rounded-full bg-[#F4772B] px-8 text-base font-semibold text-white transition-colors hover:bg-[#E85D16]">
              <QrCode className="h-5 w-5" aria-hidden="true" />
              Scan or select table
            </Link>
            <Link href="#stalls" className="inline-flex h-14 items-center gap-2 rounded-full border border-white/30 px-8 text-base font-semibold text-white transition-colors hover:bg-white/10">
              Explore stalls
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
          <CtaDishes />
        </div>
      </div>
    </section>
  )
}
