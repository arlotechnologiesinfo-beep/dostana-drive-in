"use client"

import { useParams } from "next/navigation"
import { StallRow } from "@/components/customer/StallRow"
import { SubPage } from "@/components/customer/SubPage"
import { HOME_STALLS } from "@/data/home-demo"

export default function AllStallsPage() {
  const tableId = String(useParams().tableId).padStart(2, "0")
  return (
    <SubPage tableId={tableId} title="Popular Stalls">
      <ul className="grid gap-3 md:grid-cols-2 md:gap-5">
        {HOME_STALLS.map((s) => (
          <li key={s.id}>
            <StallRow stall={s} tableId={tableId} />
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs leading-4 text-[#A39B95]">Demo content: ratings, prep times and prices are samples.</p>
    </SubPage>
  )
}
