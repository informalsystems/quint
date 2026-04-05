'use client'

import { Code, Pre } from 'nextra/components'
import Link from 'next/link'

import { useState } from 'react'
import CodeSample from './code_sample.mdx'
import ViolationSample from './violation_sample.mdx'

import { Button } from '../atomic-ui-elements/button'
import { NewsletterSignupBanner } from '../NewsletterSignupBanner'
import { HeroSection } from './HeroSection'
import { TrustSection } from './TrustSection'
import { ProjectsGridCompact } from './ProjectsGridCompact'
import { projects } from '../../data/projects'
import { ToolCards } from '../ToolCards'

const components = {
  pre: Pre,
  code: Code,
}

export function Home() {
  const [isViolationVisible, setViolationVisible] = useState(false)

  const handleToggleVisibility = () => {
    setViolationVisible(!isViolationVisible)
  }

  return (
    <div className="overflow-x-hidden home-page">
      <HeroSection />
      <TrustSection />
      <section className="relative">
        <div className="mx-auto max-w-8xl px-4">
          <div className="relative z-20 mx-auto max-w-8xl grid grid-cols-1 py-8 gap-y-4 gap-x-8 lg:mt-8 lg:items-start lg:grid-cols-3 xl:grid-cols-3">
            <div className="xl:col-span-2 text-lg">
              <CodeSample components={components} />
              <div
                className={`transition-all duration-1000 ease-out overflow-hidden ${
                  isViolationVisible ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'
                }`}
              >
                <ViolationSample components={components} />
              </div>
            </div>

            <div className="xl:col-span-1 text-lg relative isolate">
              <h2 className="relative z-10 text-4xl/tight sm:text-4xl/tight font-extrabold tracking-tight xl:mt-24">
                Can you spot the bug? Quint can
              </h2>
              <Button className="mt-8 sm:mt-10" as="button" variant="secondary" onClick={handleToggleVisibility}>
                {isViolationVisible ? 'Hide results' : 'Find bug'}
              </Button>
            </div>
          </div>
          <h2 className="text-4xl text-center font-bold mt-12 leading-tight">
            Quint is <span className="text-quint-purple">ready to use</span>
          </h2>
          <h3 className="text-lg text-center text-zinc-600 dark:text-zinc-300 mt-2">
            The following projects already have Quint specifications
          </h3>
          <h4 className="text-center text-quint-purple">and your project could too</h4>
          <ProjectsGridCompact projects={projects} />

          <div className="mt-6 text-center items-center gap-4">
            <Link
              href="/docs/use-cases"
              className="relative inline-flex items-center gap-3 rounded-xl px-6 py-3 text-base font-semibold
                             text-white shadow-lg transition active:scale-[0.99]
                             bg-gradient-to-r from-quint-purple/50 to-quint-purple
                             hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              Detailed List
            </Link>
          </div>

          <div className="mx-auto max-w-6xl mt-20 mb-8">
            <h2 className="text-4xl text-center font-bold leading-tight">
              Try some <span className="text-quint-purple">tools</span> built for Quint
            </h2>
            <ToolCards />
          </div>

          <NewsletterSignupBanner />
        </div>
      </section>
    </div>
  )
}
