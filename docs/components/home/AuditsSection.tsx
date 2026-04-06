'use client'

import Image from 'next/image'
import { LinkButton } from '../LinkButton'

export const AuditsSection = () => {
  return (
    <>
      <section className="relative bg-[url('/bg-audits.png')] bg-cover bg-center bg-no-repeat">
        <div className="mx-auto max-w-7xl px-6 pt-30 pb-30">
          <h2 className="text-4xl sm:text-5xl md:text-[54px] leading-tight font-semibold font-[family-name:var(--font-instrument-sans)]">
            <span className="text-quint-dark">We don&apos;t just build Quint. </span>
            <span className="text-quint-purple">We use it.</span>
          </h2>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3 max-w-[712px]">
              <p className="text-xl text-quint-dark font-[family-name:var(--font-inter)]">
                We offer Quint integration services, using Quint to audit the behavioral correctness of your critical
                system from design through implementation.
              </p>
              <div className="mt-8">
                <LinkButton href="/docs/contact" variant="filled">
                  LET&apos;S TALK AUDITS
                </LinkButton>
              </div>
            </div>

            <div className="lg:col-span-2 relative">
              <div className="lg:absolute lg:top-0 xl:top-[-25%] lg:rigth-0 xl:right-[-15%] xl:w-[120%]">
                <Image
                  src="/quint-audit.png"
                  alt="Quint audits and integration services"
                  width={550}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="hidden lg:block bg-white h-48" />
    </>
  )
}
