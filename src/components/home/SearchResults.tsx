"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import type { HomeCategory } from "@/data/home-demo"
import type { AddableDish, CatalogItem } from "@/lib/catalog"
import type { SearchResult } from "@/lib/home-filters"

interface SearchResultsProps {
  query: string
  results: SearchResult<CatalogItem>
  tableId: string
  onPickCategory: (category: HomeCategory) => void
  onAdd: (dish: AddableDish) => void
}

export function SearchResults({ query, results, tableId, onPickCategory, onAdd }: SearchResultsProps) {
  const total = results.stalls.length + results.dishes.length + results.cuisines.length

  return (
    <section
      aria-label="Search results"
      aria-live="polite"
      className="mx-5 mt-3 rounded-[22px] md:mx-8 lg:mx-10 bg-white p-4 shadow-[0_12px_32px_rgba(48,32,25,0.08)]"
    >
      {total === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFE7D6]">
            <Search className="h-5 w-5 text-[#E85D16]" aria-hidden="true" />
          </span>
          <p className="text-base font-semibold text-[#26160F]">Nothing found for “{query}”</p>
          <p className="max-w-[28ch] text-sm text-[#77716D]">Check the spelling or try a stall, dish or cuisine like biryani or dosa.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {results.cuisines.length > 0 && (
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#A39B95]">Cuisines</h2>
              <ul className="flex flex-wrap gap-2">
                {results.cuisines.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onPickCategory(c)}
                      className="min-h-11 rounded-full bg-[#FFE7D6] px-4 text-sm font-semibold text-[#E85D16]"
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.stalls.length > 0 && (
            <div>
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#A39B95]">Stalls</h2>
              <ul>
                {results.stalls.map((s) => (
                  <li key={s.id}>
                    <Link href={`/table/${tableId}/stall/${s.id}`} className="flex min-h-14 items-center gap-3 py-2">
                      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#FFF1E5]">
                        <Image src={s.image} alt="" fill sizes="44px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[#26160F]">{s.name}</span>
                        <span className="block truncate text-xs text-[#77716D]">{s.cuisines.join(" • ")}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.dishes.length > 0 && (
            <div>
              <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#A39B95]">Dishes</h2>
              <ul>
                {results.dishes.map((d) => (
                  <li key={d.id} className="flex min-h-14 items-center gap-3 py-2">
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#FFF1E5]">
                      {d.image && <Image src={d.image} alt="" fill sizes="44px" className="object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-[#26160F]">{d.name}</span>
                      <span className="block truncate text-xs text-[#77716D]">
                        {d.stallName} · ₹{d.price}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onAdd(d)}
                      aria-label={`Add ${d.name} to cart`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4772B] text-white">
                        <Plus className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
