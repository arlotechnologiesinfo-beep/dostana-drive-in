"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Clock, Heart, IndianRupee, Star } from "lucide-react"
import { CartToast } from "@/components/customer/CartToast"
import { DishRow } from "@/components/customer/DishRow"
import { FloatingCartBar } from "@/components/customer/FloatingCartBar"
import { categoriesOf, getStall } from "@/lib/catalog"
import { useCatalog } from "@/lib/use-catalog"
import { useCartActions } from "@/lib/use-cart-actions"
import { useMenuAdminStore } from "@/stores/menu-admin"
import { useFavoritesStore } from "@/stores/favorites"

export default function StallMenuPage() {
  const params = useParams()
  const tableId = String(params.tableId).padStart(2, "0")
  const stallId = String(params.stallId)
  const stall = getStall(stallId)
  const cart = useCartActions()
  const open = useMenuAdminStore((s) => s.stallOpen[stallId] !== false)
  const favorite = useFavoritesStore((s) => s.stalls.includes(stallId))
  const toggleStall = useFavoritesStore((s) => s.toggleStall)

  const catalog = useCatalog()
  const menu = useMemo(() => catalog.filter((i) => i.stallId === stallId), [catalog, stallId])
  const categories = useMemo(() => categoriesOf(menu), [menu])
  const [selected, setSelected] = useState<string | null>(null)
  const [diet, setDiet] = useState<"all" | "veg" | "nonveg">("all")
  const active = selected && categories.includes(selected) ? selected : (categories[0] ?? null)

  const visible = useMemo(
    () =>
      (active === "Recommended" ? menu.filter((i) => i.bestseller) : active ? menu.filter((i) => i.category === active) : menu)
        .filter((i) => diet === "all" || (diet === "veg" ? i.veg : !i.veg))
        .sort((a, b) => b.rating - a.rating),
    [menu, active, diet]
  )

  if (!stall) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F2] p-6 text-center">
        <div>
          <h1 className="text-xl font-bold text-[#26160F]">We couldn&apos;t find that stall</h1>
          <Link href={`/table/${tableId}/stalls`} className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#F4772B] px-6 text-sm font-semibold text-white">
            See all stalls
          </Link>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      <div className="mx-auto w-full max-w-[430px] md:max-w-[820px] lg:max-w-[1100px]">
        <div className="relative h-[240px] w-full overflow-hidden bg-[#FFF1E5] md:h-[340px] md:rounded-b-[32px] lg:mt-6 lg:rounded-[32px]">
          <Image src={stall.image} alt="" fill priority sizes="(max-width: 430px) 100vw, 1100px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#26160F]/55 via-transparent to-[#26160F]/20" aria-hidden="true" />
          <Link
            href={`/table/${tableId}`}
            aria-label="Back to home"
            className="absolute left-4 top-[max(env(safe-area-inset-top),16px)] flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md md:left-6 md:top-6"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => toggleStall(stallId)}
            aria-pressed={favorite}
            aria-label={favorite ? `Remove ${stall.name} from favourites` : `Add ${stall.name} to favourites`}
            className="absolute right-4 top-[max(env(safe-area-inset-top),16px)] flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md md:right-6 md:top-6"
          >
            <Heart className={`h-5 w-5 ${favorite ? "fill-[#EF493B] text-[#EF493B]" : ""}`} aria-hidden="true" />
          </button>
        </div>

        <main className="relative px-5 pb-[140px] md:px-8 lg:px-0">
          <section className="relative -mt-14 rounded-[24px] bg-white p-4 shadow-[0_12px_32px_rgba(48,32,25,0.08)] md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-[22px] font-extrabold leading-7 text-[#26160F] md:text-4xl md:leading-[1.2]">{stall.name}</h1>
                <p className="mt-1 text-sm text-[#77716D]">{stall.cuisines.join(" • ")}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center gap-1 rounded-xl bg-[#145A25] px-3 py-2 text-base font-bold text-white">
                  {stall.rating.toFixed(1)}
                  <Star className="h-4 w-4 fill-white" aria-hidden="true" />
                </span>
                <p className="mt-1 text-xs text-[#77716D]">Demo rating</p>
              </div>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2 border-t border-[#F1E7DE] pt-3 text-sm text-[#302019]">
              <li className="inline-flex items-center gap-2 rounded-full bg-[#FFF4EA] px-3 py-2"><Clock className="h-4 w-4 text-[#E85D16]" aria-hidden="true" />{stall.prep}</li>
              <li className="inline-flex items-center gap-2 rounded-full bg-[#FFF4EA] px-3 py-2"><IndianRupee className="h-4 w-4 text-[#E85D16]" aria-hidden="true" />{stall.avgForTwo} for two</li>
              <li className={`inline-flex items-center gap-2 rounded-full px-3 py-2 ${open ? "bg-[#EAF6E5] text-[#145A25]" : "bg-[#FCE8E7] text-[#EF493B]"}`}>{open ? "Open now" : "Closed"}</li>
            </ul>
          </section>

          <div role="group" aria-label="Food type" className="mt-4 flex gap-2">
            {([["all", "All"], ["veg", "Veg"], ["nonveg", "Non-veg"]] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={diet === id}
                onClick={() => setDiet(id)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${diet === id ? "border-[#F4772B] bg-[#FFE7D6] text-[#E85D16]" : "border-[#F1E7DE] bg-white text-[#302019]"}`}
              >
                {id !== "all" && <span className={`h-3 w-3 rounded-full ${id === "veg" ? "bg-[#145A25]" : "bg-[#EF493B]"}`} aria-hidden="true" />}
                {label}
              </button>
            ))}
          </div>

          {categories.length > 0 && (
            <div className="sticky top-0 z-20 -mx-5 mt-3 bg-[#FFF9F2]/95 px-5 py-2 md:-mx-8 md:px-8 lg:mx-0 lg:px-0">
              <div role="tablist" aria-label="Menu categories" className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={active === c}
                    onClick={() => setSelected(c)}
                    className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition-colors ${
                      active === c ? "bg-[#F4772B] text-white" : "bg-white text-[#302019] shadow-[0_2px_8px_rgba(48,32,25,0.06)]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {visible.length === 0 ? (
            <p className="mt-6 rounded-[20px] bg-white p-6 text-center text-sm text-[#77716D] border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
              This menu is being set up. Please check back soon or ask a waiter.
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {visible.map((d) => (
                <li key={d.id}>
                  <DishRow item={d} tableId={tableId} quantity={cart.quantityFor(d.id)} onAdd={cart.add} onQuantity={cart.setQty} showStall={false} />
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-xs leading-4 text-[#A39B95]">Demo menu: items, prices and ratings are samples until the stall approves its menu.</p>
        </main>
      </div>
      <FloatingCartBar tableId={tableId} />
      <CartToast toast={cart.toast} withNav={false} />
    </div>
  )
}
