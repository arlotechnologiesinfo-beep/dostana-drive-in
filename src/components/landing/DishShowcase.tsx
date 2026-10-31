import { DishMarquee } from "@/components/landing/DishMarquee"

/** "What are you craving?" strip right under the hero: a slow, endless row of dishes you can order from your table. */
export function DishShowcase() {
  return (
    <section aria-labelledby="craving-title" className="relative overflow-hidden bg-gradient-to-b from-[#FFF4EA] to-white pb-6 pt-14 md:pt-20">
      <div className="mx-auto max-w-[1100px] px-5 text-center md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85D16]">Fresh from six stalls</p>
        <h2 id="craving-title" className="mt-2 text-[30px] font-extrabold leading-[1.1] text-[#26160F] md:text-[48px]">
          What are you craving today?
        </h2>
        <p className="mx-auto mt-3 max-w-[40ch] text-base leading-7 text-[#77716D] md:text-lg">
          Pick your table to order any of these in one go. Hover or touch the row to pause it.
        </p>
      </div>
      <div className="mt-10">
        <DishMarquee size={{ base: 150, wide: 210 }} seconds={80} rounded="rounded-[26px] md:rounded-[32px]" />
      </div>
      <p className="mt-2 px-5 text-center text-xs text-[#A39B95]">Demo content: dishes shown are examples, not each stall&apos;s live menu.</p>
    </section>
  )
}
