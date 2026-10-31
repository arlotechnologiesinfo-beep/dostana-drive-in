"use client"

import Image from "next/image"
import Link from "next/link"
import { DISH_IMAGES } from "@/data/dish-images"

interface DishMarqueeProps {
  /** card width in px on phones / on wide screens */
  size?: { base: number; wide: number }
  /** seconds for one full loop (bigger is slower) */
  seconds?: number
  /** called with the dish's search term; when omitted, cards link to `href` */
  onSelect?: (term: string, name: string) => void
  href?: string
  rounded?: string
}

function Card({ d, size, onSelect, href, rounded, hidden }: { d: (typeof DISH_IMAGES)[number]; size: NonNullable<DishMarqueeProps["size"]>; onSelect?: DishMarqueeProps["onSelect"]; href: string; rounded: string; hidden: boolean }) {
  const cls = `relative block aspect-[573/615] overflow-hidden border border-[#F1E7DE] bg-white shadow-[0_6px_24px_rgba(48,32,25,0.06)] ${rounded}`
  const style = { width: "var(--card)" } as React.CSSProperties
  const img = <Image src={`/dishes/${d.file}.png`} alt={hidden ? "" : d.name} fill unoptimized sizes={`${size.wide}px`} className="object-contain" />
  return onSelect ? (
    <button type="button" tabIndex={hidden ? -1 : undefined} aria-hidden={hidden || undefined} onClick={() => onSelect(d.term, d.name)} aria-label={hidden ? undefined : `Search ${d.name}`} className={`${cls} shrink-0`} style={style}>
      {img}
    </button>
  ) : (
    <Link href={href} tabIndex={hidden ? -1 : undefined} aria-hidden={hidden || undefined} aria-label={hidden ? undefined : `${d.name}: choose your table to order`} className={`${cls} shrink-0`} style={style}>
      {img}
    </Link>
  )
}

/**
 * A row of dishes that scrolls slowly and forever. It pauses when you hover, touch or focus it.
 * With reduced motion it stops and becomes a normal swipeable row.
 */
export function DishMarquee({ size = { base: 120, wide: 180 }, seconds = 70, onSelect, href = "#scan-qr", rounded = "rounded-[22px]" }: DishMarqueeProps) {
  const style = { "--card": `${size.base}px`, "--card-wide": `${size.wide}px`, "--dur": `${seconds}s` } as React.CSSProperties
  return (
    <div
      className="dd-marquee group relative w-full overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={style}
    >
      <ul className="dd-marquee-track flex w-max py-2 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] group-active:[animation-play-state:paused] motion-reduce:animate-none">
        {[false, true].map((hidden) => (
          <li key={String(hidden)} aria-hidden={hidden || undefined} className="contents">
            <ul className="flex gap-3 pr-3 md:gap-5 md:pr-5">
              {DISH_IMAGES.map((d, i) => (
                <li key={d.file} className={i % 2 ? "mt-4 md:mt-8" : ""}>
                  <Card d={d} size={size} onSelect={onSelect} href={href} rounded={rounded} hidden={hidden} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
