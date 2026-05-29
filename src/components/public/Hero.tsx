'use client'

import React from 'react'

interface HeroProps {
  showWorks: boolean
  heroData?: {
    ngo_name: string
    background_image_url?: string | null
  }
  button1Text?: string
  button2Text?: string
}

export default function Hero({ showWorks, heroData, button1Text, button2Text }: HeroProps) {
  const name = heroData?.ngo_name || 'MISSION DILSE'
  const bgImg = heroData?.background_image_url || null

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

  // Split name to display vertically stacked like the Stitch mockup
  const parts = name.trim().split(/\s+/)
  const part1 = parts[0] || 'MISSION'
  const part2 = parts.slice(1).join(' ') || 'DILSE'

  // Image mask applied to text with horizontal stretch
  const textBg: React.CSSProperties = {
    backgroundImage: `url(${bgImg || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80'})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    transform: "scaleX(1.5)",
    transformOrigin: "center",
    display: "block",
  }

  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-12 pt-20 pb-16 w-full flex flex-col items-center bg-grain relative">
      
      {/* Title stacked with background mask */}
      <h1
        aria-label={name}
        style={textBg}
        className="select-none text-center font-black font-anton leading-[0.95] tracking-tighter uppercase w-full py-4"
      >
        <span className="block text-[18vw] lg:text-[16vw] xl:text-[15rem] pb-3">
          {part1}
        </span>
        <span className="block text-[20vw] lg:text-[18vw] xl:text-[17rem] pb-3">
          {part2}
        </span>
      </h1>

      {/* Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-5 relative z-10 w-full">
        <a
          href="#contact"
          onClick={handleScrollToContact}
          className="rounded-full bg-primary px-10 py-4 text-sm font-bold tracking-widest text-primary-foreground hover:opacity-90 transition uppercase shadow-md"
        >
          {button1Text || 'SUPPORT US'}
        </a>
        <a
          href="#gallery"
          onClick={handleScrollToGallery}
          className="rounded-full border-2 border-primary bg-transparent px-10 py-4 text-sm font-bold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition uppercase"
        >
          {button2Text || 'SHARE YOUR STORY'}
        </a>
      </div>

    </section>
  )
}
