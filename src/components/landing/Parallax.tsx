"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=360&q=80`

/**
 * Hero: nav, then the full-width video (never cropped, always its own 16:9 shape), with the title,
 * tagline and table picker on top of it on wide screens and directly below it on phones.
 * The video file is used exactly as supplied (1920x1080, no re-encoding) and loops forever.
 */
export function ParallaxHero({ nav, children }: { nav: React.ReactNode; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 40])

  /* Keep the reel looping, even if the browser pauses it or ignores the loop flag. */
  useEffect(() => {
    const el = video.current
    if (!el) return
    const restart = () => {
      el.currentTime = 0
      void el.play().catch(() => {})
    }
    const resume = () => {
      if (el.paused) void el.play().catch(() => {})
    }
    el.addEventListener("ended", restart)
    document.addEventListener("visibilitychange", resume)
    return () => {
      el.removeEventListener("ended", restart)
      document.removeEventListener("visibilitychange", resume)
    }
  }, [reduced])

  return (
    <header ref={ref} className="relative isolate overflow-hidden bg-[#26160F]">
      {nav}
      <div className="relative w-full">
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          <Image src="/video/order-now-poster.jpg" alt="" fill priority unoptimized sizes="100vw" className="object-contain" />
          {!reduced && (
            <video
              ref={video}
              className="absolute inset-0 h-full w-full object-contain"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/video/order-now-poster.jpg"
              aria-label="Dostana Drive In food reel"
            >
              <source src="/video/order-now.mp4" type="video/mp4" />
            </video>
          )}
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-b from-black/60 via-black/40 to-black/70 lg:block" aria-hidden="true" />
        </div>
        <motion.div style={{ y: textY }} className="relative lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center">
          {children}
        </motion.div>
      </div>
    </header>
  )
}

/** Fades and lifts content in once as it enters the viewport. */
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.3, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const RING_ITEMS = [
  { src: img("1631515243349-e0cb75fb8d3a"), cls: "-left-6 top-4 h-24 w-24 md:-left-12 md:h-32 md:w-32", depth: -50 },
  { src: img("1512621776951-a57141f2eefd"), cls: "-right-4 top-24 h-20 w-20 md:-right-10 md:h-28 md:w-28", depth: 60 },
  { src: img("1621996346565-e3dbc646d9a9"), cls: "-bottom-6 -left-2 h-20 w-20 md:-left-8 md:h-28 md:w-28", depth: 40 },
  { src: img("1585937421612-70a008356fbe"), cls: "-bottom-8 right-2 h-24 w-24 md:-right-6 md:h-32 md:w-32", depth: -70 },
]

/** Phone-style card with food photos orbiting at different depths as the section scrolls. */
export function FloatingFoodFrame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[360px]">
      {RING_ITEMS.map((r) => (
        <RingItem key={r.src} {...r} progress={scrollYProgress} reduced={reduced} />
      ))}
      {children}
    </div>
  )
}

function RingItem({ src, cls, depth, progress, reduced }: { src: string; cls: string; depth: number; progress: ReturnType<typeof useScroll>["scrollYProgress"]; reduced: boolean }) {
  const y = useTransform(progress, [0, 1], [reduced ? 0 : -depth, reduced ? 0 : depth])
  return (
    <motion.div
      aria-hidden="true"
      style={{ y }}
      className={`pointer-events-none absolute z-10 overflow-hidden rounded-full border-4 border-white shadow-[0_14px_30px_rgba(38,22,15,0.08)] ${cls}`}
    >
      <Image src={src} alt="" fill sizes="128px" className="object-cover" />
    </motion.div>
  )
}
