import Link from "next/link"
import { ChevronRight, Crown, Gift, Percent, Star } from "lucide-react"

export function JoinGoldBanner({ tableId }: { tableId: string }) {
  return (
    <section aria-label="Join Gold" className="px-5 md:px-8 lg:px-10">
      <Link
        href={`/table/${tableId}/rewards`}
        className="group relative block overflow-hidden rounded-[24px] bg-gradient-to-br from-[#26160F] via-[#3B2214] to-[#5A3318] p-5 shadow-[0_12px_32px_rgba(38,22,15,0.08)] transition-transform active:scale-[0.99] md:p-8"
      >
        <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F5B544]/25" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-12 right-16 h-28 w-28 rounded-full bg-[#F4772B]/25" aria-hidden="true" />
        <span className="relative flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F5B544] to-[#F4772B] shadow-[0_8px_20px_rgba(245,181,68,0.08)]">
            <Crown className="h-7 w-7 text-white" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xl font-extrabold leading-7 text-white">Join Gold</span>
            <span className="block text-sm leading-5 text-white/80">Exclusive dining benefits</span>
          </span>
          <ChevronRight className="h-6 w-6 text-[#F5B544] transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
        <ul className="relative mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#26160F]">
          {[
            [Percent, "Member-only deals"],
            [Gift, "Birthday treat"],
            [Star, "Priority service"],
          ].map(([Icon, label]) => {
            const I = Icon as typeof Percent
            return (
              <li key={label as string} className="inline-flex items-center gap-2 rounded-full bg-[#F5B544] px-3 py-2">
                <I className="h-3.5 w-3.5" aria-hidden="true" />
                {label as string}
              </li>
            )
          })}
        </ul>
        <span className="relative mt-4 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-[#E85D16]">Join now</span>
      </Link>
    </section>
  )
}
