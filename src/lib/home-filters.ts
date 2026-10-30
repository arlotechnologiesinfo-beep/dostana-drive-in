import type { HomeCategory, HomeStall } from "@/data/home-demo"

export const PRICE_MAX = 500

export type DietFilter = "any" | "veg" | "nonveg"
export type PrepFilter = "any" | "lt15" | "15-30" | "gt30"

export interface HomeFilters {
  /** cuisine names, matched case-insensitively against stall and dish cuisines */
  cuisines: string[]
  /** dishes at or under this price; PRICE_MAX means no limit */
  maxPrice: number
  /** 0 means any */
  minRating: number
  diet: DietFilter
  prep: PrepFilter
}

export const NO_FILTERS: HomeFilters = { cuisines: [], maxPrice: PRICE_MAX, minRating: 0, diet: "any", prep: "any" }

export function activeFilterCount(f: HomeFilters): number {
  return (
    Number(f.cuisines.length > 0) +
    Number(f.maxPrice < PRICE_MAX) +
    Number(f.minRating > 0) +
    Number(f.diet !== "any") +
    Number(f.prep !== "any")
  )
}

const norm = (s: string) => s.toLowerCase().trim()

function hasAny(have: string[], want: string[]): boolean {
  const set = have.map(norm)
  return want.some((w) => set.includes(norm(w)))
}

function matchesPrep(prepMax: number, prep: PrepFilter): boolean {
  if (prep === "any") return true
  if (prep === "lt15") return prepMax <= 15
  if (prep === "15-30") return prepMax > 15 && prepMax <= 30
  return prepMax > 30
}

export function filterStalls(stalls: HomeStall[], filters: HomeFilters, category: HomeCategory | undefined): HomeStall[] {
  return stalls.filter(
    (s) =>
      (!category || hasAny(s.cuisines, category.tags)) &&
      (filters.cuisines.length === 0 || hasAny(s.cuisines, filters.cuisines)) &&
      (filters.minRating === 0 || s.rating >= filters.minRating) &&
      matchesPrep(s.prepMax, filters.prep)
  )
}

interface DishLike {
  price: number
  rating: number
  veg: boolean
  cuisines: string[]
}

export function filterDishes<T extends DishLike>(dishes: T[], filters: HomeFilters, category: HomeCategory | undefined): T[] {
  return dishes.filter(
    (d) =>
      (!category || hasAny(d.cuisines, category.tags)) &&
      (filters.cuisines.length === 0 || hasAny(d.cuisines, filters.cuisines)) &&
      (filters.diet === "any" || (filters.diet === "veg" ? d.veg : !d.veg)) &&
      (filters.minRating === 0 || d.rating >= filters.minRating) &&
      d.price <= (filters.maxPrice >= PRICE_MAX ? Infinity : filters.maxPrice)
  )
}

export interface SearchResult<D> {
  stalls: HomeStall[]
  dishes: D[]
  cuisines: HomeCategory[]
}

interface SearchableDish {
  name: string
  stallName: string
  cuisines: string[]
}

/** Case-insensitive search across stall names and cuisines, dish names and cuisines, and categories. */
export function searchHome<D extends SearchableDish>(
  query: string,
  stalls: HomeStall[],
  dishes: D[],
  categories: HomeCategory[]
): SearchResult<D> {
  const q = norm(query)
  if (!q) return { stalls: [], dishes: [], cuisines: [] }
  return {
    stalls: stalls.filter((s) => norm(s.name).includes(q) || s.cuisines.some((c) => norm(c).includes(q))),
    dishes: dishes.filter(
      (d) => norm(d.name).includes(q) || norm(d.stallName).includes(q) || d.cuisines.some((c) => norm(c).includes(q))
    ),
    cuisines: categories.filter((c) => norm(c.label).includes(q) || c.tags.some((t) => norm(t).includes(q))),
  }
}
