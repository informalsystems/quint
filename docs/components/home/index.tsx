'use client'

import { HeroSection } from './HeroSection'
import { TrustSection } from './TrustSection'
import { ProductSection } from './ProductSection'
import { AuditsSection } from './AuditsSection'

export function Home() {
  return (
    <div className="overflow-x-hidden home-page">
      <HeroSection />
      <TrustSection />
      <ProductSection />
      <AuditsSection />
    </div>
  )
}
