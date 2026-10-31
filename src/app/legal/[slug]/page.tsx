import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { SiteFooter } from "@/components/landing/SiteFooter"
import { LEGAL_PAGES, getLegalPage } from "@/lib/legal"

export function generateStaticParams() {
  return LEGAL_PAGES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const page = getLegalPage((await params).slug)
  return { title: page ? `${page.title} | DOSTANA DRIVE IN` : "Not found" }
}

/** Legal page. Pattern: marketing / document. Content is a draft that needs legal review. */
export default async function LegalPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const page = getLegalPage((await params).slug)
  if (!page) notFound()

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#302019]">
      <main className="mx-auto max-w-[780px] px-5 py-10 md:px-8 md:py-16">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#E85D16]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to home
        </Link>
        <h1 className="mt-4 text-[32px] font-extrabold leading-[1.15] text-[#26160F] md:text-[44px]">{page.title}</h1>
        <p className="mt-2 text-base leading-7 text-[#77716D]">{page.summary}</p>
        <p className="mt-4 rounded-2xl bg-[#FFF1D0] px-4 py-3 text-sm leading-6 text-[#7A5A10]">
          Draft for review. This page is a starting point and has not yet been checked by a lawyer.
        </p>
        <div className="mt-8 space-y-8">
          {page.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-bold text-[#26160F]">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p} className="mt-2 max-w-[70ch] text-[15px] leading-7">{p}</p>
              ))}
            </section>
          ))}
        </div>
        <p className="mt-10 text-xs text-[#A39B95]">Last updated: to be set at launch.</p>
      </main>
      <SiteFooter />
    </div>
  )
}
