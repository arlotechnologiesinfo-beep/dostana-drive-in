import { ALL_MENU_ITEMS } from "@/data/menu"
import { dishArt } from "@/lib/dish-art"
import { HOME_DISHES, HOME_STALLS, type HomeStall } from "@/data/home-demo"
import { useMenuAdminStore, type StaffItem } from "@/stores/menu-admin"

/**
 * One catalogue for every screen: the base stall menus, the homepage demo dishes,
 * and the live changes stall managers make (price, stock, on/off, added, removed).
 * Ratings are demo values until real reviews exist.
 */
export interface CatalogVariant {
  name: string
  price: number
}

export interface CatalogItem {
  id: string
  name: string
  price: number
  stallId: string
  stallName: string
  image?: string
  veg: boolean
  description?: string
  category?: string
  variants?: CatalogVariant[]
  /** demo rating, 4.0 to 4.8 */
  rating: number
  cuisines: string[]
  bestseller: boolean
  /** portions per serving; demo default until stalls set it */
  serves: number
  allergens: string[]
  prepMinutes: number | null
  /** false when switched off, out of stock, or the stall is closed */
  available: boolean
  /** units left; null means unlimited */
  stock: number | null
  /** true when a manager added this item */
  custom: boolean
}

export type AddableDish = Pick<CatalogItem, "id" | "name" | "price" | "stallId" | "stallName" | "image">

export const OFFICIAL_STALLS: HomeStall[] = HOME_STALLS

const stallById = new Map(HOME_STALLS.map((s) => [s.id, s]))

export function getStall(id: string): HomeStall | undefined {
  return stallById.get(id)
}

