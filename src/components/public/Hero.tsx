'use client'

import React from 'react'

interface HeroProps {
  showWorks: boolean
  heroData?: {
    ngo_name: string
    tagline?: string
    slogans?: string[]
    background_image_url?: string | null
  }
  button1Text?: string
  button2Text?: string
}

export default function Hero({ showWorks, heroData, button1Text, button2Text }: HeroProps) {
  const name = heroData?.ngo_name || 'MISSION DILSE'
  const bgImg = heroData?.background_image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80'
  const tagline = heroData?.tagline || 'COMPASSION IN ACTION'
  const slogans = heroData?.slogans || ['EQUAL OPPORTUNITY', 'CHILD EDUCATION', 'COMMUNITY DEVOTION']

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToGallery = (e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.querySelector('#gallery')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-screen bg-grain flex items-center overflow-hidden py-16 lg:py-0 border-b border-brand-sand-300">
      
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-brand-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-brand-gold-600/10 blur-3xl pointer-events-none" />

      <div className="w-full px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Logo on the left, content column on the right */}
        <div className="lg:col-span-9 flex flex-col sm:flex-row items-start gap-0 pt-10 lg:pt-0 relative z-20 -ml-2 sm:-ml-4 lg:-ml-8">
          
          {/* The Heart Logo */}
          <img
            src="/heart_outline.png"
            alt="Mission Dilse Heart Logo"
            className="h-32 sm:h-40 md:h-48 xl:h-56 w-auto object-contain flex-shrink-0 mix-blend-multiply animate-pulse ml-2 sm:ml-4 lg:ml-6 -mr-4 sm:-mr-8 md:-mr-12 xl:-mr-16"
            style={{ animationDuration: '3s' }}
          />

          {/* Text Content Column (Title, Slogan, Buttons) */}
          <div className="flex flex-col items-start text-left space-y-6 md:space-y-8">
            {/* The Title Text */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black font-display leading-[1.0] tracking-tighter uppercase">
                {name.split(/\s+/).map((word, idx) => (
                  <span key={idx} className="block text-gold-texture">
                    {word}
                  </span>
                ))}
              </h1>
            </div>

            {/* Slogan underneath in bold, grey */}
            <p className="text-base md:text-lg lg:text-xl font-extrabold text-brand-sand-800 uppercase tracking-widest font-display">
              BE SOMEONE'S REASON TO SMILE
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full pt-2">
              <a
                href="#contact"
                onClick={handleScrollToContact}
                className="rounded-2xl bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] px-10 py-4.5 text-xs md:text-sm font-extrabold tracking-widest text-primary-foreground hover:opacity-95 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition duration-300 uppercase shadow-lg"
              >
                {button1Text || 'SUPPORT US'}
              </a>
              <a
                href="#gallery"
                onClick={handleScrollToGallery}
                className="rounded-2xl border-2 border-primary bg-transparent px-10 py-4.5 text-xs md:text-sm font-extrabold tracking-widest text-primary hover:bg-brand-gold-500/10 hover:shadow-[0_0_20px_rgba(242,202,80,0.15)] transition duration-300 uppercase"
              >
                {button2Text || 'EXPLORE'}
              </a>
            </div>
          </div>

        </div>

        {/* Empty column to reserve space on desktop */}
        <div className="lg:col-span-3 hidden lg:block" />

      </div>

      {/* Right Aligned Background Photo (clear photo spanning the right half) */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[60%] z-0 pointer-events-none select-none">
        {/* The Photo */}
        <img
          src={bgImg}
          alt="Mission Dilse Hero Background"
          className="w-full h-full object-cover"
        />

        {/* Left Fade Overlay (no blur) */}
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent z-10" />

        {/* Mobile Fade-from-bottom so overlay text remains readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent lg:hidden z-10" />
      </div>

      {/* Bottom Fade transition to make the background fade off to the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

    </section>
  )
}
