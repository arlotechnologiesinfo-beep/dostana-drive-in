"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Heart, Star, UtensilsCrossed } from "lucide-react"
import { QtyStepper } from "@/components/customer/QtyStepper"
import { useCatalog } from "@/lib/use-catalog"
import { useCartStore } from "@/stores/cart"
import { useFavoritesStore } from "@/stores/favorites"

export default function DishDetailPage() {
  const params = useParams()
  const router = useRouter()
  const tableId = String(params.tableId).padStart(2, "0")
  const dishId = String(params.dishId)
  const item = useCatalog().find((i) => i.id === dishId)

  const addItem = useCartStore((s) => s.addItem)
  const favorite = useFavoritesStore((s) => s.dishes.includes(dishId))
  const toggleDish = useFavoritesStore((s) => s.toggleDish)

  const [quantity, setQuantity] = useState(1)
  const [variantName, setVariantName] = useState<string | null>(item?.variants?.[0]?.name ?? null)
  const [note, setNote] = useState("")

  if (!item) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F2] p-6 text-center">
        <div>
          <h1 className="text-xl font-bold text-[#26160F]">We couldn&apos;t find that dish</h1>
          <Link href={`/table/${tableId}`} className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#F4772B] px-6 text-sm font-semibold text-white">
            Back to home
          </Link>
        </div>
      </main>
    )
  }

  const variant = item.variants?.find((v) => v.name === variantName)
  const unitPrice = variant?.price ?? item.price
  const total = unitPrice * quantity

  const handleAdd = () => {
    addItem({
      stall_id: item.stallId,
      stall_name: item.stallName,
      menu_item_id: item.id,
      variant_name: variant?.name,
      name: item.name,
      price: unitPrice,
      quantity,
      special_instructions: note.trim() || undefined,
      image: item.image ?? "",
    })
    router.push(`/table/${tableId}/stall/${item.stallId}`)
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      <div className="mx-auto w-full max-w-[430px] md:max-w-[820px] lg:grid lg:max-w-[1100px] lg:grid-cols-2 lg:gap-10 lg:pt-8">
        <div className="relative h-[300px] w-full overflow-hidden bg-[#FFF1E5] md:h-[420px] lg:h-[560px] lg:rounded-[32px]">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill priority sizes="(max-width: 1100px) 100vw, 550px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center">
              <UtensilsCrossed className="h-14 w-14 text-[#F4772B]/50" aria-hidden="true" />
            </span>
          )}
          <Link
            href={`/table/${tableId}/stall/${item.stallId}`}
            aria-label="Back to menu"
            className="absolute left-4 top-[max(env(safe-area-inset-top),16px)] flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md md:left-6 md:top-6"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => toggleDish(dishId)}
            aria-pressed={favorite}
            aria-label={favorite ? `Remove ${item.name} from favourites` : `Add ${item.name} to favourites`}
            className="absolute right-4 top-[max(env(safe-area-inset-top),16px)] flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md md:right-6 md:top-6"
          >
            <Heart className={`h-5 w-5 ${favorite ? "fill-[#EF493B] text-[#EF493B]" : ""}`} aria-hidden="true" />
          </button>
        </div>

        <main className="relative -mt-6 rounded-t-[28px] bg-[#FFF9F2] px-5 pb-[140px] pt-6 md:px-8 lg:mt-0 lg:rounded-none lg:px-0 lg:pb-16">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold leading-8 text-[#26160F] md:text-3xl">{item.name}</h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-[#77716D]">
                <span className="flex items-center gap-1 font-semibold text-[#145A25]">
                  <Star className="h-4 w-4 fill-[#63B65B] text-[#63B65B]" aria-hidden="true" />
                  {item.rating.toFixed(1)}
                </span>
                <span>{item.stallName}</span>
              </p>
            </div>
            <p className="shrink-0 text-2xl font-extrabold text-[#26160F]">₹{unitPrice}</p>
          </div>

          {item.description && <p className="mt-3 text-sm leading-6 text-[#77716D]">{item.description}</p>}
          <p className="mt-1 text-xs text-[#A39B95]">{item.veg ? "Vegetarian" : "Non-vegetarian"} · demo rating</p>

          {item.variants && item.variants.length > 0 && (
            <fieldset className="mt-6">
              <legend className="mb-2 text-base font-bold text-[#26160F]">Customize</legend>
              <div className="space-y-2">
                {item.variants.map((v) => (
                  <label
                    key={v.name}
                    className={`flex min-h-12 cursor-pointer items-center justify-between rounded-2xl border px-4 text-sm transition-colors ${
                      variantName === v.name ? "border-[#F4772B] bg-[#FFE7D6]" : "border-[#F1E7DE] bg-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="variant"
                        value={v.name}
                        checked={variantName === v.name}
                        onChange={() => setVariantName(v.name)}
                        className="h-4 w-4 accent-[#F4772B]"
                      />
                      <span className="font-medium text-[#26160F]">{v.name}</span>
                    </span>
                    <span className="font-semibold text-[#26160F]">₹{v.price}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6">
            <label htmlFor="dish-note" className="mb-2 block text-base font-bold text-[#26160F]">
              Note for the kitchen <span className="text-sm font-normal text-[#77716D]">(optional)</span>
            </label>
            <textarea
              id="dish-note"
              rows={2}
              maxLength={140}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="For example: less spicy"
              className="w-full resize-none rounded-2xl border border-[#F1E7DE] bg-white p-3 text-sm text-[#302019] outline-none placeholder:text-[#A39B95] focus:border-[#F4772B]"
            />
          </div>

          <div className="fixed inset-x-0 bottom-0 z-40 bg-[#FFF9F2]/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 lg:static lg:mt-8 lg:bg-transparent lg:p-0">
            <div className="mx-auto flex max-w-[430px] items-center gap-3 md:max-w-[820px] lg:max-w-none">
              <QtyStepper size="md" value={quantity} label={item.name} onChange={(q) => setQuantity(Math.min(Math.max(1, q), item.stock ?? 20))} />
              <button
                type="button"
                onClick={handleAdd}
                disabled={!item.available}
                className="flex h-[52px] flex-1 items-center justify-center rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16] disabled:bg-[#A39B95]"
              >
                {item.available ? `Add to Cart · ₹${total}` : "Sold out right now"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
