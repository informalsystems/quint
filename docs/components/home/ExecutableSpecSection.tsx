'use client'

import { SpecIllustration } from './SpecIllustration'

export const ExecutableSpecSection = () => {
  return (
    <section className="relative bg-[url('/bg-executable-spec.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:py-30">
        <SpecIllustration className="w-full h-auto" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-10 lg:pb-30">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl md:text-[54px] leading-tight font-semibold font-[family-name:var(--font-instrument-sans)]">
            <span className="text-quint-purple">How Quint Works:</span>
            <br />
            <span className="text-quint-dark">The Executable Spec</span>
          </h2>
          <p className="mt-8 text-lg sm:text-xl text-quint-dark font-[family-name:var(--font-inter)] max-w-3xl mx-auto">
            One Quint spec connects your intent to your code, your tests, and your runtime. A confidence infrastructure
            from one holistic artifact.
          </p>
        </div>
      </div>
    </section>
  )
}
