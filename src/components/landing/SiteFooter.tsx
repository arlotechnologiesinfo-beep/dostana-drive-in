import Link from "next/link"
import { Heart } from "lucide-react"
import { HOME_STALLS } from "@/data/home-demo"
import { LEGAL_PAGES } from "@/lib/legal"

const link = "inline-flex min-h-11 items-center text-sm text-white/70 transition-colors hover:text-[#F5B544]"
const head = "text-sm font-semibold uppercase tracking-[0.16em] text-[#F5B544]"

export function SiteFooter() {
  return (
    <footer className="bg-[#26160F] text-white">
      <div className="mx-auto max-w-[1100px] px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="text-2xl font-extrabold tracking-tight">
              DOSTANA <span className="text-[#F4772B]">DRIVE IN</span>
            </p>
            <p className="mt-3 max-w-[32ch] text-sm leading-6 text-white/70">
              Six stalls, one table. Scan, order from every kitchen, pay once and track each dish.
            </p>
          </div>

          <nav aria-label="Stalls">
            <h2 className={head}>Our stalls</h2>
            <ul className="mt-3">
              {HOME_STALLS.map((s) => (
                <li key={s.id}>
                  <Link href="/select-table" className={link}>{s.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Dostana">
            <h2 className={head}>Dostana</h2>
            <ul className="mt-3">
              <li><Link href="#scan-qr" className={link}>Scan your table</Link></li>
              <li><Link href="#stalls" className={link}>Popular stalls</Link></li>
              <li><Link href="#collections" className={link}>Collections</Link></li>
              <li><Link href="/welcome" className={link}>How it works</Link></li>
              <li><Link href="/legal/contact" className={link}>Contact us</Link></li>
            </ul>
          </nav>

          <nav aria-label="For stall owners and staff">
            <h2 className={head}>For partners</h2>
            <ul className="mt-3">
              <li><Link href="/auth/register" className={link}>Add your stall</Link></li>
              <li><Link href="/stall-login" className={link}>Stall manager sign in</Link></li>
              <li><Link href="/auth/login" className={link}>Admin sign in</Link></li>
              <li><Link href="/waiter" className={link}>Waiter desk</Link></li>
            </ul>
          </nav>
        </div>

        <nav aria-label="Legal" className="mt-12 border-t border-white/10 pt-8">
          <h2 className={head}>Legal</h2>
          <ul className="mt-3 flex flex-wrap gap-x-6">
            {LEGAL_PAGES.map((p) => (
              <li key={p.slug}>
                <Link href={`/legal/${p.slug}`} className={link}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Arlo Technologies. All rights reserved. Dostana Drive In.</p>
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 fill-[#EF493B] text-[#EF493B]" aria-hidden="true" /> for food lovers
          </p>
        </div>
        <p className="mt-4 text-xs leading-5 text-white/40">Menus, prices, ratings, offers and photos shown are demo content until approved by each stall. FSSAI licence and GSTIN to be added before launch.</p>
      </div>
    </footer>
  )
}
