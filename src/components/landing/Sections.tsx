"use client"

import { useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { ConciergeBell, Crown, Grid2x2, Leaf, LayoutGrid, Percent, QrCode, Receipt, Store, Timer } from "lucide-react"


type Progress = MotionValue<number>

/* ───────── Stats section with parallax food cutouts ───────── */

interface Cutout {
  name: string
  /** transparent cut-out file in /public/parallax; a round photo shows until it is added */
  file: string
  fallback?: string
  pos: string
  size: string
  depth: number
  rotate: number
}

const CUTOUTS: Cutout[] = [
  { name: "burger", file: "/parallax/burger.webp", pos: "left-[-8%] top-[52%] md:left-[11%] md:top-[26%]", size: "w-[120px] md:w-[210px] lg:w-[240px]", depth: 90, rotate: -4 },
  { name: "pizza", file: "/parallax/pizza.png", pos: "right-[-10%] top-[40%] md:right-[7%] md:top-[34%]", size: "w-[130px] md:w-[230px] lg:w-[260px]", depth: 140, rotate: 6 },
  { name: "dumplings", file: "/parallax/dumplings.webp", pos: "right-[-2%] top-[0%] md:right-[13%] md:top-[-3%]", size: "w-[96px] md:w-[190px] lg:w-[220px]", depth: 60, rotate: 3 },
  { name: "tomato-1", file: "/parallax/tomato.png", pos: "right-[6%] top-[68%] md:right-[7%] md:top-[22%]", size: "w-[30px] md:w-[48px]", depth: 180, rotate: 18 },
  { name: "tomato-2", file: "/parallax/tomato.png", pos: "left-[10%] top-[70%] md:left-[11%] md:top-[58%]", size: "w-[30px] md:w-[48px]", depth: 120, rotate: -28 },
  { name: "mint", file: "/parallax/mint.png", pos: "left-[42%] top-[1%] md:left-[31%] md:top-[0%]", size: "w-[34px] md:w-[56px]", depth: 70, rotate: 8 },
]

function CutoutImage({ c, progress, reduced }: { c: Cutout; progress: Progress; reduced: boolean }) {
  const [src, setSrc] = useState(c.file)
  const [hidden, setHidden] = useState(false)
  const y = useTransform(progress, [0, 1], [reduced ? 0 : c.depth, reduced ? 0 : -c.depth])
  const rotate = useTransform(progress, [0, 1], [c.rotate - 8, c.rotate + 8])
  if (hidden) return null
  const round = src !== c.file
  return (
    <motion.div aria-hidden="true" style={{ y, rotate: reduced ? c.rotate : rotate }} className={`pointer-events-none absolute ${c.pos} ${c.size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={() => (c.fallback && !round ? setSrc(c.fallback) : setHidden(true))}
        className="h-auto w-full select-none"
      />
    </motion.div>
  )
}

const STATS = [
  { value: "6", label: "stalls", Icon: Store },
  { value: "25", label: "tables", Icon: LayoutGrid },
  { value: "1", label: "cart and checkout", Icon: Receipt },
]

export function StatsSection() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })

  return (
    <section ref={ref} aria-labelledby="stats-title" className="relative isolate overflow-hidden bg-white px-5 py-16 md:py-28">
      <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full" viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path d="M-20 80C120 -40 340 40 260 180C190 300 80 330 220 480C340 600 520 640 -40 620" stroke="#F4772B" strokeOpacity="0.22" strokeWidth="1.2" />
        <path d="M1220 40C1060 -20 960 120 1080 260C1190 380 1260 470 1100 560" stroke="#F4772B" strokeOpacity="0.22" strokeWidth="1.2" />
      </svg>
      {CUTOUTS.map((c) => (
        <CutoutImage key={c.name} c={c} progress={scrollYProgress} reduced={reduced} />
      ))}

      <div className="relative mx-auto max-w-[560px] text-center">
        <h2 id="stats-title" className="text-[34px] font-extrabold leading-[1.1] text-[#E85D16] md:text-[56px]">
          Better food for
          <br />
          more people
        </h2>
        <p className="mx-auto mt-5 max-w-[34ch] text-base leading-7 text-[#77716D] md:text-lg md:leading-8">
          Six kitchens, one table. We bring every stall to your seat, so everyone gets what they love without leaving the table.
        </p>
      </div>

      <ul className="relative mx-auto mt-20 grid max-w-[760px] grid-cols-1 gap-0 rounded-[28px] border border-[#F1E7DE] bg-white p-2 shadow-[0_6px_24px_rgba(48,32,25,0.06)] sm:grid-cols-3 md:mt-32">
        {STATS.map(({ value, label, Icon }, i) => (
          <li key={label} className={`flex items-center justify-between gap-4 px-6 py-5 ${i > 0 ? "border-t border-[#F1E7DE] sm:border-l sm:border-t-0" : ""}`}>
            <span>
              <span className="block text-[32px] font-extrabold leading-9 text-[#26160F]">{value}</span>
              <span className="block text-sm text-[#77716D]">{label}</span>
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE7D6] text-[#E85D16]">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ───────── Features section: phone rises from below, tiles drift at different speeds ───────── */

interface Feature {
  label: string
  Icon: typeof Leaf
  tone: string
  /** desktop position inside the stage, as left/top percentages */
  l: string
  t: string
  /** how far (px) the tile travels while rising into place */
  depth: number
  toggle?: boolean
}

const FEATURES: Feature[] = [
  { label: "Healthy", Icon: Leaf, tone: "bg-[#EAF6E5] text-[#145A25]", l: "6%", t: "18%", depth: 90 },
  { label: "Veg Mode", Icon: Leaf, tone: "bg-[#EAF6E5] text-[#145A25]", l: "20%", t: "0%", depth: 140, toggle: true },
  { label: "Call waiter", Icon: ConciergeBell, tone: "bg-[#FFE7D6] text-[#E85D16]", l: "12%", t: "58%", depth: 60 },
  { label: "Join Gold", Icon: Crown, tone: "bg-[#FFF1D0] text-[#B7791F]", l: "26%", t: "44%", depth: 110 },
  { label: "Offers", Icon: Percent, tone: "bg-[#FCE8E7] text-[#EF493B]", l: "70%", t: "0%", depth: 140 },
  { label: "Collections", Icon: Grid2x2, tone: "bg-[#FFE7D6] text-[#E85D16]", l: "78%", t: "44%", depth: 90 },
  { label: "Table QR", Icon: QrCode, tone: "bg-[#FFF4EA] text-[#26160F]", l: "62%", t: "58%", depth: 60 },
  { label: "Live tracking", Icon: Timer, tone: "bg-[#EAF6E5] text-[#145A25]", l: "58%", t: "18%", depth: 110 },
]

function FeatureTile({ f, progress, reduced }: { f: Feature; progress: Progress; reduced: boolean }) {
  const y = useTransform(progress, [0, 1], [reduced ? 0 : f.depth, 0])
  const opacity = useTransform(progress, [0, 0.6], [reduced ? 1 : 0, 1])
  const { Icon } = f
  return (
    <motion.li
      style={{ y, opacity, "--l": f.l, "--t": f.t } as unknown as React.CSSProperties}
      className="flex h-[112px] flex-col items-center justify-center gap-2 rounded-[20px] border border-[#F1E7DE] bg-white px-2 text-center shadow-[0_6px_24px_rgba(48,32,25,0.06)] md:absolute md:left-[var(--l)] md:top-[var(--t)] md:h-[124px] md:w-[116px]"
    >
      {f.toggle ? (
        <span className="flex h-9 w-14 items-center rounded-full bg-[#2F9E44] p-1" aria-hidden="true">
          <span className="ml-auto h-7 w-7 rounded-full bg-white shadow" />
        </span>
      ) : (
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.tone}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <span className="text-[13px] font-medium leading-4 text-[#26160F]">{f.label}</span>
    </motion.li>
  )
}

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const phoneY = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 160, 0])
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.5], [reduced ? 1 : 0, 1])

  return (
    <section ref={ref} aria-labelledby="features-title" className="relative overflow-hidden bg-gradient-to-b from-[#FFF1E5] via-[#FFF9F2] to-white px-5 pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto max-w-[640px] text-center">
        <h2 id="features-title" className="text-[32px] font-extrabold leading-[1.15] text-[#E85D16] md:text-[52px]">
          What&apos;s waiting for you at Dostana?
        </h2>
        <p className="mx-auto mt-4 max-w-[36ch] text-base leading-7 text-[#77716D] md:text-lg md:leading-8">
          Everything you need to order, pay and track your food is right at your table.
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-[960px] md:mt-14 md:h-[420px]">
        <motion.div
          style={{ y: phoneY, opacity: phoneOpacity }}
          className="relative mx-auto h-[300px] w-[240px] overflow-hidden rounded-t-[44px] border-[8px] border-b-0 border-[#26160F] bg-white md:absolute md:left-1/2 md:top-0 md:h-[400px] md:w-[290px] md:-translate-x-1/2"
        >
          <span className="absolute left-1/2 top-0 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-[#26160F]" aria-hidden="true" />
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFE7D6] text-[#E85D16]">
              <QrCode className="h-8 w-8" aria-hidden="true" />
            </span>
            <span className="text-[17px] font-bold leading-6 text-[#26160F]">Order from your table</span>
            <span className="text-xs leading-4 text-[#77716D]">Scan the QR, pick from six stalls, pay once.</span>
          </div>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
        </motion.div>

        <ul className="mt-8 grid grid-cols-2 gap-3 md:mt-0 md:block">
          {FEATURES.map((f) => (
            <FeatureTile key={f.label} f={f} progress={scrollYProgress} reduced={reduced} />
          ))}
        </ul>
      </div>
    </section>
  )
}
