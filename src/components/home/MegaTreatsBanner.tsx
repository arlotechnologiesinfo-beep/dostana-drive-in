"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

/** Full-width banner section. Shown at the artwork's own proportions, with no cropping or re-compression. Hidden if the file is missing. */
export function MegaTreatsBanner({ tableId }: { tableId: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <section aria-label="Mega treats offer" className="px-5 md:px-8 lg:px-10">
      <Link
        href={`/table/${tableId}/rewards`}
        className="relative block aspect-[1686/933] w-full overflow-hidden rounded-[24px] bg-[#FFF1D9] shadow-[0_10px_28px_rgba(48,32,25,0.08)] transition-transform active:scale-[0.99]"
      >
        <Image
          src="/banners/mega-treats.webp"
          alt="Celebrate mega treats. Flat 50 percent off on top brands, and minimum 180 rupees off and more. Powered by Nani's Tiffins, Aroma Biryani and Tea Time. Order now."
          fill
          unoptimized
          sizes="(max-width: 430px) 100vw, 1100px"
          className="object-contain"
          onError={() => setFailed(true)}
        />
      </Link>
    </section>
  )
}
