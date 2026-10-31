import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Leaf, Percent } from "lucide-react"
import { PROMO_DEALS_IMAGE, PROMO_HEALTHY_IMAGE } from "@/data/home-demo"

export function PromoCards({ tableId }: { tableId: string }) {
  return (
    <section aria-label="Promotions">
      <div className="flex snap-x gap-3 overflow-x-auto px-5 md:gap-5 md:px-8 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <article className="relative h-[176px] w-[calc(50%-6px)] min-w-[172px] shrink-0 snap-start overflow-hidden rounded-[22px] bg-[#EAF6E5] md:h-[224px] md:w-[calc(50%-10px)] lg:h-[248px]">
          <Leaf className="absolute right-3 top-3 h-6 w-6 rotate-12 text-[#63B65B]" aria-hidden="true" />
          <div className="absolute -bottom-6 -right-10 h-[124px] w-[124px] overflow-hidden rounded-full shadow-[0_8px_20px_rgba(20,90,37,0.08)] md:-right-8 md:h-[200px] md:w-[200px] lg:h-[230px] lg:w-[230px]">
            <Image src={PROMO_HEALTHY_IMAGE} alt="" fill sizes="124px" className="object-cover" />
          </div>
          <div className="relative flex h-full flex-col justify-between p-4 md:p-7">
            <div>
              <h3 className="text-xl font-extrabold leading-[1.1] text-[#145A25] md:text-[32px]">
                Healthy
                <br />
                Choices
              </h3>
              <p className="mt-2 max-w-[104px] text-xs leading-4 text-[#302019] md:max-w-[220px] md:text-base md:leading-6">Good Food, Better You</p>
            </div>
            <Link
              href={`/table/${tableId}/search`}
              className="inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[#145A25] px-5 text-sm font-semibold text-white"
            >
              Explore
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </article>

        <article className="relative h-[176px] w-[calc(50%-6px)] min-w-[172px] shrink-0 snap-start overflow-hidden rounded-[22px] bg-[#FCE8E7] md:h-[224px] md:w-[calc(50%-10px)] lg:h-[248px]">
          <span className="absolute right-3 top-3 flex h-8 w-8 rotate-12 items-center justify-center rounded-lg bg-[#EF493B]" aria-hidden="true">
            <Percent className="h-4 w-4 text-white" />
          </span>
          <div className="absolute -bottom-6 -right-10 h-[124px] w-[124px] overflow-hidden rounded-full shadow-[0_8px_20px_rgba(239,73,59,0.08)] md:-right-8 md:h-[200px] md:w-[200px] lg:h-[230px] lg:w-[230px]">
            <Image src={PROMO_DEALS_IMAGE} alt="" fill sizes="124px" className="object-cover" />
          </div>
          <div className="relative flex h-full flex-col justify-between p-4 md:p-7">
            <div>
              <h3 className="text-xl font-extrabold leading-[1.1] text-[#EF493B] md:text-[32px]">
                Exclusive
                <br />
                Deals
              </h3>
              <p className="mt-2 max-w-[104px] text-xs leading-4 text-[#302019] md:max-w-[220px] md:text-base md:leading-6">Delicious Food at Great Prices</p>
            </div>
            <Link
              href={`/table/${tableId}/rewards`}
              className="inline-flex h-11 w-fit items-center gap-2 rounded-full bg-[#EF493B] px-5 text-sm font-semibold text-white"
            >
              View Offers
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}
