import { Heart } from "lucide-react"

export function MadeWithLove() {
  return (
    <footer className="px-5 pb-2 text-center md:px-8">
      <p className="mx-auto inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-full bg-gradient-to-r from-[#FFE7D6] to-[#FCE8E7] px-5 py-3 text-sm font-semibold text-[#26160F] shadow-[0_4px_16px_rgba(244,119,43,0.08)]">
        <span>Made with</span>
        <Heart className="h-4 w-4 shrink-0 fill-[#EF493B] text-[#EF493B]" aria-hidden="true" />
        <span>
          for food lovers by <span className="text-[#E85D16]">Arlo Technologies</span>
        </span>
      </p>
      <p className="mt-3 text-xs leading-4 text-[#A39B95]">Demo menu: stalls, prices, ratings and photos are samples.</p>
    </footer>
  )
}
