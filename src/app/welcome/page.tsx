"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChefHat } from "lucide-react"

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`

const SLIDES = [
  {
    title: "Multiple Stalls\nOne Experience",
    text: "Explore a variety of cuisines from top stalls at your table.",
    image: img("1512621776951-a57141f2eefd"),
  },
  {
    title: "Delicious Food\nat Your Table",
    text: "Order from multiple stalls and enjoy together.",
    image: img("1568901346375-23c9450c58cd"),
  },
  {
    title: "Easy Ordering\nHappier Dining",
    text: "Quick, seamless and contactless dining experience.",
    image: img("1563379091339-03b21ab4a4f8"),
  },
]

/** Splash and three onboarding slides. Pattern 3, Form (wizard). */
export default function WelcomePage() {
  const [step, setStep] = useState(0) // 0 = splash, 1..3 = slides
  const slide = SLIDES[step - 1]

  if (step === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFF9F2] px-6 text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#F4772B] shadow-[0_16px_40px_rgba(244,119,43,0.4)]">
          <ChefHat className="h-12 w-12 text-white" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-[34px] font-extrabold leading-9 tracking-tight text-[#26160F]">
          DOSTANA <span className="text-[#F4772B]">DRIVE IN</span>
        </h1>
        <p className="mt-1 text-sm text-[#77716D]">Multi-Stall Dining</p>
        <p className="mt-8 text-xl font-semibold leading-8 text-[#E85D16]">
          Good Food
          <br />
          Great Moments
          <br />
          One Table
        </p>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="mt-10 h-[52px] w-full max-w-[320px] rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16]"
        >
          Get Started
        </button>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#FFF9F2] px-6 pb-10 pt-[max(env(safe-area-inset-top),16px)]">
      <div className="flex w-full max-w-[430px] justify-end">
        <Link href="/select-table" className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-[#77716D]">
          Skip
        </Link>
      </div>

      <div className="flex w-full max-w-[430px] flex-1 flex-col items-center justify-center text-center md:max-w-[520px]">
        <div className="relative h-[300px] w-[260px] overflow-hidden rounded-[48%_52%_46%_54%/52%_46%_54%_48%] bg-[#FFE7D6] shadow-[0_20px_48px_rgba(48,32,25,0.15)] md:h-[360px] md:w-[320px]">
          <Image src={slide.image} alt="" fill priority sizes="320px" className="object-cover" />
        </div>
        <h1 className="mt-8 whitespace-pre-line text-[28px] font-extrabold leading-9 text-[#26160F] md:text-4xl md:leading-[1.2]">{slide.title}</h1>
        <p className="mt-3 max-w-[30ch] text-sm leading-6 text-[#77716D]">{slide.text}</p>

        <div className="mt-6 flex items-center gap-2" role="group" aria-label={`Step ${step} of 3`}>
          {SLIDES.map((_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${i + 1 === step ? "w-6 bg-[#F4772B]" : "w-2 bg-[#F1E7DE]"}`} aria-hidden="true" />
          ))}
        </div>
      </div>

      <div className="w-full max-w-[430px] md:max-w-[520px]">
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="h-[52px] w-full rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16]"
          >
            Next
          </button>
        ) : (
          <Link
            href="/select-table"
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-[#F4772B] text-[15px] font-semibold text-white transition-colors hover:bg-[#E85D16]"
          >
            Get Started
          </Link>
        )}
      </div>
    </main>
  )
}
