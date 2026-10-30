"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMounted } from "@/lib/use-mounted"
import { useStallAuthStore, type StallSession } from "@/stores/stall-auth"

/** Redirects to the stall login when nobody is signed in. Returns the session once known. */
export function useStallGuard(): { ready: boolean; session: StallSession | null } {
  const router = useRouter()
  const mounted = useMounted()
  const session = useStallAuthStore((s) => s.session)

  useEffect(() => {
    if (mounted && !session) router.replace("/stall-login")
  }, [mounted, session, router])

  return { ready: mounted && session !== null, session: mounted ? session : null }
}
