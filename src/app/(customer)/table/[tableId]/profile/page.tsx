"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronRight, Crown, Heart, MapPin, ShoppingBag } from "lucide-react"
import { SubPage } from "@/components/customer/SubPage"
import { useMounted } from "@/lib/use-mounted"
import { useCartStore } from "@/stores/cart"
import { useFavoritesStore } from "@/stores/favorites"
import { useProfileStore } from "@/stores/profile"

export default function ProfilePage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const mounted = useMounted()
  const name = useProfileStore((s) => s.name)
  const setName = useProfileStore((s) => s.setName)
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const favStalls = useFavoritesStore((s) => s.stalls.length)
  const favDishes = useFavoritesStore((s) => s.dishes.length)

  const shownName = mounted ? name : ""
  const initial = shownName.trim().charAt(0).toUpperCase()

  const rows = [
    { icon: MapPin, label: "Dining at", value: `Table ${parseInt(tableId, 10)}`, href: `/table/${tableId}/switch` },
    { icon: ShoppingBag, label: "Items in your cart", value: String(mounted ? cartCount : 0), href: `/table/${tableId}/cart` },
    { icon: Heart, label: "Favorites", value: `${mounted ? favStalls : 0} stalls, ${mounted ? favDishes : 0} dishes`, href: `/table/${tableId}/favorites` },
  ]

  return (
    <SubPage tableId={tableId} title="Profile">
      <div className="md:grid md:grid-cols-2 md:gap-6">
        <section aria-label="Your details" className="flex flex-col items-center gap-3 rounded-[24px] bg-white p-6 shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-[#FFD9C2] text-3xl font-bold text-[#E85D16] shadow-[0_4px_16px_rgba(48,32,25,0.12)]">
            {initial || "D"}
          </span>
          <div className="w-full">
            <label htmlFor="profile-name" className="mb-1 block text-sm font-semibold text-[#26160F]">Your name</label>
            <input
              id="profile-name"
              type="text"
              maxLength={40}
              autoComplete="given-name"
              value={shownName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add your name"
              className="h-12 w-full rounded-2xl border border-[#F1E7DE] bg-[#FFF9F2] px-4 text-sm outline-none placeholder:text-[#A39B95] focus:border-[#F4772B]"
            />
            <p className="mt-1 text-xs text-[#A39B95]">Saved on this phone only. Sign-in comes later.</p>
          </div>
        </section>

        <div className="mt-4 space-y-3 md:mt-0">
          <Link href={`/table/${tableId}/rewards`} className="flex items-center gap-4 rounded-[22px] bg-[#FFE7D6] p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4772B]">
              <Crown className="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold text-[#26160F]">Join Gold</span>
              <span className="block text-sm text-[#77716D]">Exclusive dining benefits</span>
            </span>
            <ChevronRight className="h-5 w-5 text-[#E85D16]" aria-hidden="true" />
          </Link>
          <ul className="space-y-3">
            {rows.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <Link href={href} className="flex min-h-16 items-center gap-4 rounded-[20px] bg-white px-4 shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFE7D6] text-[#E85D16]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-sm text-[#77716D]">{label}</span>
                  <span className="text-[15px] font-semibold text-[#26160F]">{value}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SubPage>
  )
}