const ph = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`

/** Stand-in photo chosen by what the dish is, so every item shows food that fits it. Replaced by the stall's own photo once uploaded. */
const PHOTO_RULES: [RegExp, string][] = [
  [/biryani|pulao|biriyani/i, ph("1563379091339-03b21ab4a4f8")],
  [/dosa|uttapam|uthappam/i, ph("1630383249896-424e482df921")],
  [/idly|idli|wada|vada|bajji|bonda|puri/i, ph("1589301760014-d929f3979dbc")],
  [/naan|roti|paratha|kulcha/i, ph("1626074353765-517a681e40be")],
  [/paneer|masala|curry|dal|gravy|kadai|butter/i, ph("1631452180519-c014fe946bc7")],
  [/pizza/i, ph("1574071318508-1cdbab80d002")],
  [/burger|sandwich/i, ph("1568901346375-23c9450c58cd")],
  [/noodle|fried rice|manchurian|chinese/i, ph("1512058564366-18510be2db19")],
  [/tea|chai|coffee/i, ph("1556679343-c7306c1976bc")],
  [/juice|shake|cooler|lassi|milk|soda|lemon|mojito|tonic/i, ph("1613478223719-2ab802602423")],
  [/ice ?cream|brownie|dessert|sundae|kulfi|cake|sweet/i, ph("1551024601-bec78aea704b")],
  [/chicken|mutton|fish|prawn|egg|kebab|tikka|fry/i, ph("1565557623262-b51c2513a641")],
]

function photoFor(name: string, category: string | undefined, fallback: string): string {
  const text = `${name} ${category ?? ""}`
  for (const [re, url] of PHOTO_RULES) if (re.test(text)) return url
  return fallback
}

function demoRating(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return 4 + (h % 9) / 10
}

/** Base items before any manager change. */
const BASE: CatalogItem[] = [
  ...HOME_DISHES.map<CatalogItem>((d) => ({
    id: d.id,
    name: d.name,
    price: d.price,
    stallId: d.stallId,
    stallName: d.stallName,
    image: d.image,
    veg: d.veg,
    category: "Recommended",
    rating: d.rating,
    cuisines: d.cuisines,
    bestseller: true,
    serves: 1,
    allergens: [],
    prepMinutes: null,
    available: true,
    stock: null,
    custom: false,
  })),
  ...ALL_MENU_ITEMS.filter((i) => stallById.has(i.stall_id)).map<CatalogItem>((i) => {
    const stall = stallById.get(i.stall_id)!
    return {
      id: i.id,
      name: i.name,
      price: i.price,
      stallId: i.stall_id,
      stallName: stall.name,
      image: dishArt(i.name, i.category_name) ?? i.image ?? photoFor(i.name, i.category_name, stall.image),
      veg: i.is_veg,
      description: i.description ?? i.subtitle,
      category: i.category_name,
      variants: i.variants,
      rating: demoRating(i.id),
      cuisines: [...(i.category_name ? [i.category_name] : []), ...(i.subcategory ? [i.subcategory] : []), ...stall.cuisines],
      bestseller: Boolean(i.is_bestseller || i.is_popular),
      serves: 1,
      allergens: [],
      prepMinutes: null,
      available: i.is_available,
      stock: null,
      custom: false,
    }
  }),
]

/** Static base catalogue, safe for server rendering. */
export const CATALOG: CatalogItem[] = BASE.filter((i) => i.available)

export function applyMenuOverrides(overrides: Overrides, stallOpen: Record<string, boolean>): CatalogItem[] {
  return applyOverrides(overrides, stallOpen)
}

type Overrides = ReturnType<typeof useMenuAdminStore.getState>["items"]

function applyOverrides(overrides: Overrides, stallOpen: Record<string, boolean>): CatalogItem[] {
  const merged: CatalogItem[] = []
  for (const base of BASE) {
    const o = overrides[base.id]
    if (o?.removed) continue
    merged.push({
      ...base,
      name: o?.name ?? base.name,
      price: o?.price ?? base.price,
      category: o?.category ?? base.category,
      description: o?.description ?? base.description,
      veg: o?.veg ?? base.veg,
      image: o?.image ?? base.image,
      available: o?.available ?? base.available,
      stock: o?.stock !== undefined ? o.stock : base.stock,
      serves: o?.serves ?? base.serves,
      allergens: o?.allergens ?? base.allergens,
      prepMinutes: o?.prepMinutes ?? base.prepMinutes,
    })
  }
  for (const o of Object.values(overrides)) {
    if (!o.custom || o.removed || !o.stallId) continue
    const stall = stallById.get(o.stallId)
    if (!stall) continue
    merged.push({
      id: o.id,
      name: o.name ?? "Item",
      price: o.price ?? 0,
      stallId: o.stallId,
      stallName: stall.name,
      image: o.image,
      veg: o.veg ?? true,
      description: o.description,
      category: o.category,
      rating: demoRating(o.id),
      cuisines: [...(o.category ? [o.category] : []), ...stall.cuisines],
      bestseller: false,
      serves: o.serves ?? 1,
      allergens: o.allergens ?? [],
      prepMinutes: o.prepMinutes ?? null,
      available: o.available ?? true,
      stock: o.stock ?? null,
      custom: true,
    })
  }
  return merged.map((i) => {
    const open = stallOpen[i.stallId] !== false
    const inStock = i.stock === null || i.stock > 0
    return { ...i, available: i.available && inStock && open }
  })
}

/** Current catalogue including manager changes. Reads the store directly, so use it in handlers and server-style checks. */
export function getCatalog(): CatalogItem[] {
  const s = useMenuAdminStore.getState()
  return applyOverrides(s.items, s.stallOpen)
}

export function getCatalogItem(id: string): CatalogItem | undefined {
  return getCatalog().find((i) => i.id === id)
}

export function getStallMenu(stallId: string): CatalogItem[] {
  return getCatalog().filter((i) => i.stallId === stallId)
}

/** Category names for a stall, with "Recommended" first when it has any best sellers. */
export function categoriesOf(items: CatalogItem[]): string[] {
  const cats: string[] = []
  if (items.some((i) => i.bestseller)) cats.push("Recommended")
  for (const i of items) {
    if (i.category && i.category !== "Recommended" && !cats.includes(i.category)) cats.push(i.category)
  }
  return cats
}

export function getStallCategories(stallId: string): string[] {
  return categoriesOf(getStallMenu(stallId))
}

/** Manager-side view of one item's base values, used to diff edits. */
export function toStaffDefaults(item: CatalogItem): Pick<StaffItem, "name" | "price" | "category" | "veg"> {
  return { name: item.name, price: item.price, category: item.category ?? "", veg: item.veg }
}
