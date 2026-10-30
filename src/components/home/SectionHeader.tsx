import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between px-5 md:px-8 lg:px-10">
      <h2 className="text-[22px] font-extrabold leading-8 md:text-[28px] md:leading-10 text-[#26160F]">{title}</h2>
      <Link
        href={href}
        className="flex min-h-11 items-center gap-1 text-sm font-medium text-[#77716D] hover:text-[#E85D16]"
      >
        See All
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  )
}
