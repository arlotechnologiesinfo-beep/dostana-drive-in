"use client"

import { useState } from "react"
import { KeyRound } from "lucide-react"
import { AdminLayout } from "@/components/dashboard/AdminLayout"
import { HOME_STALLS } from "@/data/home-demo"
import { useMounted } from "@/lib/use-mounted"
import { DEFAULT_PASSWORD, useStallAuthStore } from "@/stores/stall-auth"

/** Admin view of the six stall manager accounts. Demo-grade: see stall-auth store notes. */
export default function StallLoginsPage() {
  const mounted = useMounted()
  const hashes = useStallAuthStore((s) => s.hashes)
  const resetPassword = useStallAuthStore((s) => s.resetPassword)
  const [confirming, setConfirming] = useState<string | null>(null)

  return (
    <AdminLayout title="Stall logins" subtitle="One manager account per stall">
      <div className="mx-auto w-full max-w-[900px] px-4 py-5 lg:px-8">
        <p className="mb-4 text-sm text-muted-foreground">
          Each stall signs in at <span className="font-semibold">/stall-login</span> and can only manage its own menu, prices, stock and orders.
          New accounts use the password <span className="font-semibold">{DEFAULT_PASSWORD}</span> until the manager changes it.
        </p>
        <ul className="space-y-3">
          {HOME_STALLS.map((s) => {
            const custom = mounted && hashes[s.id] !== undefined
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-[20px] bg-white p-4 shadow-[0_6px_24px_rgba(48,32,25,0.07)]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFE7D6] text-[#E85D16]">
                  <KeyRound className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 basis-48">
                  <span className="block font-bold text-[#26160F]">{s.name}</span>
                  <span className={`text-xs font-semibold ${custom ? "text-[#145A25]" : "text-[#EF493B]"}`}>
                    {custom ? "Custom password set" : "Default password in use"}
                  </span>
                </span>
                {confirming === s.id ? (
                  <span className="flex gap-2">
                    <button type="button" onClick={() => { resetPassword(s.id); setConfirming(null) }} className="min-h-11 rounded-full bg-[#EF493B] px-5 text-sm font-semibold text-white">
                      Reset {s.name}
                    </button>
                    <button type="button" onClick={() => setConfirming(null)} className="min-h-11 rounded-full border border-[#E6D6C8] px-5 text-sm font-semibold">Cancel</button>
                  </span>
                ) : (
                  <button type="button" disabled={!custom} onClick={() => setConfirming(s.id)} className="min-h-11 rounded-full border border-[#F4772B] px-5 text-sm font-semibold text-[#E85D16] disabled:opacity-40">
                    Reset to default
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </AdminLayout>
  )
}
