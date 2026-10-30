"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Bell, ChevronRight, ConciergeBell, Grid2x2, Heart, Repeat, Search, Store, Tag, User } from "lucide-react"
import { CallWaiterModal } from "@/components/customer/CallWaiterModal"
import { SubPage } from "@/components/customer/SubPage"

export default function MorePage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const [waiterOpen, setWaiterOpen] = useState(false)
  const base = `/table/${tableId}`

  const rowClass =
    "flex min-h-16 w-full items-center gap-4 rounded-[20px] bg-white px-4 text-left shadow-[0_6px_24px_rgba(48,32,25,0.07)] transition-transform active:scale-[0.99]"
  const iconWrap = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE7D6] text-[#E85D16]"
  const label = "flex-1 text-[15px] font-semibold text-[#26160F]"
  const chevron = <ChevronRight className="h-5 w-5 text-[#A39B95]" aria-hidden="true" />

  const links = [
    { href: `${base}/rewards`, icon: Tag, text: "Offers" },
    { href: `${base}/orders`, icon: ConciergeBell, text: "My Orders" },
    { href: `${base}/favorites`, icon: Heart, text: "Favorites" },
    { href: `${base}/stalls`, icon: Store, text: "Popular Stalls" },
    { href: `${base}/categories`, icon: Grid2x2, text: "Categories" },
    { href: `${base}/search`, icon: Search, text: "Search the full menu" },
    { href: `${base}/switch`, icon: Repeat, text: "Table Switch" },
    { href: `${base}/profile`, icon: User, text: "Profile" },
  ]

  return (
    <SubPage tableId={tableId} title="More">
      <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
        <li>
          <button type="button" onClick={() => setWaiterOpen(true)} className={rowClass}>
            <span className={iconWrap}><Bell className="h-5 w-5" aria-hidden="true" /></span>
            <span className={label}>Call waiter</span>
            {chevron}
          </button>
        </li>
        {links.map(({ href, icon: Icon, text }) => (
          <li key={text}>
            <Link href={href} className={rowClass}>
              <span className={iconWrap}><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <span className={label}>{text}</span>
              {chevron}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs leading-4 text-[#A39B95]">
        Demo menu: stalls, prices, ratings, offers and photos are samples until the restaurant approves its real menu.
      </p>
      <CallWaiterModal tableId={tableId} isOpen={waiterOpen} onClose={() => setWaiterOpen(false)} />
    </SubPage>
  )
}
