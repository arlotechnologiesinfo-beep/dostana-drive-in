"use client"

import { MenuManager } from "@/components/dashboard/MenuManager"
import { StallShell } from "@/components/dashboard/StallShell"

export default function StallMenuManagerPage() {
  return <StallShell>{(stall) => <MenuManager stall={stall} />}</StallShell>
}
