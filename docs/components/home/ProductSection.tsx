'use client'

import Image from 'next/image'
import { LinkButton } from '../LinkButton'

const products = [
  {
    title: 'Quint Studio',
    description:
      'Capture your intent as executable, high-level system descriptions with verifiable properties. Validate behavior during design, carry it into testing, and surface mismatches in production.',
    image: '/quint-studio.png',
    cta: { label: 'JOIN THE WAITLIST', href: '/docs/contact' },
    ctaVariant: 'filled' as const,
  },
  {
    title: 'Quint Language',
    description:
      'The Quint language and core tooling are open source. A powerful foundation for writing executable specs, modeling and verifying behaviors, and building Quint into your own tooling.',
    image: '/quint-language.png',
    cta: { label: 'GET STARTED', href: '/docs/getting-started' },
    ctaVariant: 'filled' as const,
  },
]

export const ProductSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-18 pb-24">
        <h2 className="text-4xl sm:text-5xl md:text-[54px] leading-tight font-semibold font-[family-name:var(--font-instrument-sans)]">
          <span className="text-quint-dark">One Product. </span>
          <span className="text-quint-purple">Continued Confidence.</span>
        </h2>
        <p className="mt-3 text-xl text-quint-dark font-[family-name:var(--font-inter)]">
          From design to production, Quint Studio makes system behavior the backbone of your software process.
        </p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {products.map(product => (
            <div key={product.title}>
              <Image src={product.image} alt={product.title} width={600} height={360} className="w-full h-auto" />
              <h3 className="mt-11 text-3xl sm:text-[40px] font-semibold text-quint-purple font-[family-name:var(--font-instrument-sans)]">
                {product.title}
              </h3>
              <p className="mt-4 text-xl text-quint-dark font-[family-name:var(--font-inter)]">{product.description}</p>
              <div className="mt-[30px]">
                <LinkButton href={product.cta.href} variant={product.ctaVariant}>
                  {product.cta.label}
                </LinkButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
