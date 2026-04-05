'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { navLinks } from '../utils/links'
import { LinkButton } from './LinkButton'

export const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="relative z-50 w-full bg-gradient-to-b from-white to-[#rgba(255,255,255,0.5)]">
        <div className="mx-auto max-w-8xl px-6 h-25 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/quint-logo-text.svg" alt="Quint" width={150} height={39} />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-quint-dark text-base font-bold tracking-widest hover:opacity-70 transition-opacity font-[family-name:var(--font-inter)]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <LinkButton href="/docs/getting-started" variant="filled" className="hidden lg:inline-flex">
            GET STARTED
          </LinkButton>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-2 bg-white' : 'bg-quint-dark'
              }`}
            />
            <span className={`block w-6 h-0.5 transition-all duration-300 ${isOpen ? 'opacity-0' : 'bg-quint-dark'}`} />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2 bg-white' : 'bg-quint-dark'
              }`}
            />
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-quint-purple/90 backdrop-blur-sm" />
          <nav
            className="relative z-10 flex flex-col items-center justify-center gap-8 h-full"
            onClick={e => e.stopPropagation()}
          >
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setIsOpen(false)}
                className="text-white text-2xl font-bold tracking-widest hover:text-quint-purple transition-colors font-[family-name:var(--font-inter)]"
              >
                {label}
              </Link>
            ))}
            <LinkButton
              href="/docs/getting-started"
              variant="outlined"
              onClick={() => setIsOpen(false)}
              className="mt-4 border-white text-white hover:bg-white hover:!text-quint-dark"
            >
              GET STARTED
            </LinkButton>
          </nav>
        </div>
      )}
    </>
  )
}
