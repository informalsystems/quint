'use client'

import { LinkButton } from '../LinkButton'

const terminalLines = [
  { prompt: true, text: 'quint verify token_auth.qnt' },
  { prompt: false, text: '  --invariant no_expired_sessions' },
  { prompt: false, text: '' },
  { label: 'ok', text: 'on 14,208 states', type: 'success' as const },
  { prompt: false, text: '  ├─ Sessions expire after TTL ', badge: 'pass' as const },
  { prompt: false, text: '  ├─ Refresh tokens single-use ', badge: 'pass' as const },
  { prompt: false, text: '  └─ No token reuse after revoke ', badge: 'pass' as const },
  { prompt: false, text: '' },
  { prompt: true, text: 'quint verify rbac.qnt' },
  { prompt: false, text: '  --invariant no_privilege_escalation' },
  { prompt: false, text: '' },
  { label: 'violation', text: '', type: 'error' as const },
  { prompt: false, text: '  found at depth 4' },
  { prompt: false, text: '  state: Approve(alice, alice)' },
  { prompt: false, text: '  result:' },
  { prompt: false, text: '    alice.role → admin', highlight: true },
  { prompt: false, text: '    (self-approved)', highlight: true },
  { prompt: false, text: '  trace: → view counterexample', link: true },
  { prompt: false, text: '' },
  { prompt: true, text: 'quint verify rbac.qnt' },
  { prompt: false, text: '  --update "approver ≠ requester"' },
  { prompt: false, text: '' },
  { label: 'ok', text: '', type: 'success' as const },
  { prompt: false, text: '  applying guard...' },
  { label: 'ok', text: '', type: 'success' as const },
  { prompt: false, text: '  11,437 states — no escalation' },
]

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[url('/bg-home-hero.png')] bg-cover bg-center bg-no-repeat">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-[54px] leading-tight font-semibold text-quint-dark font-[family-name:var(--font-instrument-sans)]">
              AI Generates Code.
            </h1>
            <h2 className="text-4xl sm:text-5xl md:text-[54px] leading-tight font-semibold text-quint-dark/40 font-[family-name:var(--font-instrument-sans)]">
              Quint Generates Confidence.
            </h2>
            <p className="mt-8 text-[20px] font-medium text-quint-dark max-w-2xl font-[family-name:var(--font-inter)]">
              Software teams are shipping faster than ever. But speed without evidence isn&apos;t progress. Quint is the
              executable spec that turns your system&apos;s intended behavior into checkable, verifiable evidence.
            </p>
            <div className="mt-13 flex flex-wrap items-center gap-4">
              <LinkButton href="/docs/getting-started" variant="outlined">
                GET STARTED
              </LinkButton>
              <LinkButton href="/docs" variant="filled">
                VIEW DOCS
              </LinkButton>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-[#1a1a2e] rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#252540]">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-4 text-xs text-gray-400 font-mono">quint — bash</span>
              </div>
              <div className="px-5 py-4 font-mono text-sm leading-relaxed text-gray-300 max-h-[480px] overflow-y-auto">
                {terminalLines.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {'label' in line && line.label ? (
                      <span>
                        <span className="text-gray-500">quint</span> <span className="text-gray-500">✓</span>{' '}
                        <span
                          className={line.type === 'success' ? 'text-green-400 font-bold' : 'text-orange-400 font-bold'}
                        >
                          {line.label === 'ok' ? 'ok' : '✗ violation'}
                        </span>
                        {line.text && <span className="text-gray-400"> {line.text}</span>}
                      </span>
                    ) : 'prompt' in line && line.prompt ? (
                      <span>
                        <span className="text-purple-400">$</span> <span className="text-white">{line.text}</span>
                      </span>
                    ) : 'highlight' in line && line.highlight ? (
                      <span className="text-orange-400">{line.text}</span>
                    ) : 'link' in line && line.link ? (
                      <span className="text-purple-400 underline">{line.text}</span>
                    ) : 'badge' in line && line.badge ? (
                      <span>
                        {line.text}
                        <span className="text-green-400 font-bold">{line.badge}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">{line.text || '\u00A0'}</span>
                    )}
                  </div>
                ))}
                <div className="mt-1">
                  <span className="text-purple-400">$</span>{' '}
                  <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
