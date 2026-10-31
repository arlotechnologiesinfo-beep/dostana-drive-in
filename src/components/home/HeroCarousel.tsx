"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface Banner {
  id: string
  src: string
  alt: string
  href: (tableId: string) => string
}

/** Full banner artwork, shown as supplied (no cropping, no re-compression). The text is part of the image. */
const BANNERS: Banner[] = [
  { id: "good-mood", src: "/banners/banner-1.webp", alt: "Good food, great mood. Delicious meals from your favourite stalls.", href: (t) => `/table/${t}/stalls` },
  { id: "single-biryani", src: "/banners/banner-2.webp", alt: "Aroma Biryani: single biryani from 150 rupees.", href: (t) => `/table/${t}/stall/aroma-biryani` },
  { id: "cravings", src: "/banners/banner-3.webp", alt: "Cravings, delivered. Your favourite food from your favourite stalls.", href: (t) => `/table/${t}/stalls` },
  { id: "flat-50", src: "/banners/banner-4.webp", alt: "Flat 50 percent off on top brands: Nani's Tiffins, Aroma Biryani, Tea Time.", href: (t) => `/table/${t}/rewards` },
  { id: "great-moments", src: "/banners/banner-5.webp", alt: "Good food, great moments. One app, many cravings.", href: (t) => `/table/${t}/stalls` },
]

export function HeroCarousel({ tableId }: { tableId: string }) {
  const scroller = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const snapTimer = useRef<number | undefined>(undefined)
  const [index, setIndex] = useState(0)
  const total = BANNERS.length

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
      let cur = Math.round(el.scrollLeft / el.clientWidth)
      if (cur >= total) {
        // already on the copy of the first banner: jump back silently, then keep moving forward
        el.style.scrollSnapType = "none"
        el.scrollLeft = (cur - total) * el.clientWidth
        el.style.scrollSnapType = ""
        cur -= total
      }
      goTo(cur + 1)
    }, 4500)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(snapTimer.current)
    }
  }, [goTo, total])

  /* A copy of the first banner sits after the last. Once it is reached, jump back to the real first one without animation, so the loop only ever moves forward. */
  const onScroll = (el: HTMLDivElement) => {
    const raw = Math.round(el.scrollLeft / el.clientWidth)
    setIndex(raw % total)
    if (raw >= total) {
      window.clearTimeout(snapTimer.current)
      snapTimer.current = window.setTimeout(() => {
        if (Math.round(el.scrollLeft / el.clientWidth) >= total) {
          el.style.scrollSnapType = "none"
          el.scrollLeft = 0
          requestAnimationFrame(() => (el.style.scrollSnapType = ""))
        }
      }, 450)
    }
  }

  const slides = [...BANNERS, BANNERS[0]]

  return (
    <section aria-roledescription="carousel" aria-label="Today's offers" className="relative px-5 md:px-8 lg:px-10">
      <div
        ref={scroller}
        onScroll={(e) => onScroll(e.currentTarget)}
        onPointerEnter={() => (paused.current = true)}
        onPointerLeave={() => (paused.current = false)}
        onTouchStart={() => (paused.current = true)}
        onTouchEnd={() => (paused.current = false)}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-[22px] bg-[#FFF4EA] shadow-[0_8px_24px_rgba(48,32,25,0.08)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((b, i) => {
          const clone = i === total
          return (
            <div
              key={clone ? `${b.id}-clone` : b.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${(i % total) + 1} of ${total}`}
              aria-hidden={clone ? true : undefined}
              className="relative aspect-[2/1] w-full shrink-0 snap-center"
            >
              <Link href={b.href(tableId)} tabIndex={clone ? -1 : undefined} className="block h-full w-full">
                <Image
                  src={b.src}
                  alt={clone ? "" : b.alt}
                  fill
                  unoptimized
                  priority={i === 0}
                  loading={i === 0 ? undefined : clone ? "eager" : "lazy"}
                  sizes="(max-width: 430px) 100vw, 1100px"
                  className="object-cover"
                />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="-mt-1 flex items-center justify-center">
        {BANNERS.map((b, i) => (
          <button
            key={b.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show banner ${i + 1}`}
            aria-current={i === index}
            className="flex h-11 w-11 items-center justify-center"
          >
            <span className={`h-2 w-2 rounded-full transition-[transform,background-color] duration-200 ease-out ${i === index ? "scale-x-[2.5] bg-[#F4772B]" : "bg-[#F1E7DE]"}`} />
          </button>
        ))}
      </div>
    </section>
  )
}
