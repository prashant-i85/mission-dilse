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
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md border-b border-[var(--border-color)]/40 shadow-sm bg-[var(--background)]/90 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="#"
              onClick={(e) => handleScrollTo(e, '#')}
              className="flex items-center gap-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <span className="flex gap-[2px]">
                  <span className="block h-3 w-[2px] bg-primary-foreground" />
                  <span className="block h-4 w-[2px] bg-primary-foreground" />
                  <span className="block h-5 w-[2px] bg-primary-foreground" />
                  <span className="block h-4 w-[2px] bg-primary-foreground" />
                  <span className="block h-3 w-[2px] bg-primary-foreground" />
                </span>
              </span>
              <span className="font-bold tracking-wider text-foreground">
                MISSION DILSE
              </span>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide text-foreground">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="hover:text-primary transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            
            {/* Donate Solid Button */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="rounded-full bg-primary px-7 py-3 text-sm font-semibold tracking-wide text-primary-foreground hover:opacity-90 transition"
            >
              DONATE
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        } bg-[var(--background)] border-t border-[var(--border-color)] shadow-xl`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="block px-3 py-3 rounded-md text-sm font-bold tracking-wider text-foreground hover:bg-[var(--border-color)]/20 hover:text-primary transition-all"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 pb-2 border-t border-[var(--border-color)] flex flex-col gap-3">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                setIsOpen(false)
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="block w-full text-center px-4 py-3 text-sm font-semibold tracking-wider text-primary border-2 border-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
            >
              DONATE
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
