"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Heart } from "lucide-react"
import { CartToast } from "@/components/customer/CartToast"
import { DishRow } from "@/components/customer/DishRow"
import { StallRow } from "@/components/customer/StallRow"
import { SubPage } from "@/components/customer/SubPage"
import { HOME_STALLS } from "@/data/home-demo"
import { useCatalog } from "@/lib/use-catalog"
import { useCartActions } from "@/lib/use-cart-actions"
import { useMounted } from "@/lib/use-mounted"
import { useFavoritesStore } from "@/stores/favorites"

export default function FavoritesPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const mounted = useMounted()
  const cart = useCartActions()
  const catalog = useCatalog()
  const stallIds = useFavoritesStore((s) => s.stalls)
  const dishIds = useFavoritesStore((s) => s.dishes)

  const stalls = mounted ? HOME_STALLS.filter((s) => stallIds.includes(s.id)) : []
  const dishes = mounted ? catalog.filter((d) => dishIds.includes(d.id)) : []

  return (
    <SubPage tableId={tableId} title="Favorites">
      {stalls.length === 0 && dishes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[24px] bg-white px-6 py-14 text-center shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FCE8E7]">
            <Heart className="h-6 w-6 text-[#EF493B]" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-bold text-[#26160F]">{mounted ? "No favorites yet" : "Loading"}</h2>
          <p className="max-w-[30ch] text-sm text-[#77716D]">Tap the heart on a stall or dish to keep it here.</p>
          <Link href={`/table/${tableId}`} className="mt-1 inline-flex min-h-12 items-center rounded-full bg-[#F4772B] px-7 text-[15px] font-semibold text-white">
            Explore stalls
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {stalls.length > 0 && (
            <section aria-label="Favorite stalls">
              <h2 className="mb-2 text-sm font-semibold text-[#26160F]">Stalls</h2>
              <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
                {stalls.map((s) => <li key={s.id}><StallRow stall={s} tableId={tableId} /></li>)}
              </ul>
            </section>
          )}
          {dishes.length > 0 && (
            <section aria-label="Favorite dishes">
              <h2 className="mb-2 text-sm font-semibold text-[#26160F]">Dishes</h2>
              <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
                {dishes.map((d) => (
                  <li key={d.id}>
                    <DishRow item={d} tableId={tableId} quantity={cart.quantityFor(d.id)} onAdd={cart.add} onQuantity={cart.setQty} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
      <CartToast toast={cart.toast} />
    </SubPage>
  )
}
