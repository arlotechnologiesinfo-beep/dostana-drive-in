"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Check, ChevronRight, Copy, Crown } from "lucide-react"
import { SubPage } from "@/components/customer/SubPage"
import { HOME_CATEGORIES, HOME_OFFERS } from "@/data/home-demo"

export default function OffersPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const [filter, setFilter] = useState<string>("all")
  const [copied, setCopied] = useState<string | null>(null)

  const offers = HOME_OFFERS.filter((o) => filter === "all" || o.categoryId === filter)

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      /* clipboard blocked: the code stays visible to read out */
    }
    setCopied(code)
    window.setTimeout(() => setCopied(null), 1800)
  }

  return (
    <SubPage tableId={tableId} title="Offers">
      <section aria-label="Join Gold" className="mb-5 flex items-center gap-4 rounded-[22px] bg-[#FFE7D6] p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4772B]">
          <Crown className="h-6 w-6 text-white" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold text-[#26160F]">Join Gold</span>
          <span className="block text-sm text-[#77716D]">Exclusive dining benefits. Coming soon.</span>
        </span>
        <ChevronRight className="h-5 w-5 text-[#E85D16]" aria-hidden="true" />
      </section>

      <div role="group" aria-label="Offer categories" className="mb-5 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[{ id: "all", label: "All" }, ...HOME_CATEGORIES.filter((c) => HOME_OFFERS.some((o) => o.categoryId === c.id))].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition-colors ${
              filter === c.id ? "bg-[#F4772B] text-white" : "bg-white text-[#302019] shadow-[0_2px_8px_rgba(48,32,25,0.06)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {offers.length === 0 ? (
        <p className="rounded-[22px] bg-white p-6 text-center text-sm text-[#77716D]">No offers in this category right now.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
          {offers.map((o) => (
            <li key={o.id} className="relative flex h-[136px] items-center overflow-hidden rounded-[22px] p-5" style={{ backgroundColor: o.bg, color: o.fg }}>
              <span className="relative z-10 block">
                <span className="block text-2xl font-extrabold leading-7">{o.headline}</span>
                <span className="block text-sm opacity-90">{o.detail}</span>
                <button
                  type="button"
                  onClick={() => copy(o.code)}
                  aria-label={`Copy code ${o.code}`}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-current px-4 text-xs font-bold tracking-wide"
                >
                  {copied === o.code ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  {copied === o.code ? "Copied" : o.code}
                </button>
              </span>
              <span className="absolute -right-8 top-1/2 h-[150px] w-[150px] -translate-y-1/2 overflow-hidden rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
                <Image src={o.image} alt="" fill sizes="150px" className="object-cover" />
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-xs leading-4 text-[#A39B95]">Demo offers: codes are samples and are not applied at checkout yet.</p>
    </SubPage>
  )
}
