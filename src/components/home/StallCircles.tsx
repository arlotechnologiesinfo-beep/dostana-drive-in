import Image from "next/image"
import Link from "next/link"
import type { HomeStall } from "@/data/home-demo"

export function StallCircles({ stalls, tableId }: { stalls: HomeStall[]; tableId: string }) {
  return (
    <nav aria-label="Stalls">
      <ul className="flex snap-x gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:justify-between md:gap-2 md:overflow-visible md:px-8 lg:px-10 [&::-webkit-scrollbar]:hidden">
        {stalls.map((s) => (
          <li key={s.id} className="shrink-0 snap-start">
            <Link href={`/table/${tableId}/stall/${s.id}`} className="flex w-[80px] flex-col items-center gap-2 md:w-[110px]">
              <span className="relative block h-[72px] w-[72px] rounded-full bg-gradient-to-br from-[#F4772B] to-[#FFB84D] p-[3px] md:h-[96px] md:w-[96px]">
                <span className="relative block h-full w-full overflow-hidden rounded-full border-2 border-white">
                  <Image src={s.image} alt="" fill sizes="96px" className="object-cover" />
                </span>
              </span>
              <span className="line-clamp-2 text-center text-xs font-semibold leading-4 text-[#26160F] md:text-sm">{s.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
