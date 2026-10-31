"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AnimatePresence, motion, MotionConfig } from "framer-motion"
import { AlertTriangle, Check } from "lucide-react"
import { BottomNav } from "@/components/customer/BottomNav"
import { CallWaiterModal } from "@/components/customer/CallWaiterModal"
import { CategoryRow } from "@/components/home/CategoryRow"
import { FilterSheet } from "@/components/home/FilterSheet"
import { HeroCarousel } from "@/components/home/HeroCarousel"
import { HomeHeader } from "@/components/home/HomeHeader"
import { MegaTreatsBanner } from "@/components/home/MegaTreatsBanner"
import { PopularStalls } from "@/components/home/PopularStalls"
import { PromoCards } from "@/components/home/PromoCards"
import { RecommendedDishes } from "@/components/home/RecommendedDishes"
import { JoinGoldBanner } from "@/components/home/JoinGoldBanner"
import { MadeWithLove } from "@/components/home/MadeWithLove"
import { StallCircles } from "@/components/home/StallCircles"
import { SearchBar } from "@/components/home/SearchBar"
import { SearchResults } from "@/components/home/SearchResults"
import { SectionHeader } from "@/components/home/SectionHeader"
import { HOME_CATEGORIES, HOME_DISHES, HOME_STALLS, type HomeDish } from "@/data/home-demo"
import { activeFilterCount, filterDishes, filterStalls, searchHome } from "@/lib/home-filters"
import { type AddableDish } from "@/lib/catalog"
import { useCatalog } from "@/lib/use-catalog"
import { useBrowseStore } from "@/stores/browse"
import { getOrCreateSession, isValidTable } from "@/lib/orders-db"
import { useMounted } from "@/lib/use-mounted"
import { useCartStore } from "@/stores/cart"
import { useRecentTablesStore } from "@/stores/recent-tables"
import { DEMO_NOTIFICATIONS, useNotificationsStore } from "@/stores/notifications"

function greetingFor(hour: number): string {
  if (hour < 12) return "Good Morning"
  if (hour < 17) return "Good Afternoon"
  return "Good Evening"
}

