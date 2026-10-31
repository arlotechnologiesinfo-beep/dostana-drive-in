"use client"

import { Suspense, useMemo, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { CartToast } from "@/components/customer/CartToast"
import { DishRow } from "@/components/customer/DishRow"
import { FloatingCartBar } from "@/components/customer/FloatingCartBar"
import { StallRow } from "@/components/customer/StallRow"
import { SubPage } from "@/components/customer/SubPage"
import { FilterSheet } from "@/components/home/FilterSheet"
import { HOME_CATEGORIES, HOME_STALLS } from "@/data/home-demo"
import { useCatalog } from "@/lib/use-catalog"
import { activeFilterCount, filterDishes, filterStalls, searchHome } from "@/lib/home-filters"
import { useCartActions } from "@/lib/use-cart-actions"
import { useBrowseStore } from "@/stores/browse"

type Tab = "all" | "stalls" | "dishes" | "cuisines"
const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "stalls", label: "Stalls" },
  { id: "dishes", label: "Dishes" },
  { id: "cuisines", label: "Cuisines" },
]
const MAX_DISHES = 40

function SearchContent() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const [query, setQuery] = useState(useSearchParams().get("q") ?? "")
  const [tab, setTab] = useState<Tab>("all")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filters = useBrowseStore((s) => s.filters)
  const setFilters = useBrowseStore((s) => s.setFilters)
  const cart = useCartActions()
  const catalog = useCatalog()

  const q = query.trim()
  const results = useMemo(() => searchHome(query, HOME_STALLS, catalog, HOME_CATEGORIES), [query, catalog])

  const stalls = useMemo(() => filterStalls(q ? results.stalls : HOME_STALLS, filters, undefined), [q, results.stalls, filters])
  const dishes = useMemo(
    () => filterDishes(q ? results.dishes : catalog.filter((i) => i.bestseller), filters, undefined),
    [q, results.dishes, filters, catalog]
  )
  const cuisines = q ? results.cuisines : HOME_CATEGORIES

  const showStalls = tab === "all" || tab === "stalls"
  const showDishes = tab === "all" || tab === "dishes"
  const showCuisines = tab === "all" || tab === "cuisines"
  const nothing =
    (!showStalls || stalls.length === 0) && (!showDishes || dishes.length === 0) && (!showCuisines || cuisines.length === 0)

  return (
    <SubPage tableId={tableId} title="Search">
      <div className="flex h-[56px] items-center gap-2 rounded-full bg-white pl-4 pr-2 border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
        <Search className="h-5 w-5 shrink-0 text-[#26160F]" aria-hidden="true" />
        <input
          type="search"
          autoFocus
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for stalls, dishes, cuisines..."
          aria-label="Search for stalls, dishes and cuisines"
          className="min-w-0 flex-1 truncate bg-transparent text-sm text-[#302019] outline-none placeholder:text-[#A39B95] [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="flex h-11 w-11 items-center justify-center rounded-full text-[#77716D]">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <span className="h-7 w-px bg-[#F1E7DE]" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          aria-label={activeFilterCount(filters) ? `Filters, ${activeFilterCount(filters)} active` : "Filters"}
          className="relative flex h-11 w-11 items-center justify-center rounded-full"
        >
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          {activeFilterCount(filters) > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F4772B] px-1 text-[10px] font-bold text-white">
              {activeFilterCount(filters)}
            </span>
          )}
        </button>
      </div>

      <div role="tablist" aria-label="Result type" className="mt-4 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-[#F4772B] text-white" : "bg-white text-[#302019] shadow-[0_2px_8px_rgba(48,32,25,0.06)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-6" aria-live="polite">
        {showCuisines && cuisines.length > 0 && (
          <section aria-label="Cuisines">
            <h2 className="mb-2 text-sm font-semibold text-[#26160F]">Cuisines</h2>
            <ul className="flex flex-wrap gap-2">
              {cuisines.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setQuery(c.label)}
                    className="min-h-11 rounded-full bg-[#FFE7D6] px-4 text-sm font-semibold text-[#E85D16]"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {showStalls && stalls.length > 0 && (
          <section aria-label="Stalls">
            <h2 className="mb-2 text-sm font-semibold text-[#26160F]">Stalls</h2>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {stalls.map((s) => (
                <li key={s.id}>
                  <StallRow stall={s} tableId={tableId} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {showDishes && dishes.length > 0 && (
          <section aria-label="Dishes">
            <h2 className="mb-2 text-sm font-semibold text-[#26160F]">{q ? "Dishes" : "Popular dishes"}</h2>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              {dishes.slice(0, MAX_DISHES).map((d) => (
                <li key={d.id}>
                  <DishRow item={d} tableId={tableId} quantity={cart.quantityFor(d.id)} onAdd={cart.add} onQuantity={cart.setQty} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {nothing && (
          <div className="flex flex-col items-center gap-2 rounded-[22px] bg-white px-6 py-10 text-center border border-[#F1E7DE] shadow-[0_6px_24px_rgba(48,32,25,0.06)]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE7D6]">
              <Search className="h-5 w-5 text-[#E85D16]" aria-hidden="true" />
            </span>
            <p className="text-base font-semibold text-[#26160F]">{q ? `Nothing found for “${q}”` : "Nothing matches these filters"}</p>
            <p className="max-w-[30ch] text-sm text-[#77716D]">Check the spelling, try a stall, dish or cuisine, or clear your filters.</p>
          </div>
        )}
      </div>

      <FilterSheet open={filtersOpen} filters={filters} onChange={setFilters} onClose={() => setFiltersOpen(false)} resultCount={stalls.length + dishes.length} />
      <FloatingCartBar tableId={tableId} withNav />
      <CartToast toast={cart.toast} />
    </SubPage>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  )
}
