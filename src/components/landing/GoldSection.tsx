"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { Crown, Percent, Timer } from "lucide-react"

function Coin({ size, className, progress, depth, rotate, reduced }: { size: string; className: string; progress: MotionValue<number>; depth: number; rotate: number; reduced: boolean }) {
  const y = useTransform(progress, [0, 1], [reduced ? 0 : depth, reduced ? 0 : -depth])
  const r = useTransform(progress, [0, 1], [rotate - 14, rotate + 14])
  return (
    <motion.div aria-hidden="true" style={{ y, rotate: reduced ? rotate : r }} className={`pointer-events-none absolute ${className} ${size}`}>
      <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-[0_10px_16px_rgba(0,0,0,0.08)]">
        <defs>
          <radialGradient id="coin-face" cx="35%" cy="30%" r="80%">
            <stop offset="0" stopColor="#F7E3A1" />
            <stop offset="0.55" stopColor="#D8A93F" />
            <stop offset="1" stopColor="#9C6F1B" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="58" fill="url(#coin-face)" />
        <circle cx="60" cy="60" r="47" fill="none" stroke="#FFF3C4" strokeOpacity="0.55" strokeWidth="2" />
        <path d="M34 80 28 46l20 16 12-24 12 24 20-16-6 34Z" fill="#8A5E14" fillOpacity="0.55" />
        <path d="M34 78 28 44l20 16 12-24 12 24 20-16-6 34Z" fill="#FFF0B8" />
      </svg>
    </motion.div>
  )
}

const BENEFITS = [
  { Icon: Percent, title: "Member-only deals", text: "Exclusive offers across all six stalls" },
  { Icon: Timer, title: "Priority service", text: "Your table's orders are made first" },
  { Icon: Crown, title: "Birthday treat", text: "A sweet surprise from Cool Point" },
]

/** Dostana Gold. The benefits are plans, not live offers, and are labelled as such. */
export function GoldSection() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })

  return (
    <section ref={ref} aria-labelledby="gold-title" className="relative isolate overflow-hidden bg-white">
      <div className="relative bg-black px-5 pb-28 pt-24 text-center md:pb-40 md:pt-40">
        <svg className="absolute inset-x-0 top-0 h-10 w-full text-white md:h-24" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0H1200V12Q600 190 0 12Z" fill="currentColor" />
        </svg>
        <svg className="absolute inset-x-0 bottom-0 h-10 w-full text-white md:h-24" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 100H1200V88Q600 -90 0 88Z" fill="currentColor" />
        </svg>
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" aria-hidden="true">
          <defs>
            <pattern id="gold-diamonds" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 4 76 40 40 76 4 40Z" fill="none" stroke="#B88A2C" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gold-diamonds)" />
        </svg>

        <Coin size="w-[56px] md:w-[110px]" className="left-[4%] top-[14%]" progress={scrollYProgress} depth={40} rotate={-12} reduced={reduced} />
        <Coin size="w-[84px] md:w-[190px]" className="right-[4%] top-[8%]" progress={scrollYProgress} depth={90} rotate={10} reduced={reduced} />
        <Coin size="w-[44px] md:w-[72px]" className="bottom-[18%] left-[62%]" progress={scrollYProgress} depth={60} rotate={0} reduced={reduced} />

        <div className="relative mx-auto max-w-[760px]">
          <p className="text-xl font-extrabold italic tracking-tight text-white md:text-3xl">dostana</p>
          <h2 id="gold-title" className="mt-1 text-[64px] font-extrabold leading-none tracking-[0.02em] text-[#E3BD5A] md:text-[120px]">
            GOLD
          </h2>
          <p className="mx-auto mt-5 max-w-[24ch] text-lg leading-7 text-[#C9A24A] md:text-2xl md:leading-9">The rewards club for every table at Dostana</p>
          <p className="mt-3 inline-flex rounded-full border border-[#C9A24A]/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#E3BD5A]">Coming soon</p>

          <h3 className="mt-14 text-lg font-bold uppercase tracking-[0.28em] text-white md:text-3xl">★ Gold benefits ★</h3>
          <ul className="mx-auto mt-10 grid max-w-[760px] gap-6 text-left sm:grid-cols-3">
            {BENEFITS.map(({ Icon, title, text }) => (
              <li key={title} className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#C9A24A]/40 bg-[#1A1408] text-[#E3BD5A]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-base font-semibold text-white">{title}</span>
                  <span className="block text-sm leading-5 text-[#C9A24A]">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-xs text-white/50">Demo content: Gold benefits are plans, not live offers yet.</p>
        </div>
      </div>
    </section>
  )
}