export default function TablePage() {
  const params = useParams()
  const tableId = String(params.tableId).padStart(2, "0")
  const tableValid = isValidTable(tableId)
  const mounted = useMounted()
  const catalog = useCatalog()

  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const setTableId = useCartStore((s) => s.setTableId)
  const readIds = useNotificationsStore((s) => s.readIds)
  const rememberTable = useRecentTablesStore((s) => s.remember)

  const [query, setQuery] = useState("")
  const filters = useBrowseStore((s) => s.filters)
  const setFilters = useBrowseStore((s) => s.setFilters)
  const categoryId = useBrowseStore((s) => s.categoryId)
  const setCategoryId = useBrowseStore((s) => s.setCategoryId)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [waiterOpen, setWaiterOpen] = useState(false)
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  /* The active table session decides which table the customer is dining at. */
  const session = useMemo(() => (mounted && tableValid ? getOrCreateSession(tableId) : null), [mounted, tableValid, tableId])
  const tableNumber = parseInt(session?.table_id ?? tableId, 10)

  useEffect(() => {
    if (tableValid) {
      setTableId(tableId)
      rememberTable(tableId)
    }
  }, [tableValid, tableId, setTableId, rememberTable])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const category = HOME_CATEGORIES.find((c) => c.id === categoryId)
  const stalls = useMemo(() => filterStalls(HOME_STALLS, filters, category), [filters, category])
  const dishes = useMemo(() => {
    const live = HOME_DISHES.flatMap((d) => {
      const c = catalog.find((x) => x.id === d.id)
      return c ? [{ ...d, name: c.name, price: c.price }] : []
    })
    return filterDishes(live, filters, category).sort((x, y) => y.rating - x.rating)
  }, [filters, category, catalog])
  const searching = query.trim().length > 0
  const results = useMemo(() => searchHome(query, HOME_STALLS, catalog, HOME_CATEGORIES), [query, catalog])

  const quantityFor = (dishId: string) =>
    mounted ? (items.find((i) => i.menu_item_id === dishId)?.quantity ?? 0) : 0

  const showToast = (text: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), text })
    toastTimer.current = window.setTimeout(() => setToast(null), 2200)
  }

  const handleAdd = (dish: AddableDish) => {
    if (catalog.find((c) => c.id === dish.id)?.available === false) return
    addItem({
      stall_id: dish.stallId,
      stall_name: dish.stallName,
      menu_item_id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      image: dish.image ?? "",
    })
    showToast(`${dish.name} added · Cart ₹${useCartStore.getState().getTotal()}`)
  }

  const handleQuantity = (dish: HomeDish, quantity: number) => {
    updateQuantity(dish.id, quantity)
    if (quantity > 0) showToast(`Cart ₹${useCartStore.getState().getTotal()}`)
  }

  if (!tableValid) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF9F2] p-6">
        <div className="w-full max-w-sm rounded-[24px] bg-white p-8 text-center shadow-[0_12px_32px_rgba(48,32,25,0.08)]">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FCE8E7]">
            <AlertTriangle className="h-7 w-7 text-[#EF493B]" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-[#26160F]">This table code isn&apos;t valid</h1>
          <p className="mt-2 text-sm text-[#77716D]">
            Scan the QR code on your table again, or ask a waiter for help.
          </p>
        </div>
      </main>
    )
  }

  const hasUnread = mounted && DEMO_NOTIFICATIONS.some((n) => !readIds.includes(n.id))

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FFF9F2]">
        <main className="relative mx-auto max-w-[430px] pb-[152px] md:max-w-[820px] lg:max-w-[1200px]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[300px] bg-[radial-gradient(70%_90%_at_0%_0%,rgba(255,217,194,0.6),transparent),radial-gradient(60%_80%_at_100%_0%,rgba(255,231,214,0.7),transparent)]"
            aria-hidden="true"
          />

          <div className="relative space-y-5 md:space-y-8 lg:space-y-10">
            <HomeHeader
              tableId={tableId}
              tableNumber={tableNumber}
              greeting={mounted ? greetingFor(new Date().getHours()) : "Good Evening"}
              hasUnread={hasUnread}
              onCallWaiter={() => setWaiterOpen(true)}
            />

            <div className="px-5 md:px-8 lg:max-w-[780px] lg:px-10">
              <SearchBar
                value={query}
                onChange={setQuery}
                onOpenFilters={() => setFiltersOpen(true)}
                activeFilters={activeFilterCount(filters)}
              />
            </div>

            {searching ? (
              <SearchResults
                query={query}
                results={results}
                tableId={tableId}
                onAdd={handleAdd}
                onPickCategory={(c) => {
                  setCategoryId(c.id)
                  setQuery("")
                }}
              />
            ) : (
              <>
                <HeroCarousel tableId={tableId} />
                <CategoryRow categories={HOME_CATEGORIES} selectedId={categoryId} onSelect={setCategoryId} />
                <StallCircles stalls={HOME_STALLS} tableId={tableId} />
                <PromoCards tableId={tableId} />
                <MegaTreatsBanner tableId={tableId} />

                <section aria-labelledby="popular-stalls" className="space-y-1">
                  <div id="popular-stalls">
                    <SectionHeader title="Popular Stalls" href={`/table/${tableId}/stalls`} />
                  </div>
                  <PopularStalls stalls={stalls} tableId={tableId} />
                </section>

                <section aria-labelledby="recommended" className="space-y-1">
                  <div id="recommended">
                    <SectionHeader title="Recommended for You" href={`/table/${tableId}/search`} />
                  </div>
                  <RecommendedDishes
                    dishes={dishes}
                    quantityFor={quantityFor}
                    isAvailable={(id) => catalog.find((c) => c.id === id)?.available ?? true}
                    onAdd={handleAdd}
                    onQuantity={handleQuantity}
                  />
                </section>

                <JoinGoldBanner tableId={tableId} />
                <MadeWithLove />
              </>
            )}
          </div>
        </main>

        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              role="status"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none fixed inset-x-0 bottom-[112px] z-50 flex justify-center px-4"
            >
              <span className="flex max-w-[360px] items-center gap-2 rounded-full bg-[#26160F] px-4 py-3 text-sm font-medium text-white shadow-[0_8px_24px_rgba(38,22,15,0.08)]">
                <Check className="h-4 w-4 shrink-0 text-[#63B65B]" aria-hidden="true" />
                <span className="truncate">{toast.text}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav tableId={tableId} />
        <FilterSheet
          open={filtersOpen}
          filters={filters}
          onChange={setFilters}
          onClose={() => setFiltersOpen(false)}
          resultCount={stalls.length + dishes.length}
        />
        <CallWaiterModal tableId={tableId} isOpen={waiterOpen} onClose={() => setWaiterOpen(false)} />
      </div>
    </MotionConfig>
  )
}
