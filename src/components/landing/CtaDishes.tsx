"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"

const DISHES = [
  { name: "Shawarma", src: "/cta/shawarma.png", rise: 28, depth: 36, tilt: -3 },
  { name: "Biryani", src: "/cta/biryani.png", rise: 0, depth: 60, tilt: 0 },
  { name: "Pizza", src: "/cta/pizza.png", rise: 28, depth: 36, tilt: 3 },
]

function DishCard({ d, progress, reduced }: { d: (typeof DISHES)[number]; progress: MotionValue<number>; reduced: boolean }) {
  const y = useTransform(progress, [0, 1], [reduced ? 0 : d.depth, reduced ? 0 : -d.depth])
  return (
    <motion.li style={{ y }} className={d.rise ? "mt-6 md:mt-10" : ""}>
      <motion.div whileHover={{ y: -6, rotate: d.tilt, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } }}>
        <Link
          href="#scan-qr"
          aria-label={`Order ${d.name}: pick your table to start`}
          className="relative block aspect-[573/615] overflow-hidden rounded-[24px] border border-white/20 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] md:rounded-[32px]"
        >
          <Image src={d.src} alt={d.name} fill unoptimized sizes="(max-width: 768px) 30vw, 240px" className="object-contain" />
        </Link>
      </motion.div>
    </motion.li>
  )
}

/** Three signature dishes that float at different depths inside the call-to-action. */
export function CtaDishes() {
  const ref = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  return (
    <ul ref={ref} className="relative mx-auto mt-10 grid max-w-[860px] grid-cols-3 items-start gap-2 md:mt-14 md:gap-6">
      {DISHES.map((d) => (
        <DishCard key={d.name} d={d} progress={scrollYProgress} reduced={reduced} />
      ))}
    </ul>
  )
}
