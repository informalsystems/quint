'use client'

import { HeroSection } from './HeroSection'
import { TrustSection } from './TrustSection'
import { ProductSection } from './ProductSection'
import { AuditsSection } from './AuditsSection'
import { TeamsSection } from './TeamsSection'
import { TestimonialsSection } from './TestimonialsSection'
import { AsSeenOnSection } from './AsSeenOnSection'

export function Home() {
  return (
    <div className="overflow-x-hidden home-page">
      <HeroSection />
      <TrustSection />
      <ProductSection />
      <AuditsSection />
      <TeamsSection />
      <TestimonialsSection />
      <AsSeenOnSection />
    </div>
  )
}
