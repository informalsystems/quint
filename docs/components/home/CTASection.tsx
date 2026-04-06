'use client'

import Image from 'next/image'
import { LinkButton } from '../LinkButton'

export const CTASection = () => {
  return (
    <div className="relative overflow-hidden bg-[url('/bg-footer.png')] bg-cover bg-center bg-no-repeat">
      <div className="relative mx-auto max-w-6xl px-6 py-30 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-[56px] font-semibold text-quint-dark font-[family-name:var(--font-instrument-sans)]">
          Ready to ship with <span className="text-quint-purple">confidence?</span>
        </h2>
        <p className="mt-[10px] text-base sm:text-lg text-quint-dark max-w-md mx-auto font-[family-name:var(--font-inter)]">
          Join the engineering teams using Quint to ship AI-generated code they can actually stand behind.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <LinkButton href="/docs/getting-started" variant="outlined">
            GET STARTED
          </LinkButton>
          <LinkButton href="/docs/contact" variant="filled">
            TALK TO US
          </LinkButton>
        </div>
      </div>

      <div className="absolute bottom-[-28px] z-0 overflow-visible left-4 sm:left-12 lg:left-24 w-40 sm:w-52 lg:w-60">
        <Image src="/quint-footer.png" alt="Quint robot mascot" width={196} height={222} className="w-full h-auto" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-quint-dark" />
    </div>
  )
}
