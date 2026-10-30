"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { SubPage } from "@/components/customer/SubPage"
import { HOME_CATEGORIES } from "@/data/home-demo"
import { useCatalog } from "@/lib/use-catalog"
import { useBrowseStore } from "@/stores/browse"

const TONES: Record<string, string> = {
  "#FFE7D6": "#E85D16",
  "#EAF6E5": "#145A25",
  "#FCE8E7": "#EF493B",
  "#FFF1E5": "#E85D16",
  "#FFD9C2": "#E85D16",
}

export default function CategoriesPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  const setCategoryId = useBrowseStore((s) => s.setCategoryId)
  const catalog = useCatalog()

  return (
    <SubPage tableId={tableId} title="Categories">
      <ul className="grid gap-3 md:grid-cols-2 md:gap-5">
        {HOME_CATEGORIES.map((c) => {
          const count = catalog.filter((i) => i.cuisines.some((x) => c.tags.includes(x.toLowerCase()))).length
          return (
            <li key={c.id}>
              <Link
                href={`/table/${tableId}`}
                onClick={() => setCategoryId(c.id)}
                className="relative flex h-[116px] items-center overflow-hidden rounded-[22px] p-5 transition-transform active:scale-[0.99] md:h-[140px]"
                style={{ backgroundColor: c.bg }}
              >
                <span className="relative z-10">
                  <span className="block text-xl font-extrabold leading-7 md:text-2xl" style={{ color: TONES[c.bg] ?? "#E85D16" }}>
                    {c.label}
                  </span>
                  <span className="block text-sm text-[#77716D]">{count > 0 ? `${count} items` : "Coming soon"}</span>
                </span>
                <span className="absolute -right-6 top-1/2 h-[132px] w-[132px] -translate-y-1/2 overflow-hidden rounded-full shadow-[0_8px_20px_rgba(48,32,25,0.15)] md:h-[160px] md:w-[160px]">
                  <Image src={c.image} alt="" fill sizes="160px" className="object-cover" />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </SubPage>
  )
}
