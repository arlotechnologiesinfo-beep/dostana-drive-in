import Image from "next/image"
import Link from "next/link"
import { ChevronRight, QrCode, Search, Smartphone } from "lucide-react"
import { FloatingFoodFrame, ParallaxHero, Reveal } from "@/components/landing/Parallax"
import { QrIllustration } from "@/components/landing/QrIllustration"
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
      {/* Hero */}
      <ParallaxHero background={img("1504674900247-0877df9cc836", 1800)}>

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

        <div className="mx-auto flex max-w-[1100px] flex-col items-center px-5 pb-16 pt-6 text-center md:pb-24 md:pt-10">
          <h1 className="text-[34px] font-extrabold leading-none tracking-tight text-white sm:text-5xl md:text-[64px]">
            DOSTANA <span className="text-[#F4772B]">DRIVE IN</span>
          </h1>
          <p className="mt-5 max-w-[22ch] text-xl font-semibold leading-8 text-white sm:max-w-none md:mt-7 md:text-[32px] md:leading-10">
            Discover the best food from six stalls at your table
          </p>

          <div className="mt-7 w-full max-w-[760px] md:mt-9">
            <TableEntryForm id="hero-table" variant="hero" buttonLabel="Start ordering" />
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-white/85">
              <Search className="h-4 w-4" aria-hidden="true" />
              Or scan the QR code on your table to begin.
            </p>
          </div>
        </div>
      </ParallaxHero>

      <main>
        {/* Action cards */}
        <Reveal><section aria-label="Ways to order" className="mx-auto max-w-[1100px] px-5 pt-10 md:px-8 md:pt-14">
          <ul className="grid gap-4 sm:grid-cols-3 md:gap-6">
            {ACTION_CARDS.map((c) => (
              <li key={c.title}>
                <Link
                  href={c.href}
                  className="group block overflow-hidden rounded-2xl border border-[#F1E7DE] bg-white shadow-[0_6px_24px_rgba(48,32,25,0.06)] transition-shadow hover:shadow-[0_12px_32px_rgba(48,32,25,0.08)]"
                >
                  <span className="relative block h-[150px] overflow-hidden md:h-[190px]">
                    <Image src={c.image} alt="" fill sizes="(max-width: 640px) 100vw, 340px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  </span>
                  <span className="block p-4 md:p-5">
                    <span className="block text-xl font-bold text-[#26160F]">{c.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-[#77716D]">{c.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
          <ul className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:grid md:grid-cols-5 md:gap-4 md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {COLLECTIONS.map((c) => {
              const count = c.stallIds.reduce((n, id) => n + getStallMenu(id).length, 0)
              return (
                <li key={c.title} className="w-[220px] shrink-0 snap-start md:w-auto">
                  <Link href={`/select-table`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-[#FFF1E5]">
                    <Image src={c.image} alt="" fill sizes="(max-width: 768px) 220px, 210px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#26160F]/85 via-[#26160F]/10 to-transparent" aria-hidden="true" />
                    <span className="absolute inset-x-0 bottom-0 block p-4 text-white">
                      <span className="block text-lg font-bold leading-6">{c.title}</span>
                      <span className="mt-0.5 flex items-center gap-1 text-sm text-white/90">
                        {count > 0 ? `${count} dishes` : "Menu coming soon"} <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section></Reveal>

        {/* Popular stalls */}
        <Reveal><section id="stalls" aria-labelledby="stalls-title" className="mx-auto max-w-[1100px] scroll-mt-6 px-5 pt-12 md:px-8 md:pt-16">
          <h2 id="stalls-title" className="text-[28px] font-bold leading-9 text-[#26160F] md:text-[34px]">Popular stalls at Dostana Drive In</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
            {HOME_STALLS.map((s) => (
              <li key={s.id}>
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
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[#A39B95]">Demo content: dish counts, prep times and ratings are samples.</p>
        </section></Reveal>

        {/* Scan the QR (in place of "Get the app") */}
        <section id="scan-qr" aria-labelledby="scan-title" className="mt-14 bg-[#FFF4EA] py-12 md:mt-20 md:py-16">
          <div className="mx-auto grid max-w-[1100px] items-center gap-10 px-5 md:grid-cols-2 md:gap-14 md:px-8">
            <FloatingFoodFrame>
              <div className="absolute -inset-4 rounded-[40px] bg-[#FFE7D6]" aria-hidden="true" />
              <div className="relative rounded-[32px] border-[6px] border-[#26160F] bg-white p-6 shadow-[0_24px_48px_rgba(38,22,15,0.08)]">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E85D16]">
                  <QrCode className="h-4 w-4" aria-hidden="true" /> Table 12
                </p>
                <QrIllustration className="mx-auto mt-3 h-auto w-full max-w-[240px]" />
                <p className="mt-4 text-center text-base font-bold text-[#26160F]">Scan to order</p>
                <p className="text-center text-xs text-[#77716D]">Sample graphic. Every table has its own printed QR.</p>
              </div>
            </FloatingFoodFrame>

            <div>
              <h2 id="scan-title" className="text-[30px] font-bold leading-10 text-[#26160F] md:text-[40px] md:leading-[1.15]">
                Scan the QR at your table
              </h2>
              <p className="mt-3 max-w-[48ch] text-base leading-7 text-[#77716D]">
                Every table has its own QR code. Scan it with your phone camera to open your table and order from all six stalls. No app to download.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-[#302019]">
                {["Scan the QR on your table", "Add dishes from any stall to one cart", "Pay at the table or by UPI and track each stall's order"].map((t, i) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F4772B] text-xs font-bold text-white">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-7 max-w-[520px] rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(48,32,25,0.08)]">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#26160F]">
                  <Smartphone className="h-4 w-4 text-[#F4772B]" aria-hidden="true" />
                  Can&apos;t scan? Enter your table number
                </p>
                <TableEntryForm id="scan-table" buttonLabel="Go to table" />
              </div>
            </div>
          </div>
        </section>

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
      </main>

      <footer className="bg-[#FFF4EA]">
        <div className="mx-auto max-w-[1100px] px-5 py-10 md:px-8 md:py-14">
          <p className="text-2xl font-extrabold tracking-tight text-[#26160F]">
            DOSTANA <span className="text-[#F4772B]">DRIVE IN</span>
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <nav aria-label="Dine in">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#26160F]">Dine in</h2>
              <ul className="mt-3 space-y-1 text-sm text-[#77716D]">
                <li><Link href="#stalls" className="inline-flex min-h-11 items-center hover:text-[#E85D16]">Stalls</Link></li>
                <li><Link href="#collections" className="inline-flex min-h-11 items-center hover:text-[#E85D16]">Collections</Link></li>
                <li><Link href="#scan-qr" className="inline-flex min-h-11 items-center hover:text-[#E85D16]">Scan your table</Link></li>
              </ul>
            </nav>
            <nav aria-label="For stall owners">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#26160F]">For stall owners</h2>
              <ul className="mt-3 space-y-1 text-sm text-[#77716D]">
                <li><Link href="/auth/register" className="inline-flex min-h-11 items-center hover:text-[#E85D16]">Add your stall</Link></li>
                <li><Link href="/auth/login" className="inline-flex min-h-11 items-center hover:text-[#E85D16]">Stall log in</Link></li>
              </ul>
            </nav>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#26160F]">At the table</h2>
              <p className="mt-3 text-sm leading-6 text-[#77716D]">Ask any waiter if you need help with your table code or your order.</p>
            </div>
          </div>
          <p className="mt-10 border-t border-[#F1E7DE] pt-6 text-xs text-[#A39B95]">© 2026 Arlo Technologies. Dostana Drive In.</p>
        </div>
      </footer>
    </div>
  )
}
