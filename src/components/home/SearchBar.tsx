"use client"

import { Search, SlidersHorizontal, X } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onOpenFilters: () => void
  activeFilters: number
}

export function SearchBar({ value, onChange, onOpenFilters, activeFilters }: SearchBarProps) {
  return (
    <div className="flex h-[62px] items-center gap-2 rounded-full bg-white pl-4 pr-1.5 shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
      <Search className="h-5 w-5 shrink-0 text-[#26160F]" aria-hidden="true" />
      <input
        id="home-search"
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for stalls, dishes, cuisines..."
        aria-label="Search for stalls, dishes and cuisines"
        className="min-w-0 flex-1 truncate bg-transparent text-sm text-[#302019] outline-none placeholder:text-[#A39B95] [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#77716D] hover:bg-[#FFF4EA]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <span className="h-7 w-px shrink-0 bg-[#F1E7DE]" aria-hidden="true" />
      <button
        type="button"
        onClick={onOpenFilters}
        aria-label={activeFilters > 0 ? `Filters, ${activeFilters} active` : "Filters"}
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#26160F] transition-colors hover:bg-[#FFF4EA]"
      >
        <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
        {activeFilters > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F4772B] px-1 text-[10px] font-bold leading-none text-white">
            {activeFilters}
          </span>
        )}
      </button>
    </div>
  )
}
