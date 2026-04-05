'use client'

import { TrainIllustration } from './TrainIllustration'

export const TrustSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <h2 className="text-4xl sm:text-5xl md:text-[54px] leading-tight font-semibold font-[family-name:var(--font-instrument-sans)]">
            <span className="text-quint-dark">Speed is scaling.</span>
            <br />
            <span className="text-quint-purple">Trust isn&apos;t.</span>
          </h2>

          <div className="rounded-2xl bg-quint-purple/10 px-10 py-8">
            <p className="text-xl sm:text-lg text-quint-dark font-medium font-[family-name:var(--font-inter)]">
              90% of developers use AI to write code. Only 24% trust it a lot. The process that used to generate
              confidence, writing specs, tests, and reviews, is gone. Quint brings it back, without the overhead.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full overflow-hidden">
        <TrainIllustration className="w-full h-auto" />
      </div>
    </section>
  )
}
