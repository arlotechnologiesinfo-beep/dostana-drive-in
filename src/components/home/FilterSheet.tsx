"use client"

import { useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useDialogFocus } from "@/lib/use-dialog-focus"
import { NO_FILTERS, PRICE_MAX, type HomeFilters } from "@/lib/home-filters"

interface FilterSheetProps {
  open: boolean
  filters: HomeFilters
  onChange: (filters: HomeFilters) => void
  onClose: () => void
  resultCount: number
}

const CUISINE_OPTIONS = ["Biryani", "South Indian", "North Indian", "Chinese", "Pizza", "Burgers", "Desserts", "Beverages"]

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
        selected ? "border-[#F4772B] bg-[#FFE7D6] text-[#E85D16]" : "border-[#F1E7DE] bg-white text-[#302019] hover:bg-[#FFF4EA]"
      }`}
    >
      {children}
    </button>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-[#26160F]">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  )
}

export function FilterSheet({ open, filters, onChange, onClose, resultCount }: FilterSheetProps) {
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(open, panel, onClose)

  const toggleCuisine = (c: string) =>
    onChange({
      ...filters,
      cuisines: filters.cuisines.includes(c) ? filters.cuisines.filter((x) => x !== c) : [...filters.cuisines, c],
    })

  const priceLabel = filters.maxPrice >= PRICE_MAX ? `₹${PRICE_MAX}+` : `₹${filters.maxPrice}`

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <motion.button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-[#26160F]/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="relative flex max-h-[92vh] w-full max-w-[430px] flex-col md:max-w-[600px] rounded-t-[28px] bg-[#FFF9F2] shadow-[0_-12px_40px_rgba(48,32,25,0.08)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%", transition: { duration: 0.15, ease: [0.7, 0, 0.84, 0] } }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 pt-3">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#F1E7DE]" aria-hidden="true" />
              <div className="flex items-center justify-between pb-3">
                <h2 className="text-xl font-bold text-[#26160F]">Filters</h2>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onChange(NO_FILTERS)}
                    className="min-h-11 px-3 text-sm font-medium text-[#E85D16]"
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(48,32,25,0.08)]"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-5 pb-4">
              <Group title="Cuisines">
                {CUISINE_OPTIONS.map((c) => (
                  <Chip key={c} selected={filters.cuisines.includes(c)} onClick={() => toggleCuisine(c)}>
                    {c}
                  </Chip>
                ))}
              </Group>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="price-range" className="text-sm font-semibold text-[#26160F]">Price Range</label>
                  <span className="text-sm font-medium text-[#E85D16]">Up to {priceLabel}</span>
                </div>
                <input
                  id="price-range"
                  type="range"
                  min={0}
                  max={PRICE_MAX}
                  step={50}
                  value={filters.maxPrice}
                  onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                  className="h-11 w-full accent-[#F4772B]"
                />
                <div className="flex justify-between text-xs text-[#77716D]">
                  <span>₹0</span>
                  <span>₹{PRICE_MAX}+</span>
                </div>
              </div>

              <Group title="Rating">
                <Chip selected={filters.minRating === 0} onClick={() => onChange({ ...filters, minRating: 0 })}>Any</Chip>
                <Chip selected={filters.minRating === 4} onClick={() => onChange({ ...filters, minRating: 4 })}>4.0+</Chip>
                <Chip selected={filters.minRating === 4.5} onClick={() => onChange({ ...filters, minRating: 4.5 })}>4.5+</Chip>
              </Group>

              <Group title="Dietary">
                <Chip selected={filters.diet === "any"} onClick={() => onChange({ ...filters, diet: "any" })}>All</Chip>
                <Chip selected={filters.diet === "veg"} onClick={() => onChange({ ...filters, diet: "veg" })}>Vegetarian</Chip>
                <Chip selected={filters.diet === "nonveg"} onClick={() => onChange({ ...filters, diet: "nonveg" })}>Non-Vegetarian</Chip>
              </Group>

              <Group title="Preparation Time">
                <Chip selected={filters.prep === "any"} onClick={() => onChange({ ...filters, prep: "any" })}>Any</Chip>
                <Chip selected={filters.prep === "lt15"} onClick={() => onChange({ ...filters, prep: "lt15" })}>&lt; 15 min</Chip>
                <Chip selected={filters.prep === "15-30"} onClick={() => onChange({ ...filters, prep: "15-30" })}>15–30 min</Chip>
                <Chip selected={filters.prep === "gt30"} onClick={() => onChange({ ...filters, prep: "gt30" })}>30+ min</Chip>
              </Group>
            </div>

            <div className="px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-3">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[52px] w-full rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16]"
              >
                Apply Filters{resultCount >= 0 ? ` · ${resultCount} ${resultCount === 1 ? "result" : "results"}` : ""}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
