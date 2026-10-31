"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Bell, ChevronRight, ConciergeBell, LifeBuoy, Grid2x2, Heart, MapPin, Pencil, Repeat, Search, Store, Tag, User } from "lucide-react"
import { CallWaiterModal } from "@/components/customer/CallWaiterModal"
import { SubPage } from "@/components/customer/SubPage"
import { useMounted } from "@/lib/use-mounted"
import { useProfileStore } from "@/stores/profile"

export default function MorePage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const mounted = useMounted()
  const name = useProfileStore((s) => s.name)
  const [waiterOpen, setWaiterOpen] = useState(false)
  const base = `/table/${tableId}`
  const shown = mounted ? name.trim() : ""

  const features = [
    { icon: Bell, text: "Call waiter", hint: "Water, bill, help", tone: "bg-[#FFE7D6] text-[#E85D16]", onClick: () => setWaiterOpen(true) },
    { href: `${base}/help`, icon: LifeBuoy, text: "Help and FAQs", hint: "Chat, cancel, refunds", tone: "bg-[#FFE7D6] text-[#E85D16]" },
    { href: `${base}/orders`, icon: ConciergeBell, text: "My Orders", hint: "Track every stall", tone: "bg-[#EAF6E5] text-[#145A25]" },
    { href: `${base}/rewards`, icon: Tag, text: "Offers", hint: "Deals and codes", tone: "bg-[#FCE8E7] text-[#EF493B]" },
    { href: `${base}/favorites`, icon: Heart, text: "Favorites", hint: "Saved items", tone: "bg-[#FCE8E7] text-[#EF493B]" },
    { href: `${base}/stalls`, icon: Store, text: "Popular Stalls", hint: "All six kitchens", tone: "bg-[#FFE7D6] text-[#E85D16]" },
    { href: `${base}/categories`, icon: Grid2x2, text: "Categories", hint: "Browse by cuisine", tone: "bg-[#EAF6E5] text-[#145A25]" },
    { href: `${base}/search`, icon: Search, text: "Search menu", hint: "Find any dish", tone: "bg-[#FFE7D6] text-[#E85D16]" },
    { href: `${base}/switch`, icon: Repeat, text: "Table Switch", hint: "Change your table", tone: "bg-[#EAF6E5] text-[#145A25]" },
  ]

  const tile =
    "group flex h-full min-h-[112px] flex-col justify-between rounded-[22px] bg-white p-4 text-left border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)] transition-transform active:scale-[0.98]"

  return (
    <SubPage tableId={tableId} title="More">
      <section aria-label="Your profile" className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#F4772B] via-[#F68A45] to-[#FFB84D] p-5 text-white shadow-[0_14px_32px_rgba(244,119,43,0.08)] md:p-8">
        <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-12 left-24 h-28 w-28 rounded-full bg-[#E85D16]/30" aria-hidden="true" />
        <div className="relative flex items-center gap-4">
          <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border-4 border-white/90 bg-white text-3xl font-extrabold text-[#E85D16] shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
            {shown ? shown.charAt(0).toUpperCase() : <User className="h-9 w-9" aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-extrabold leading-7">{shown || "Guest diner"}</p>
            <p className="mt-0.5 inline-flex items-center gap-2 rounded-full bg-white/25 px-3 py-1 text-xs font-semibold">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Table {parseInt(tableId, 10)}
            </p>
          </div>
        </div>
        <Link
          href={`${base}/profile`}
          className="relative mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#E85D16] shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Edit profile
        </Link>
      </section>

      <h2 className="mb-3 mt-6 text-lg font-extrabold text-[#26160F]">Features</h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {features.map((f) => {
          const Icon = f.icon
          const inner = (
            <>
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${f.tone}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="flex items-center justify-between gap-1 text-[15px] font-bold text-[#26160F]">
                  {f.text}
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#A39B95] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
                <span className="block text-xs leading-4 text-[#77716D]">{f.hint}</span>
              </span>
            </>
          )
          return (
            <li key={f.text}>
              {f.href ? (
                <Link href={f.href} className={tile}>{inner}</Link>
              ) : (
                <button type="button" onClick={f.onClick} className={`${tile} w-full`}>{inner}</button>
              )}
            </li>
          )
        })}
      </ul>

      <p className="mt-6 text-xs leading-4 text-[#A39B95]">
        Demo menu: stalls, prices, ratings, offers and photos are samples until the restaurant approves its real menu.
      </p>
      <CallWaiterModal tableId={tableId} isOpen={waiterOpen} onClose={() => setWaiterOpen(false)} />
    </SubPage>
  )
}
