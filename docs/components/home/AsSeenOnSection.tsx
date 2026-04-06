'use client'

import Image from 'next/image'
import React, { useCallback, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from '../atomic-ui-elements/arrows'

const talks = [
  {
    thumbnail: '/talks/thinking-hard.png',
    title: 'Thinking Hard is not Enough',
    event: 'COSMOVERSE',
    speaker: 'Ivan Gavran',
  },
  {
    thumbnail: '/talks/se4fp.png',
    title: 'Introdução à Linguagem Quint [Portuguese]',
    event: 'ESQUENTA SE4FP',
    speaker: 'Gabriela Moreira',
  },
  {
    thumbnail: '/talks/live-coding.png',
    title: 'Live Coding with Quint',
    event: 'BLUE YARD',
    speaker: 'Gabriela Moreira',
  },
]

export const AsSeenOnSection = () => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const canScrollLeft = currentIndex > 0
  const canScrollRight = currentIndex < talks.length - 1

  const getOffset = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const card = track.children[currentIndex] as HTMLElement | undefined
    if (!card) return 0
    return card.offsetLeft
  }, [currentIndex])

  const touchStartX = useRef(0)

  const scroll = (direction: 'left' | 'right') => {
    setCurrentIndex(prev => {
      if (direction === 'left') return Math.max(0, prev - 1)
      return Math.min(talks.length - 1, prev + 1)
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) {
      scroll(delta > 0 ? 'right' : 'left')
    }
  }

  return (
    <section className="bg-quint-purple/10 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl sm:text-[54px] font-semibold text-quint-dark font-[family-name:var(--font-instrument-sans)]">
            As Seen On
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="text-quint-purple transition-opacity disabled:opacity-30 hover:text-quint-dark cursor-pointer disabled:cursor-default"
              aria-label="Previous talk"
            >
              <ArrowLeft />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="text-quint-purple transition-opacity disabled:opacity-30 hover:text-quint-dark cursor-pointer disabled:cursor-default"
              aria-label="Next talk"
            >
              <ArrowRight />
            </button>
          </div>
        </div>

        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="overflow-x-hidden touch-pan-y">
          <div
            ref={trackRef}
            className="flex flex-wrap gap-6 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${getOffset()}px)` }}
          >
            {talks.map((talk, i) => (
              <div key={i} className="shrink-0 w-[300px] md:w-[350px]">
                <div className="rounded-lg overflow-hidden aspect-video relative">
                  <Image src={talk.thumbnail} alt={talk.title} fill className="object-cover" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-quint-dark font-[family-name:var(--font-instrument-sans)]">
                  {talk.title}
                </h3>
                <p className="mt-1 text-base font-semibold text-quint-purple tracking-wider uppercase font-[family-name:var(--font-inter)]">
                  {talk.event} • {talk.speaker}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
