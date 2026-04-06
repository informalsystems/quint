'use client'

import Link from 'next/link'
import Image from 'next/image'
import { footerLinks, socialLinks } from '../utils/links'
import { LinkButton } from './LinkButton'

export const CustomFooter = () => {
  return (
    <footer className="w-full">
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

      <div className="bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 max-w-[194px]">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/quint-logo-text.svg" alt="Quint" width={200} height={51} />
              </Link>
              <p className="mt-6 text-base text-quint-dark dark:text-gray-400 font-[family-name:var(--font-inter)]">
                A modern and executable specification language
              </p>
              <div className="mt-6 flex items-center gap-4">
                {socialLinks.map(({ label, path, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-quint-purple dark:text-gray-300 hover:text-quint-dark transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path d={path} fill="currentColor" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="text-base font-semibold tracking-widest text-quint-dark dark:text-white mb-4 font-[family-name:var(--font-inter)]">
                    {category.toUpperCase()}
                  </h3>
                  <ul className="space-y-5">
                    {links.map(({ label, href }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          className="text-base text-quint-dark dark:text-gray-400 hover:text-quint-purple dark:hover:text-quint-purple transition-colors font-[family-name:var(--font-inter)]"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-quint-dark text-white">
        <div className="mx-auto max-w-7xl px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-[family-name:var(--font-inter)]">
          <p>&copy; {new Date().getFullYear()} Quint. All rights reserved.</p>
          <div className="flex items-center gap-1 text-sm">
            <a href="/docs/terms" className="hover:underline">
              Terms &amp; Conditions
            </a>
            <span>|</span>
            <a
              href="https://www.iubenda.com/privacy-policy/80583341"
              className="hover:underline"
              data-iub-container={true}
            >
              Privacy Policy
            </a>
            <span>|</span>
            <a href="/docs/disclaimer" className="hover:underline">
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
