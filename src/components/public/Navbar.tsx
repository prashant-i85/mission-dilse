'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Heart } from 'lucide-react'

interface NavbarProps {
  visibleSections: {
    works: boolean
    gallery: boolean
    about: boolean
    contact: boolean
  }
}

export default function Navbar({ visibleSections }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // Section scroll spy
      const sectionIds = ['contact', 'about', 'gallery', 'works', 'founder']
      const scrollPos = window.scrollY + 220

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(`#${id}`)
          return
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'FOUNDER', href: '#founder', show: true },
    { name: 'PROGRAMS', href: '#works', show: visibleSections.works },
    { name: 'IMPACT', href: '#gallery', show: visibleSections.gallery },
    { name: 'OUR STORY', href: '#about', show: visibleSections.about },
    { name: 'CONTACT', href: '#contact', show: visibleSections.contact },
  ].filter((link) => link.show)

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsOpen(false)
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    try {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (err) {
      console.error('Failed to scroll to element:', err)
    }
  }

  return (
    <nav
      className={`fixed left-0 right-0 z-50 px-4 md:px-8 pointer-events-none transition-all duration-300 ${
        scrolled ? 'top-2 sm:top-2.5' : 'top-4'
      }`}
    >
      <div className="mx-auto max-w-5xl w-full flex items-center justify-between transition-all duration-300">
        
        {/* Logo Capsule */}
        <div
          className={`border border-brand-sand-300 rounded-full pointer-events-auto flex items-center gap-3 transition-all duration-300 ${
            scrolled
              ? 'backdrop-blur-md bg-white/80 shadow-lg border-brand-sand-300/80 py-1.5 px-3.5 scale-[0.98]'
              : 'backdrop-blur-md bg-white/85 shadow-md py-2.5 px-4'
          }`}
        >
          <a
            href="#"
            onClick={(e) => handleScrollTo(e, '#')}
            className="flex items-center gap-2.5 group"
          >
            <img
              src="/logo_second.jpg"
              alt="Mission Dilse Logo"
              className={`rounded-full object-cover border border-brand-sand-300 transition-all duration-300 group-hover:rotate-6 ${
                scrolled ? 'h-7 w-7' : 'h-8 w-8'
              }`}
            />
            <span className="font-bold tracking-wider text-gold-texture font-display text-xs uppercase group-hover:opacity-90 transition-opacity">
              MISSION DILSE
            </span>
          </a>
        </div>

        {/* Desktop Nav Links & Donate Capsule */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 transition-all duration-300">
          {/* Menu links Capsule */}
          <div
            className={`border border-brand-sand-300 rounded-full pointer-events-auto flex items-center tracking-wider text-brand-sand-900/80 transition-all duration-300 ${
              scrolled
                ? 'backdrop-blur-md bg-white/80 shadow-lg border-brand-sand-300/80 py-1.5 lg:py-2 px-3 lg:px-4 gap-1.5 lg:gap-2.5 text-[10.5px] lg:text-[11.5px]'
                : 'backdrop-blur-md bg-white/85 shadow-md py-2.5 lg:py-3 px-3.5 lg:px-6 gap-2 lg:gap-3 text-[11px] lg:text-xs font-bold'
            }`}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`transition-all duration-300 px-2.5 py-1 rounded-full text-center shrink-0 font-bold ${
                    isActive
                      ? 'bg-brand-gold-500/20 text-brand-gold-600 shadow-xs border border-brand-gold-500/35 scale-105'
                      : 'text-brand-sand-900/70 hover:text-brand-gold-600 hover:scale-105 border border-transparent'
                  }`}
                >
                  {link.name}
                </a>
              )
            })}
          </div>

          {/* Donate Capsule */}
          <div className="pointer-events-auto">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`block rounded-full bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] font-bold tracking-widest text-primary-foreground hover:opacity-95 hover:scale-105 active:scale-95 transition-all duration-300 uppercase shadow-lg shadow-primary/10 hover:shadow-primary/25 whitespace-nowrap ${
                scrolled
                  ? 'px-4 lg:px-5 py-2 text-[10.5px] lg:text-[11.5px]'
                  : 'px-4 lg:px-6 py-2.5 lg:py-3 text-[11px] lg:text-xs'
              } ${activeSection === '#contact' ? 'ring-2 ring-brand-gold-500 shadow-xl' : ''}`}
            >
              DONATE
            </a>
          </div>
        </div>

        {/* Mobile menu button in a capsule */}
        <div
          className={`md:hidden flex items-center pointer-events-auto border border-brand-sand-300 rounded-full transition-all duration-300 ${
            scrolled
              ? 'backdrop-blur-xl bg-white/75 p-1 shadow-lg'
              : 'backdrop-blur-md bg-white/85 p-1.5 shadow-md'
          }`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-full text-brand-sand-900/80 hover:text-brand-sand-900 focus:outline-none transition-transform active:scale-90"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Floating Card */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out mt-2 mx-auto max-w-5xl w-full rounded-3xl pointer-events-auto border border-brand-sand-300 bg-background/95 backdrop-blur-lg shadow-2xl overflow-hidden ${
          isOpen ? 'max-h-[420px] opacity-100 py-4 px-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="block py-2.5 rounded-xl text-xs font-bold tracking-wider text-brand-sand-900/80 hover:bg-brand-sand-300/30 hover:text-brand-gold-600 transition-all"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 pb-1 border-t border-brand-sand-300 flex flex-col gap-2">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                setIsOpen(false)
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="block w-full text-center py-2.5 text-xs font-bold tracking-wider text-brand-gold-600 border border-brand-gold-600/50 rounded-xl hover:bg-brand-gold-600 hover:text-primary-foreground transition-all"
            >
              DONATE
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
