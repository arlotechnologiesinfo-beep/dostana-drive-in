"use client"

import { Minus, Plus } from "lucide-react"

interface QtyStepperProps {
  value: number
  onChange: (next: number) => void
  label: string
  size?: "sm" | "md"
  max?: number
}

export function QtyStepper({ value, onChange, label, size = "sm", max = 20 }: QtyStepperProps) {
  const h = size === "md" ? "h-11" : "h-9"
  return (
    <div
      role="group"
      aria-label={`${label} quantity`}
      className={`inline-flex ${h} items-center rounded-full bg-[#F4772B] text-white shadow-[0_4px_12px_rgba(244,119,43,0.08)]`}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label={`Remove one ${label}`}
        className="flex h-11 w-9 items-center justify-center"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <span className="min-w-5 text-center text-sm font-bold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label={`Add one more ${label}`}
        className="flex h-11 w-9 items-center justify-center"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
