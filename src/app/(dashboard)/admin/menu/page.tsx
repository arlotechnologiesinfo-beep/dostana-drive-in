"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/dashboard/AdminLayout"
import { MenuManager } from "@/components/dashboard/MenuManager"
import { HOME_STALLS } from "@/data/home-demo"

/** Admin view of every stall's menu: add, edit, price, stock, live switch and remove. */
export default function AdminMenuPage() {
  const [stallId, setStallId] = useState(HOME_STALLS[0].id)
  const stall = HOME_STALLS.find((s) => s.id === stallId)!

  return (
    <AdminLayout title="Menus" subtitle="Manage any stall's items, prices and stock">
      <div className="mx-auto w-full max-w-[1100px] px-4 pt-5 md:px-8">
        <label htmlFor="menu-stall" className="mb-1 block text-sm font-semibold text-foreground">Stall</label>
        <select
          id="menu-stall"
          value={stallId}
          onChange={(e) => setStallId(e.target.value)}
          className="h-12 w-full max-w-[360px] rounded-2xl border border-border bg-white px-4 text-sm font-semibold outline-none focus:border-[#F4772B]"
        >
          {HOME_STALLS.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <MenuManager key={stall.id} stall={{ id: stall.id, name: stall.name }} actor="Admin" showAccount={false} />
    </AdminLayout>
  )
}
