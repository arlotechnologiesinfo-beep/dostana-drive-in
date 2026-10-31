"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=360&q=80`

interface FloatItem {
  src: string
  /** position as percentages of the container */
  x: string
  y: string
  size: number
  /** scroll speed: larger moves further */
  depth: number
  rotate: number
}

const HERO_ITEMS: FloatItem[] = [
  { src: img("1563379091339-03b21ab4a4f8"), x: "4%", y: "62%", size: 150, depth: 160, rotate: -8 },
  { src: img("1630383249896-424e482df921"), x: "14%", y: "12%", size: 96, depth: 90, rotate: 6 },
  { src: img("1513104890138-7c749659a591"), x: "82%", y: "58%", size: 140, depth: 150, rotate: 10 },
  { src: img("1568901346375-23c9450c58cd"), x: "86%", y: "10%", size: 100, depth: 80, rotate: -6 },
  { src: img("1551024601-bec78aea704b"), x: "72%", y: "80%", size: 84, depth: 210, rotate: 8 },
  { src: img("1556679343-c7306c1976bc"), x: "24%", y: "84%", size: 80, depth: 220, rotate: -10 },
]

function Floating({ item, progress, reduced }: { item: FloatItem; progress: ReturnType<typeof useScroll>["scrollYProgress"]; reduced: boolean }) {
  const y = useTransform(progress, [0, 1], [0, reduced ? 0 : -item.depth])
  const rot = useTransform(progress, [0, 1], [item.rotate, reduced ? item.rotate : item.rotate + 18])
  return (
    <motion.div
      aria-hidden="true"
      style={{ left: item.x, top: item.y, width: item.size, height: item.size, y, rotate: rot }}
      className="pointer-events-none absolute hidden overflow-hidden rounded-full border-4 border-white/90 shadow-[0_18px_40px_rgba(0,0,0,0.08)] sm:block"
    >
      <Image src={item.src} alt="" fill sizes="160px" className="object-cover" />
    </motion.div>
  )
}

/** Hero wrapper: background drifts slower than the page and food photos float at different depths. */
export function ParallaxHero({ children }: { background?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "28%"])
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60])
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, reduced ? 1 : 0.2])

  return (
    <header ref={ref} className="relative isolate overflow-hidden bg-[#26160F]">
      <motion.div style={{ y: bgY }} className="absolute inset-x-0 -top-10 -z-10 h-[125%]" aria-hidden="true">
        <Image src="/video/hero-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-80" />
        {!reduced && (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/video/hero-poster.jpg"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/video/hero-sm.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        )}
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[#26160F]/40" aria-hidden="true" />
      {HERO_ITEMS.map((item) => (
        <Floating key={item.src} item={item} progress={scrollYProgress} reduced={reduced} />
      ))}
      <motion.div style={{ y: textY, opacity: fade }} className="relative">
        {children}
      </motion.div>
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
