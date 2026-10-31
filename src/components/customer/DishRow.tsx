"use client"

import Image from "next/image"
import Link from "next/link"
import { IndianRupee, Plus, Star, UtensilsCrossed } from "lucide-react"
import { QtyStepper } from "@/components/customer/QtyStepper"
import type { AddableDish, CatalogItem } from "@/lib/catalog"

interface DishRowProps {
  item: CatalogItem
  tableId: string
  quantity: number
  onAdd: (dish: AddableDish) => void
  onQuantity: (dish: { id: string }, quantity: number) => void
  showStall?: boolean
}

export function DishRow({ item, tableId, quantity, onAdd, onQuantity, showStall = true }: DishRowProps) {
  const href = `/table/${tableId}/dish/${item.id}`
  const needsChoice = Boolean(item.variants && item.variants.length > 0)

  return (
    <article className={`flex items-center gap-3 rounded-[20px] bg-white ${item.available ? "" : "opacity-70"} p-3 border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)] md:gap-4 md:p-4`}>
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-3 md:gap-4" aria-label={`${item.name}, ₹${item.price}`}>
        <span className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#FFF1E5] md:h-24 md:w-24">
          {item.image ? (
            <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
          ) : (
            <UtensilsCrossed className="h-7 w-7 text-[#F4772B]/60" aria-hidden="true" />
          )}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span
              className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] ${item.veg ? "border-[#145A25]" : "border-[#EF493B]"}`}
              role="img"
              aria-label={item.veg ? "Vegetarian" : "Non-vegetarian"}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${item.veg ? "bg-[#145A25]" : "bg-[#EF493B]"}`} />
            </span>
            <span className="truncate text-[15px] font-semibold leading-5 text-[#26160F]">{item.name}</span>
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs leading-4">
            <span className={`rounded-full px-2 py-0.5 font-semibold ${item.veg ? "bg-[#EAF6E5] text-[#145A25]" : "bg-[#FCE8E7] text-[#EF493B]"}`}>{item.veg ? "Veg" : "Non-veg"}</span>
            <span className="text-[#77716D]">Serves {item.serves}</span>
            {showStall && <span className="truncate text-[#77716D]">· {item.stallName}</span>}
          </span>
          <span className="mt-1 flex items-center gap-3 text-xs leading-4">
            <span className="flex items-center gap-1 font-medium text-[#145A25]">
              <Star className="h-3.5 w-3.5 fill-[#63B65B] text-[#63B65B]" aria-hidden="true" />
              {item.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1 text-base font-extrabold leading-5 text-[#26160F]"><IndianRupee className="h-4 w-4 text-[#E85D16]" aria-hidden="true" />
              {item.variants?.length ? "from " : ""}{item.variants?.length ? Math.min(...item.variants.map((v) => v.price)) : item.price}
            </span>
          </span>
        </span>
      </Link>

      {!item.available ? (
        <span className="shrink-0 rounded-full bg-[#FCE8E7] px-3 py-2 text-xs font-semibold text-[#EF493B]">Sold out</span>
      ) : needsChoice ? (
        <Link
          href={href}
          aria-label={`Choose options for ${item.name}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4772B] text-white shadow-[0_4px_12px_rgba(244,119,43,0.08)]">
            <Plus className="h-5 w-5" aria-hidden="true" />
          </span>
        </Link>
      ) : quantity === 0 ? (
        <button type="button" onClick={() => onAdd(item)} aria-label={`Add ${item.name} to cart`} className="flex h-11 w-11 shrink-0 items-center justify-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4772B] text-white shadow-[0_4px_12px_rgba(244,119,43,0.08)] transition-transform active:scale-90">
            <Plus className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      ) : (
        <QtyStepper value={quantity} label={item.name} onChange={(q) => onQuantity(item, q)} />
      )}
    </article>
  )
}
