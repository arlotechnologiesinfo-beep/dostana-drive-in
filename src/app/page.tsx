import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"
import { HeroStagger, ParallaxImage, ScrollProgress, Stagger, StaggerItem } from "@/components/landing/Motion"
import { ParallaxHero, Reveal } from "@/components/landing/Parallax"
import { DishShowcase } from "@/components/landing/DishShowcase"
import { FaqSection, CtaBand } from "@/components/landing/FaqCta"
import { FeaturesSection, StatsSection } from "@/components/landing/Sections"
import { GoldSection } from "@/components/landing/GoldSection"
import { SiteFooter } from "@/components/landing/SiteFooter"
import { StartTableCard } from "@/components/landing/StartTableCard"
import { TableEntryForm } from "@/components/landing/TableEntryForm"
import { HOME_DISHES, HOME_STALLS } from "@/data/home-demo"
import { CATALOG, getStallMenu } from "@/lib/catalog"

const img = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const ACTION_CARDS = [
  {
    title: "Order at Your Table",
    text: "Scan the QR on your table and order from every stall with one cart.",
    image: img("1631515243349-e0cb75fb8d3a"),
    href: "#scan-qr",
  },
  {
    title: "Explore Stalls",
    text: "Six kitchens under one roof, from biryani and tiffins to chai and shakes.",
    image: img("1512621776951-a57141f2eefd"),
    href: "#stalls",
  },
  {
    title: "Offers and Combos",
    text: "Flat discounts and combos from today's stalls, ready at your table.",
    image: img("1621996346565-e3dbc646d9a9"),
    href: "#collections",
  },
]

const COLLECTIONS = [
  { title: "Biryani Favourites", stallIds: ["aroma-biryani"], image: img("1563379091339-03b21ab4a4f8", 600) },
  { title: "South Indian Breakfast", stallIds: ["nani-tiffins"], image: img("1630383249896-424e482df921", 600) },
  { title: "North Indian Classics", stallIds: ["dills-dlite"], image: img("1585937421612-70a008356fbe", 600) },
  { title: "Chai and Snacks", stallIds: ["tea-time", "talks-tonic"], image: img("1556679343-c7306c1976bc", 600) },
  { title: "Sweet Endings", stallIds: ["cool-point"], image: img("1551024601-bec78aea704b", 600) },
]

const NAV_LINKS = [
  { href: "#stalls", label: "Stalls" },
  { href: "#collections", label: "Collections" },
  { href: "/auth/register", label: "Add your stall" },
  { href: "/auth/login", label: "Log in" },
]

const CUISINES = ["Biryani", "South Indian", "North Indian", "Chinese", "Pizza", "Burgers", "Desserts", "Tea", "Shakes"]

