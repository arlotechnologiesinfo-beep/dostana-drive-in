"use client"

import Image from "next/image"
import type { HomeCategory } from "@/data/home-demo"

interface CategoryRowProps {
  categories: HomeCategory[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function CategoryRow({ categories, selectedId, onSelect }: CategoryRowProps) {
  return (
    <nav aria-label="Food categories">
      <ul className="flex snap-x gap-4 overflow-x-auto px-5 pb-1 md:justify-between md:gap-2 md:overflow-visible md:px-8 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const selected = c.id === selectedId
          return (
            <li key={c.id} className="shrink-0 snap-start">
              <button
                type="button"
                onClick={() => onSelect(selected ? null : c.id)}
                aria-pressed={selected}
                className="flex w-[76px] flex-col items-center gap-2 md:w-[92px] lg:w-[128px]"
              >
                <span
                  className={`relative block h-[72px] w-[72px] rounded-full md:h-[84px] md:w-[84px] lg:h-[116px] lg:w-[116px] transition-all duration-200 ${
                    selected ? "ring-2 ring-[#F4772B] ring-offset-2 ring-offset-[#FFF9F2]" : ""
                  }`}
                  style={{ backgroundColor: c.bg }}
                >
                  <span className="absolute inset-1.5 overflow-hidden rounded-full shadow-[0_3px_10px_rgba(48,32,25,0.08)]">
                    <Image src={c.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                </span>
                <span className={`text-[13px] font-semibold leading-4 md:text-sm md:leading-5 ${selected ? "text-[#E85D16]" : "text-[#26160F]"}`}>
                  {c.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
