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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
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
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none">
      <div className="mx-auto max-w-5xl w-full flex items-center justify-between">
        
        {/* Logo Capsule */}
        <div className="backdrop-blur-md border border-brand-sand-300 bg-white/80 py-2.5 px-4 rounded-full shadow-md pointer-events-auto flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => handleScrollTo(e, '#')}
            className="flex items-center gap-2.5"
          >
            <img
              src="/logo_second.jpg"
              alt="Mission Dilse Logo"
              className="h-8 w-8 rounded-full object-cover border border-brand-sand-300"
            />
            <span className="font-bold tracking-wider text-gold-texture font-display text-xs uppercase">
              MISSION DILSE
            </span>
          </a>
        </div>

        {/* Desktop Nav Links & Donate Capsule */}
        <div className="hidden md:flex items-center gap-3">
          {/* Menu links Capsule */}
          <div className="backdrop-blur-md border border-brand-sand-300 bg-white/80 py-3 px-6 rounded-full shadow-md pointer-events-auto flex items-center gap-6 text-xs font-bold tracking-wider text-brand-sand-900/80">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="hover:text-brand-gold-600 transition-colors duration-200 text-brand-sand-900/70"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Donate Capsule */}
          <div className="pointer-events-auto">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="block rounded-full bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] px-6 py-3 text-xs font-bold tracking-widest text-primary-foreground hover:opacity-90 transition uppercase shadow-lg shadow-primary/10"
            >
              DONATE
            </a>
          </div>
        </div>

        {/* Mobile menu button in a capsule */}
        <div className="md:hidden flex items-center pointer-events-auto backdrop-blur-md border border-brand-sand-300 bg-white/80 rounded-full p-1.5 shadow-md">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-full text-brand-sand-900/80 hover:text-brand-sand-900 focus:outline-none"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Floating Card */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out mt-2 mx-auto max-w-5xl w-full rounded-3xl pointer-events-auto border border-brand-sand-300 bg-background/95 backdrop-blur-lg shadow-2xl overflow-hidden ${
          isOpen ? 'max-h-[300px] opacity-100 py-4 px-6' : 'max-h-0 opacity-0'
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
