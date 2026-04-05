'use client'

import Image from 'next/image'

const teams = [
  {
    title: 'AI Infrastructure',
    description: 'New hardware or platform that is hard to test? Quint validates your design.',
    icon: '/teams-section/ai.svg',
  },
  {
    title: 'Blockchain / Fintech',
    description: 'Does your protocol store a lot of value? Make your transactions verified transitions.',
    icon: '/teams-section/blockchain.svg',
  },
  {
    title: 'Cloud Infrastructure',
    description:
      'Complex distributed systems where you don\u2019t know what and how to test? Quint checks the worst interleavings.',
    icon: '/teams-section/cloud.svg',
  },
]

export const TeamsSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-4xl sm:text-5xl md:text-[54px] leading-tight font-semibold font-[family-name:var(--font-instrument-sans)]">
          <span className="text-quint-dark">Built for Teams Where </span>
          <span className="text-quint-purple">Correctness Matters</span>
        </h2>
        <p className="mt-3 text-xl text-quint-dark font-[family-name:var(--font-inter)]">
          For the systems you can&apos;t afford to get wrong.
        </p>

        <div className="mt-13 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12">
          {teams.map(team => (
            <div key={team.title} className="rounded-2xl bg-gray-100 px-9 py-10">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[28px] font-bold text-quint-purple font-[family-name:var(--font-instrument-sans)]">
                  {team.title}
                </h3>
                <Image src={team.icon} alt={team.title} width={48} height={48} className="w-12 h-12 shrink-0" />
              </div>
              <p className="mt-5 text-xl text-quint-dark font-[family-name:var(--font-inter)]">{team.description}</p>
            </div>
          ))}

          <div className="relative rounded-2xl bg-quint-purple px-8 py-8 pr-24 overflow-hidden flex items-center min-h-full">
            <p className="relative z-10 text-[28px] font-bold text-white font-[family-name:var(--font-instrument-sans)]">
              Know what an edge case is?
              <br />
              Quint is probably for you too.
            </p>
            <Image
              src="/teams-section/quint.svg"
              alt="Quint"
              width={69}
              height={79}
              className="absolute top-4 right-4 w-20 h-20 opacity-40"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
