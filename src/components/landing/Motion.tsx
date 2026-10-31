"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion"

const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** Thin orange bar at the top of the page that fills as you scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress, transformOrigin: "0 50%" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-1 bg-[#F4772B]"
    />
  )
}

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
}

/** Plays its children in one after another when it first appears (the hero text). */
export function HeroStagger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div className={className} variants={containerVariants} initial={reduced ? "show" : "hidden"} animate="show">
      {children}
    </motion.div>
  )
}

/** Brings children in one after another as the group scrolls into view. Use StaggerItem for each child. */
export function Stagger({ children, className = "", as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "ul" }) {
  const reduced = useReducedMotion()
  const Tag = as === "ul" ? motion.ul : motion.div
  return (
    <Tag className={className} variants={containerVariants} initial={reduced ? "show" : "hidden"} whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </Tag>
  )
}

export function StaggerItem({ children, className = "", as = "div", lift = false }: { children: React.ReactNode; className?: string; as?: "div" | "li"; lift?: boolean }) {
  const Tag = as === "li" ? motion.li : motion.div
  return (
    <Tag className={className} variants={itemVariants} whileHover={lift ? { y: -4, transition: { duration: 0.15, ease: EASE_OUT } } : undefined}>
      {children}
    </Tag>
  )
}

/** Photo that drifts slower than the page inside its frame, for a depth effect. The parent needs `relative overflow-hidden`. */
export function ParallaxImage({ src, sizes, className = "" }: { src: string; sizes: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? "0%" : "-8%", reduced ? "0%" : "8%"])
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
        <Image src={src} alt="" fill sizes={sizes} className={`object-cover ${className}`} />
      </motion.div>
    </div>
  )
}
