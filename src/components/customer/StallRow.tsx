"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock, Heart, Star } from "lucide-react"
import type { HomeStall } from "@/data/home-demo"
import { useFavoritesStore } from "@/stores/favorites"

export function StallRow({ stall, tableId }: { stall: HomeStall; tableId: string }) {
  const favorite = useFavoritesStore((s) => s.stalls.includes(stall.id))
  const toggleStall = useFavoritesStore((s) => s.toggleStall)

  return (
    <article className="relative flex items-center gap-3 rounded-[20px] bg-white p-3 shadow-[0_6px_24px_rgba(48,32,25,0.07)] md:gap-5 md:p-4">
      <Link href={`/table/${tableId}/stall/${stall.id}`} className="flex min-w-0 flex-1 items-center gap-3 md:gap-5" aria-label={`${stall.name}, rated ${stall.rating}`}>
        <span className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-2xl bg-[#FFF1E5] md:h-[120px] md:w-[120px]">
          <Image src={stall.image} alt="" fill sizes="120px" className="object-cover" />
        </span>
        <span className="min-w-0 space-y-1">
          <span className="block truncate text-base font-bold leading-6 text-[#26160F] md:text-lg">{stall.name}</span>
          <span className="block truncate text-xs leading-4 text-[#77716D] md:text-sm">{stall.cuisines.join(" • ")}</span>
          <span className="flex items-center gap-1 text-xs font-medium text-[#145A25] md:text-sm">
            <Star className="h-3.5 w-3.5 fill-[#63B65B] text-[#63B65B]" aria-hidden="true" />
            {stall.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-2 text-xs leading-4 text-[#302019] md:text-sm">
            <Clock className="h-3.5 w-3.5 text-[#77716D]" aria-hidden="true" />
            {stall.prep}
            <span className="h-3 w-px bg-[#F1E7DE]" aria-hidden="true" />
            ₹{stall.avgForTwo} for two
          </span>
        </span>
      </Link>
      <button
        type="button"
        onClick={() => toggleStall(stall.id)}
        aria-pressed={favorite}
        aria-label={favorite ? `Remove ${stall.name} from favourites` : `Add ${stall.name} to favourites`}
        className="flex h-11 w-11 shrink-0 items-center justify-center self-start"
      >
        <Heart className={`h-5 w-5 ${favorite ? "fill-[#EF493B] text-[#EF493B]" : "text-[#77716D]"}`} aria-hidden="true" />
      </button>
    </article>
  )
}
