"use client"

import Image from "next/image"
import { Heart, Minus, Plus, Star } from "lucide-react"
import type { HomeDish } from "@/data/home-demo"
import { useFavoritesStore } from "@/stores/favorites"

interface DishCardProps {
  available?: boolean
  dish: HomeDish
  quantity: number
  onAdd: (dish: HomeDish) => void
  onQuantity: (dish: HomeDish, quantity: number) => void
}

export function DishCard({ dish, quantity, onAdd, onQuantity, available = true }: DishCardProps) {
  const favorite = useFavoritesStore((s) => s.dishes.includes(dish.id))
  const toggleDish = useFavoritesStore((s) => s.toggleDish)

  return (
    <article className="relative w-[164px] shrink-0 snap-start rounded-[20px] md:w-full bg-white p-2.5 shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
      <div className="relative h-[116px] w-full overflow-hidden rounded-2xl md:h-[170px] bg-[#FFF1E5]">
        <Image src={dish.image} alt={dish.name} fill sizes="164px" className="object-cover" />
      </div>
      <button
        type="button"
        onClick={() => toggleDish(dish.id)}
        aria-pressed={favorite}
        aria-label={favorite ? `Remove ${dish.name} from favourites` : `Add ${dish.name} to favourites`}
        className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
          <Heart
            className={`h-4 w-4 transition-colors ${favorite ? "fill-[#EF493B] text-[#EF493B]" : "text-[#302019]"}`}
            aria-hidden="true"
          />
        </span>
      </button>

      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-sm font-semibold leading-5 text-[#26160F]">{dish.name}</h3>
        <p className="truncate text-xs leading-4 text-[#77716D]">{dish.stallName}</p>
        <p className="mt-1 flex items-center gap-1 text-xs font-medium leading-4 text-[#145A25]">
          <Star className="h-3.5 w-3.5 fill-[#63B65B] text-[#63B65B]" aria-hidden="true" />
          {dish.rating.toFixed(1)}
        </p>
        <div className="mt-1.5 flex min-h-11 items-center justify-between">
          <span className="text-base font-bold text-[#26160F]">₹{dish.price}</span>
          {!available ? (
            <span className="rounded-full bg-[#FCE8E7] px-2.5 py-1 text-xs font-semibold text-[#EF493B]">Sold out</span>
          ) : quantity === 0 ? (
            <button
              type="button"
              onClick={() => onAdd(dish)}
              aria-label={`Add ${dish.name} to cart`}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4772B] text-white shadow-[0_4px_12px_rgba(244,119,43,0.35)] transition-transform active:scale-90">
                <Plus className="h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          ) : (
            <div className="flex h-9 items-center rounded-full bg-[#F4772B] text-white shadow-[0_4px_12px_rgba(244,119,43,0.35)]" role="group" aria-label={`${dish.name} quantity`}>
              <button
                type="button"
                onClick={() => onQuantity(dish, quantity - 1)}
                aria-label={`Remove one ${dish.name}`}
                className="flex h-11 w-8 items-center justify-center"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="min-w-4 text-center text-sm font-bold tabular-nums" aria-live="polite">{quantity}</span>
              <button
                type="button"
                onClick={() => onQuantity(dish, quantity + 1)}
                aria-label={`Add one more ${dish.name}`}
                className="flex h-11 w-8 items-center justify-center"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

interface RecommendedDishesProps {
  dishes: HomeDish[]
  quantityFor: (dishId: string) => number
  isAvailable?: (dishId: string) => boolean
  onAdd: (dish: HomeDish) => void
  onQuantity: (dish: HomeDish, quantity: number) => void
}

export function RecommendedDishes({ dishes, quantityFor, isAvailable, onAdd, onQuantity }: RecommendedDishesProps) {
  if (dishes.length === 0) {
    return (
      <p className="mx-5 rounded-[20px] bg-white p-5 text-sm md:mx-8 lg:mx-10 text-[#77716D] shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
        No dishes match these filters yet. Try another category or reset the filters.
      </p>
    )
  }
  return (
    <ul className="flex snap-x gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-8 lg:grid-cols-4 lg:px-10 [&::-webkit-scrollbar]:hidden">
      {dishes.map((d) => (
        <li key={d.id} className="shrink-0 md:shrink">
          <DishCard dish={d} available={isAvailable ? isAvailable(d.id) : true} quantity={quantityFor(d.id)} onAdd={onAdd} onQuantity={onQuantity} />
        </li>
      ))}
    </ul>
  )
}
