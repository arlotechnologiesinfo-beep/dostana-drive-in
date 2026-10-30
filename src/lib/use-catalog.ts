"use client"

import { useMemo } from "react"
import { applyMenuOverrides, CATALOG, type CatalogItem } from "@/lib/catalog"
import { useMounted } from "@/lib/use-mounted"
import { useMenuAdminStore } from "@/stores/menu-admin"

/** Live catalogue for components. Re-renders when a manager changes the menu; matches server HTML until mounted. */
export function useCatalog(): CatalogItem[] {
  const mounted = useMounted()
  const items = useMenuAdminStore((s) => s.items)
  const stallOpen = useMenuAdminStore((s) => s.stallOpen)
  return useMemo(() => (mounted ? applyMenuOverrides(items, stallOpen) : CATALOG), [mounted, items, stallOpen])
}
