"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { HeroSlide } from "@/data/home-demo"

/** Scalloped badge outline: a circle with a gentle 14-lobe edge. */
const SCALLOP_PATH = (() => {
  const points: string[] = []
  for (let i = 0; i <= 140; i++) {
    const a = (i / 140) * Math.PI * 2
    const r = 45 + 4 * Math.cos(a * 14)
    points.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${points.join("L")}Z`
})()

function DiscountBadge({ text }: { text: string }) {
  const parts = text.split(" ")
  const lines = parts.length >= 3 ? [parts[0], parts[1], parts.slice(2).join(" ")] : ["", parts[0], parts.slice(1).join(" ")]
  return (
    <div className="absolute right-3 top-3 h-[72px] w-[72px] md:right-6 md:top-6 md:h-[104px] md:w-[104px]" role="img" aria-label={text.toLowerCase()}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]" aria-hidden="true">
        <path d={SCALLOP_PATH} fill="#F5B544" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#26160F]" aria-hidden="true">
        <span className="text-[10px] font-semibold leading-3">{lines[0]}</span>
        <span className="text-xl font-extrabold leading-6 md:text-3xl md:leading-8">{lines[1]}</span>
        <span className="text-[10px] font-semibold leading-3">{lines[2]}</span>
      </div>
    </div>
  )
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  tableId: string
}

export function HeroCarousel({ slides, tableId }: HeroCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const [index, setIndex] = useState(0)

  const goTo = useCallback((i: number) => {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => {
      const el = scroller.current
      if (!el || paused.current) return
      const current = Math.round(el.scrollLeft / el.clientWidth)
      goTo((current + 1) % slides.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [goTo, slides.length])

  return (
    <section aria-roledescription="carousel" aria-label="Today's offers" className="relative px-5 md:px-8 lg:px-10">
      <div
        ref={scroller}
        onScroll={(e) => {
          const el = e.currentTarget
          setIndex(Math.round(el.scrollLeft / el.clientWidth))
        }}
        onPointerEnter={() => (paused.current = true)}
        onPointerLeave={() => (paused.current = false)}
        onTouchStart={() => (paused.current = true)}
        onTouchEnd={() => (paused.current = false)}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-[22px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className="relative h-[196px] w-full shrink-0 md:h-[280px] lg:h-[340px] snap-center overflow-hidden rounded-[22px] bg-[#26160F]"
          >
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="(max-width: 430px) 100vw, 430px"
              priority={i === 0}
              className="object-cover object-[78%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#26160F] via-[#26160F]/75 to-[#26160F]/5" aria-hidden="true" />
            <DiscountBadge text={slide.badge} />
            <div className="absolute inset-y-0 left-5 flex max-w-[64%] flex-col justify-center gap-1.5 md:left-10 md:max-w-[55%] md:gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#FFB84D] md:text-sm">{slide.eyebrow}</p>
              <h2 className="font-[family-name:var(--font-serif)] text-[34px] font-bold leading-[1.05] text-white md:text-[54px] lg:text-[68px]">{slide.title}</h2>
              <p className="text-xs leading-[18px] text-white/90 md:text-base md:leading-6">{slide.description}</p>
              <Link
                href={`/table/${tableId}/stall/${slide.stallId}`}
                className="mt-1.5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#E85D16] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#F4772B]"
              >
                {slide.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-5 bg-white" : "w-2 bg-white/50"}`}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
