"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, MapPin } from "lucide-react"
import { isValidTable } from "@/lib/orders-db"
import { useRecentTablesStore } from "@/stores/recent-tables"

const TABLES = Array.from({ length: 25 }, (_, i) => String(i + 1).padStart(2, "0"))

interface TableEntryFormProps {
  id: string
  buttonLabel?: string
  /** "hero" renders the pill-style row used on the landing hero; "card" a stacked form */
  variant?: "hero" | "card"
}

export function TableEntryForm({ id, buttonLabel = "Start ordering", variant = "card" }: TableEntryFormProps) {
  const router = useRouter()
  const remember = useRecentTablesStore((s) => s.remember)
  const [table, setTable] = useState("")
  const [error, setError] = useState<string | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!table) {
      setError("Choose your table number first.")
      return
    }
    if (!isValidTable(table)) {
      setError("That table doesn't exist. Tables are numbered 1 to 25.")
      return
    }
    remember(table)
    router.push(`/table/${table}`)
  }

  const hero = variant === "hero"

  return (
    <form onSubmit={submit} noValidate className={hero ? "w-full" : "w-full space-y-3"}>
      <div className={hero ? "flex flex-col gap-3 sm:flex-row" : "space-y-3"}>
        <div className="relative flex-1">
          <label htmlFor={id} className="sr-only">Table number</label>
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#F4772B]" aria-hidden="true" />
          <select
            id={id}
            value={table}
            onChange={(e) => {
              setTable(e.target.value)
              setError(null)
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`h-14 w-full appearance-none rounded-2xl border bg-white pl-12 pr-11 text-[15px] text-[#302019] outline-none focus:border-[#F4772B] ${
              error ? "border-[#EF493B]" : "border-[#F1E7DE]"
            } ${hero ? "shadow-[0_8px_24px_rgba(0,0,0,0.08)]" : ""}`}
          >
            <option value="">Enter your table number</option>
            {TABLES.map((t) => (
              <option key={t} value={t}>Table {parseInt(t, 10)}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#77716D]" aria-hidden="true" />
        </div>
        <button
          type="submit"
          className="h-14 shrink-0 rounded-2xl bg-[#F4772B] px-8 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(244,119,43,0.08)] transition-colors hover:bg-[#E85D16]"
        >
          {buttonLabel}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className={`mt-2 text-sm ${hero ? "rounded-lg bg-white/95 px-3 py-2 text-[#EF493B]" : "text-[#EF493B]"}`}>
          {error}
        </p>
      )}
    </form>
  )
}
