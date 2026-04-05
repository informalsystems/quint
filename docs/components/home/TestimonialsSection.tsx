'use client'

import Image from 'next/image'

const testimonials = [
  {
    quote:
      'Quint is an excellent lightweight approach to formal verification, particularly well suited for systems that are still evolving. It allowed us to reach a high degree of confidence in the correctness and security properties of our systems \u2014 and helped surface a surprising number of issues that would otherwise have been difficult to detect.',
    name: 'Denis',
    title: 'TITLE, COMPANY',
    avatar: '/testimonial-example.png',
  },
  {
    quote:
      'Quint is an excellent lightweight approach to formal verification, particularly well suited for systems that are still evolving. It allowed us to reach a high degree of confidence in the correctness and security properties of our systems \u2014 and helped surface a surprising number of issues that would otherwise have been difficult to detect.',
    name: 'Denis',
    title: 'TITLE, COMPANY',
    avatar: '/testimonial-example.png',
  },
  {
    quote:
      'Quint is an excellent lightweight approach to formal verification, particularly well suited for systems that are still evolving. It allowed us to reach a high degree of confidence in the correctness and security properties of our systems \u2014 and helped surface a surprising number of issues that would otherwise have been difficult to detect.',
    name: 'Denis',
    title: 'TITLE, COMPANY',
    avatar: '/testimonial-example.png',
  },
]

const QuoteIcon = () => (
  <svg width="90" height="71" viewBox="0 0 90 71" fill="none">
    <rect width="90" height="71" fill="white" />
    <path
      d="M49.0465 53V36.2168C49.0465 28.1608 51.0698 21.2797 55.1163 15.5734C59.1628 9.86713 65.4574 6.34265 74 5V15.4056C69.0543 16.0769 65.6822 17.8112 63.8837 20.6084C62.1977 23.2937 61.3546 27.1538 61.3546 32.1888L53.093 30.5105H73.6628V53H49.0465ZM16 53V36.2168C16 28.1608 18.0233 21.2797 22.0698 15.5734C26.1163 9.86713 32.4109 6.34265 40.9535 5V15.4056C36.0078 16.0769 32.6357 17.8112 30.8372 20.6084C29.1512 23.2937 28.3081 27.1538 28.3081 32.1888L20.0465 30.5105H40.6163V53H16Z"
      fill="#9D6CE5"
    />
  </svg>
)

export const TestimonialsSection = () => {
  return (
    <section className="bg-white pt-5 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 items-start">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-[54px] leading-tight font-semibold font-[family-name:var(--font-instrument-sans)]">
              <span className="text-quint-purple">Trusted in</span>
              <br />
              <span className="text-quint-dark">Production</span>
            </h2>
            <p className="mt-3 text-xl text-quint-dark font-[family-name:var(--font-inter)]">
              Quint is a working ecosystem with years of research and real-world use behind it, deployed by teams at
              Monad BFT, Namada, and Cardano.
            </p>
          </div>

          <div className=" overflow-x-auto overflow-y-visible pt-10 lg:-mr-[calc((100vw-1280px)/2+24px)] lg:pr-0">
            <div className="flex gap-6 pr-6 lg:pr-12">
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className="relative shrink-0 w-[400px] md:w-[675px] rounded-[14px] border-2 border-quint-dark px-10 pt-10 pb-10 md:px-15 md:pt-15 md:pb-15"
                >
                  <div className="absolute -top-10 left-6">
                    <QuoteIcon />
                  </div>

                  <p className="text-xl italic text-quint-dark font-[family-name:var(--font-inter)]">
                    {testimonial.quote}
                  </p>

                  <div className="mt-5 md:mt-10 flex items-center justify-end gap-3">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xl font-semibold text-quint-dark font-[family-name:var(--font-instrument-sans)]">
                        {testimonial.name},
                      </p>
                      <p className="text-base text-quint-purple font-semibold tracking-wider font-[family-name:var(--font-inter)]">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
