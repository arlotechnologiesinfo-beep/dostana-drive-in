"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Heart, Star } from "lucide-react"
import type { HomeStall } from "@/data/home-demo"
import { useFavoritesStore } from "@/stores/favorites"

export function StallCard({ stall, tableId }: { stall: HomeStall; tableId: string }) {
  const favorite = useFavoritesStore((s) => s.stalls.includes(stall.id))
  const toggleStall = useFavoritesStore((s) => s.toggleStall)

  return (
    <article className="relative w-[232px] shrink-0 snap-start overflow-hidden md:w-full rounded-[20px] bg-white border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
      <Link href={`/table/${tableId}/stall/${stall.id}`} className="block" aria-label={`${stall.name}, rated ${stall.rating}`}>
        <div className="relative h-[136px] w-full bg-[#FFF1E5] md:h-[190px]">
          <Image src={stall.image} alt="" fill sizes="232px" className="object-cover" />
          <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-bold text-[#145A25] shadow-sm">
            <Star className="h-3.5 w-3.5 fill-[#63B65B] text-[#63B65B]" aria-hidden="true" />
            {stall.rating.toFixed(1)}
          </span>
        </div>
        <div className="space-y-1 px-4 pb-4 pt-3">
          <h3 className="truncate text-base font-bold leading-6 text-[#26160F] md:text-lg">{stall.name}</h3>
          <p className="truncate text-xs leading-4 text-[#77716D]">{stall.cuisines.join(" • ")}</p>
          <p className="flex items-center gap-2 pt-1 text-xs leading-4 text-[#302019]">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#77716D]" aria-hidden="true" />
              {stall.prep}
            </span>
            <span className="h-3 w-px bg-[#F1E7DE]" aria-hidden="true" />
            <span>₹{stall.avgForTwo} for two</span>
          </p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggleStall(stall.id)}
        aria-pressed={favorite}
        aria-label={favorite ? `Remove ${stall.name} from favourites` : `Add ${stall.name} to favourites`}
        className="absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
          <Heart
            className={`h-4 w-4 transition-colors ${favorite ? "fill-[#EF493B] text-[#EF493B]" : "text-[#302019]"}`}
            aria-hidden="true"
          />
        </span>
      </button>
    </article>
  )
}

interface PopularStallsProps {
  stalls: HomeStall[]
  tableId: string
}

export function PopularStalls({ stalls, tableId }: PopularStallsProps) {
  if (stalls.length === 0) {
    return (
      <p className="mx-5 rounded-[20px] bg-white p-5 text-sm md:mx-8 lg:mx-10 text-[#77716D] border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
        No stalls match these filters yet. Try another category or reset the filters.
      </p>
    )
  }
  return (
    <ul className="flex snap-x gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-8 lg:grid-cols-3 lg:px-10 [&::-webkit-scrollbar]:hidden">
      {stalls.map((s) => (
        <li key={s.id} className="shrink-0 md:shrink">
          <StallCard stall={s} tableId={tableId} />
        </li>
      ))}
    </ul>
  )
}
