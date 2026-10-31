"use client"

import { useEffect, useRef, useState } from "react"
import { Accessibility, Bell, Contrast, Type, WifiOff } from "lucide-react"
import { create } from "zustand"
import { useMounted } from "@/lib/use-mounted"
import { useStaffPrefsStore, type TextSize } from "@/stores/staff-prefs"

/* ───────── Screen reader announcements ───────── */

const useAnnouncer = create<{ message: string; n: number; say: (m: string) => void }>((set) => ({
  message: "",
  n: 0,
  say: (message) => set((s) => ({ message, n: s.n + 1 })),
}))

export function announce(message: string) {
  useAnnouncer.getState().say(message)
}

function Announcer() {
  const message = useAnnouncer((s) => s.message)
  const n = useAnnouncer((s) => s.n)
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {/* the counter in the key makes repeated identical messages be read again */}
      <span key={n}>{message}</span>
    </div>
  )
}

/* ───────── Chime and vibration ───────── */

let audio: AudioContext | null = null

export function playChime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    audio ??= new Ctx()
    void audio.resume()
    const t = audio.currentTime
    ;[880, 1175].forEach((freq, i) => {
      const osc = audio!.createOscillator()
      const gain = audio!.createGain()
      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, t + i * 0.18)
      gain.gain.exponentialRampToValueAtTime(0.25, t + i * 0.18 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.18 + 0.3)
      osc.connect(gain).connect(audio!.destination)
      osc.start(t + i * 0.18)
      osc.stop(t + i * 0.18 + 0.32)
    })
    navigator.vibrate?.([120, 60, 120])
  } catch {
    /* sound blocked until the user taps the page: the on-screen announcement still works */
  }
}

/**
 * Watches a list of items and, when a new id appears after the first load, announces it to screen readers
 * and plays the chime (if sound alerts are on).
 */
export function useNewItemAlert(items: { id: string; label: string }[], loaded: boolean) {
  const seen = useRef<Set<string> | null>(null)
  const sound = useStaffPrefsStore((s) => s.sound)

  useEffect(() => {
    if (!loaded) return
    const ids = new Set(items.map((i) => i.id))
    if (seen.current === null) {
      seen.current = ids
      return
    }
    const fresh = items.filter((i) => !seen.current!.has(i.id))
    seen.current = ids
    if (fresh.length === 0) return
    announce(fresh.length === 1 ? `New: ${fresh[0].label}` : `${fresh.length} new: ${fresh.map((f) => f.label).join(", ")}`)
    if (sound) playChime()
  }, [items, loaded, sound])
}

/* ───────── Display preferences ───────── */

const SIZE_PCT: Record<TextSize, string> = { normal: "100%", large: "112.5%", xlarge: "125%" }

function PrefsApplier() {
  const textSize = useStaffPrefsStore((s) => s.textSize)
  const highContrast = useStaffPrefsStore((s) => s.highContrast)

  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = SIZE_PCT[textSize]
    if (highContrast) root.dataset.staffHc = "true"
    else delete root.dataset.staffHc
    return () => {
      root.style.fontSize = ""
      delete root.dataset.staffHc
    }
  }, [textSize, highContrast])
  return null
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="flex h-11 w-14 shrink-0 items-center justify-center">
      <span className={`flex h-7 w-12 items-center rounded-full p-0.5 transition-colors ${checked ? "bg-[#2F7D32]" : "bg-[#8A8078]"}`}>
        <span className={`h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </span>
    </button>
  )
}

/** Accessibility button and panel: text size, high contrast, sound alerts. Also applies the saved preferences. */
export function StaffTools() {
  const mounted = useMounted()
  const { textSize, highContrast, sound, setTextSize, setHighContrast, setSound } = useStaffPrefsStore()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    const onDown = (e: MouseEvent) => {
      if (!panel.current?.contains(e.target as Node) && !trigger.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("mousedown", onDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("mousedown", onDown)
    }
  }, [open])

  const sizes: { id: TextSize; label: string; px: string }[] = [
    { id: "normal", label: "Normal", px: "text-sm" },
    { id: "large", label: "Large", px: "text-base" },
    { id: "xlarge", label: "Extra large", px: "text-lg" },
  ]

  return (
    <div className="relative">
      {mounted && <PrefsApplier />}
      <Announcer />
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Accessibility settings"
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white text-foreground"
      >
        <Accessibility className="h-5 w-5" aria-hidden="true" />
      </button>
      {open && (
        <div ref={panel} role="dialog" aria-label="Accessibility settings" className="absolute right-0 top-full z-50 mt-2 w-[min(320px,calc(100vw-32px))] rounded-2xl border border-border bg-white p-4 shadow-[0_12px_32px_rgba(48,32,25,0.08)]">
          <fieldset>
            <legend className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
              <Type className="h-4 w-4" aria-hidden="true" /> Text size
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={textSize === s.id}
                  onClick={() => setTextSize(s.id)}
                  className={`min-h-11 rounded-xl border px-1 font-semibold ${s.px} ${textSize === s.id ? "border-[#E85D16] bg-[#FFE7D6] text-[#7A2E05]" : "border-border bg-white text-foreground"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Contrast className="h-4 w-4" aria-hidden="true" /> High contrast
            </span>
            <Switch checked={highContrast} onChange={setHighContrast} label="High contrast" />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bell className="h-4 w-4" aria-hidden="true" /> Sound and vibration alerts
            </span>
            <Switch checked={sound} onChange={setSound} label="Sound and vibration alerts" />
          </div>
          <button type="button" onClick={playChime} className="mt-1 min-h-11 w-full rounded-xl border border-border text-sm font-semibold text-foreground">
            Test the alert
          </button>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">New orders and requests are also read out to screen readers. Saved on this device.</p>
        </div>
      )}
    </div>
  )
}

export function SkipLink() {
  return (
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-[#26160F] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white">
      Skip to main content
    </a>
  )
}

/** Shows a banner when the connection drops, since live updates pause. */
export function OfflineBanner() {
  const mounted = useMounted()
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine)
    sync()
    window.addEventListener("online", sync)
    window.addEventListener("offline", sync)
    return () => {
      window.removeEventListener("online", sync)
      window.removeEventListener("offline", sync)
    }
  }, [])

  if (!mounted || online) return null
  return (
    <div role="alert" className="flex items-center justify-center gap-2 bg-[#26160F] px-4 py-2 text-sm font-semibold text-white">
      <WifiOff className="h-4 w-4" aria-hidden="true" />
      You&apos;re offline. Live updates are paused until the connection returns.
    </div>
  )
}