export default function LandingPage() {
  const dishNames = Array.from(new Set([...HOME_DISHES.map((d) => d.name), ...CATALOG.filter((i) => i.bestseller).map((i) => i.name)])).slice(0, 12)

  return (
    <div className="min-h-screen bg-white text-[#302019]">
      <ScrollProgress />
      {/* Hero */}
      <ParallaxHero nav={
        <nav aria-label="Primary" className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-4 md:px-8 md:py-6">
          <Link href="/" className="inline-flex min-h-11 min-w-11 items-center text-lg font-extrabold tracking-tight text-white md:hidden">
            DOSTANA
          </Link>
          <span className="hidden md:block" aria-hidden="true" />
          <ul className="flex items-center gap-1 text-sm font-medium text-white md:gap-6 md:text-base">
            {NAV_LINKS.map((l, i) => (
              <li key={l.href} className={i < 2 ? "hidden md:block" : ""}>
                <Link href={l.href} className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 hover:text-[#FFB84D]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      }>

        <HeroStagger className="mx-auto flex w-full max-w-[920px] flex-col items-center px-5 pb-12 pt-10 text-center lg:pb-0 lg:pt-0">
          <StaggerItem><p className="inline-flex items-center gap-2 rounded-full border border-[#F5B544]/60 bg-[#F5B544]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#F5B544] lg:bg-black/30">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5B544]" aria-hidden="true" />
            Dine in &middot; Six stalls &middot; One table
          </p></StaggerItem>
          <StaggerItem><h1 className="mt-5 text-[44px] font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-[84px]">
            DOSTANA
            <span className="mt-1 block text-[#F4772B] lg:mt-2">
              DRIVE IN
            </span>
          </h1></StaggerItem>
          <StaggerItem><span className="mt-5 block h-1 w-20 rounded-full bg-[#F4772B]" aria-hidden="true" /></StaggerItem>
          <StaggerItem><p className="mt-5 max-w-[26ch] text-lg font-medium leading-7 text-white/90 sm:max-w-[34ch] lg:max-w-none lg:text-[26px] lg:leading-9">
            Discover the best food from six stalls, served right at your table
          </p></StaggerItem>

          <StaggerItem className="mt-8 w-full max-w-[640px] lg:mt-9"><div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-3 lg:bg-black/30 lg:p-4">
              <TableEntryForm id="hero-table" variant="hero" buttonLabel="Start ordering" />
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-white/85">
              <Search className="h-4 w-4" aria-hidden="true" />
              Or scan the QR code on your table to begin.
            </p>
          </div></StaggerItem>
        </HeroStagger>
      </ParallaxHero>

      <DishShowcase />
      <StatsSection />
      <FeaturesSection />
      <GoldSection />

      <main>
        {/* Action cards */}
        <Reveal><section aria-label="Ways to order" className="mx-auto max-w-[1100px] px-5 pt-10 md:px-8 md:pt-14">
          <Stagger as="ul" className="grid gap-4 sm:grid-cols-3 md:gap-6">
            {ACTION_CARDS.map((c) => (
              <StaggerItem as="li" lift key={c.title}>
                <Link
                  href={c.href}
                  className="group block overflow-hidden rounded-2xl border border-[#F1E7DE] bg-white shadow-[0_6px_24px_rgba(48,32,25,0.06)] transition-shadow hover:shadow-[0_12px_32px_rgba(48,32,25,0.08)]"
                >
                  <span className="relative block h-[150px] overflow-hidden md:h-[190px]">
                    <ParallaxImage src={c.image} sizes="(max-width: 640px) 100vw, 340px" className="transition-transform duration-300 group-hover:scale-105" />
                  </span>
                  <span className="block p-4 md:p-5">
                    <span className="block text-xl font-bold text-[#26160F]">{c.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#77716D]">{c.text}</span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section></Reveal>

        {/* Collections */}
        <Reveal><section id="collections" aria-labelledby="collections-title" className="mx-auto max-w-[1100px] scroll-mt-6 px-5 pt-12 md:px-8 md:pt-16">
          <h2 id="collections-title" className="text-[28px] font-bold leading-9 text-[#26160F] md:text-[34px]">Collections</h2>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
            <p className="max-w-[60ch] text-base leading-6 text-[#77716D]">
              Explore curated lists of the best dishes at Dostana Drive In, based on what diners order most.
            </p>
            <Link href="#stalls" className="inline-flex min-h-11 items-center gap-1 text-base font-medium text-[#F4772B] hover:text-[#E85D16]">
              All stalls <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <Stagger as="ul" className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-5 md:gap-4 md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {COLLECTIONS.map((c) => {
              const count = c.stallIds.reduce((n, id) => n + getStallMenu(id).length, 0)
              return (
                <StaggerItem as="li" lift key={c.title} className="w-[220px] shrink-0 snap-start md:w-auto">
                  <Link href={`/select-table`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-[#FFF1E5]">
                    <ParallaxImage src={c.image} sizes="(max-width: 768px) 220px, 210px" className="transition-transform duration-300 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#26160F]/85 via-[#26160F]/10 to-transparent" aria-hidden="true" />
                    <span className="absolute inset-x-0 bottom-0 block p-4 text-white">
                      <span className="block text-lg font-bold leading-6">{c.title}</span>
                      <span className="mt-0.5 flex items-center gap-1 text-sm text-white/90">
                        {count > 0 ? `${count} dishes` : "Menu coming soon"} <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </StaggerItem>
              )
            })}
          </Stagger>
        </section></Reveal>

        {/* Popular stalls */}
        <Reveal><section id="stalls" aria-labelledby="stalls-title" className="mx-auto max-w-[1100px] scroll-mt-6 px-5 pt-12 md:px-8 md:pt-16">
          <h2 id="stalls-title" className="text-[28px] font-bold leading-9 text-[#26160F] md:text-[34px]">Popular stalls at Dostana Drive In</h2>
          <Stagger as="ul" className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
            {HOME_STALLS.map((s) => (
              <StaggerItem as="li" lift key={s.id}>
                <Link
                  href="/select-table"
                  className="flex min-h-[72px] items-center justify-between gap-3 rounded-2xl border border-[#F1E7DE] bg-white px-5 py-3 transition-shadow hover:shadow-[0_8px_24px_rgba(48,32,25,0.08)]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-base font-semibold text-[#26160F]">{s.name}</span>
                    <span className="block truncate text-sm text-[#77716D]">
                      {getStallMenu(s.id).length} dishes · {s.prep}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[#77716D]" aria-hidden="true" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-3 text-xs text-[#A39B95]">Demo content: dish counts, prep times and ratings are samples.</p>
        </section></Reveal>

        <StartTableCard />

        {/* Explore options */}
        <section aria-labelledby="explore-title" className="mx-auto max-w-[1100px] px-5 py-12 md:px-8 md:py-16">
          <h2 id="explore-title" className="text-[28px] font-bold leading-9 text-[#26160F] md:text-[34px]">Explore options at Dostana Drive In</h2>
          <div className="mt-5 space-y-3">
            <details className="group rounded-2xl border border-[#F1E7DE] bg-white">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 text-base font-semibold text-[#26160F]">
                Popular cuisines
                <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" aria-hidden="true" />
              </summary>
              <ul className="flex flex-wrap gap-2 px-5 pb-5">
                {CUISINES.map((c) => (
                  <li key={c} className="rounded-full border border-[#F1E7DE] px-4 py-2 text-sm text-[#302019]">{c}</li>
                ))}
              </ul>
            </details>
            <details className="group rounded-2xl border border-[#F1E7DE] bg-white">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 text-base font-semibold text-[#26160F]">
                Popular dishes
                <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" aria-hidden="true" />
              </summary>
              <ul className="flex flex-wrap gap-2 px-5 pb-5">
                {dishNames.map((d) => (
                  <li key={d} className="rounded-full border border-[#F1E7DE] px-4 py-2 text-sm text-[#302019]">{d}</li>
                ))}
              </ul>
            </details>
            <details className="group rounded-2xl border border-[#F1E7DE] bg-white">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 text-base font-semibold text-[#26160F]">
                Need help at your table?
                <ChevronRight className="h-5 w-5 transition-transform group-open:rotate-90" aria-hidden="true" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-6 text-[#77716D]">
                Once you open your table you can call a waiter, ask for water or the bill, and request cleaning from the Call waiter option on the home screen.
              </p>
            </details>
          </div>
        </section>
        <FaqSection />
        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  )
}
