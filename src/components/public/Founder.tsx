'use client'

import Image from 'next/image'

export default function Founder() {
  return (
    <section id="founder" className="py-20 sm:py-24 bg-brand-sand-100 bg-gold-glow border-b border-brand-sand-300 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Soft Warm Off-White Poster Style Container */}
        <div className="group bg-[#f7f4ed] border border-[#e5decb] hover:border-brand-gold-500/30 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-16 shadow-xl shadow-amber-900/5 hover:shadow-[0_20px_50px_rgba(212,175,55,0.12)] transition-all duration-500 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Side: Bold Poster Typography, Dark Badge & Bio */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Main Headline: Small Gestures, Big Impact */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-[#1a1a1a] uppercase leading-[0.95] mb-5 sm:mb-6">
                SMALL GESTURES,<br />
                BIG IMPACT
              </h2>

              {/* Dark Pill Badge from Poster */}
              <div className="self-start w-fit bg-[#1f1f1f] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl mb-6 sm:mb-8 shadow-md border border-[#333333] group-hover:scale-105 transition-transform duration-300">
                <div className="text-base sm:text-xl font-bold font-sans tracking-wide">
                  Praveen Verma
                </div>
                <div className="text-xs sm:text-sm text-gray-300 font-serif italic">
                  Founder at Mission Dilse
                </div>
              </div>

              {/* Exact Description text from poster */}
              <p className="text-[#2b2520] text-sm sm:text-lg lg:text-xl leading-relaxed font-sans font-medium max-w-xl">
                Praveen Verma is the visionary behind Mission Dilse Trust, which is committed towards empowering women, providing quality education, ensuring better healthcare, and promoting sustainable development for a brighter and more inclusive future!
              </p>

            </div>

            {/* Right Side: Photo Card */}
            <div className="lg:col-span-5 w-full">
              <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px] rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden border border-[#dfd5c2] shadow-xl bg-gradient-to-b from-[#f9f6f0] to-[#eae1d0]">
                <Image
                  src="/praveen-verma.jpg"
                  alt="Praveen Verma - Founder at Missiondilse"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
