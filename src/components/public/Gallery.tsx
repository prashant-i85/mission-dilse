'use client'

import { useState, useEffect } from 'react'
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Share2, Check } from 'lucide-react'
import Image from 'next/image'

interface Photo {
  id: string
  image_url: string
  caption?: string | null
}

interface GalleryProps {
  photos: Photo[]
  heading?: string
  description?: string
}

export default function Gallery({ photos, heading, description }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [shared, setShared] = useState(false)

  if (photos.length === 0) return null

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1))
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, photos.length])

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1))
    }
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0))
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const activePhoto = lightboxIndex !== null ? photos[lightboxIndex] : null
    const shareTitle = activePhoto?.caption || 'Mission Dilse - Impact Story'
    const shareText = `Discover real stories of resilience and community empowerment at Mission Dilse: "${shareTitle}"`
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://missiondilse.org'

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
        return
      } catch (err) {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareTitle} — ${shareUrl}`)
      setShared(true)
      setTimeout(() => setShared(false), 2200)
    }
  }

  // Pick the first photo as the "Featured Story" capsule, and the rest as narrow capsules
  const featuredPhoto = photos[0]
  const otherPhotos = photos.slice(1)
  const baseMarqueePhotos = otherPhotos.length > 0 ? otherPhotos : photos

  // Duplicate to create a seamless infinite marquee track (half A, half B)
  const repeatCount = Math.max(3, Math.ceil(8 / (baseMarqueePhotos.length || 1)))
  const marqueeSet = Array.from({ length: repeatCount }).flatMap(() => baseMarqueePhotos)
  const allMarqueeItems = [...marqueeSet, ...marqueeSet]

  return (
    <section id="gallery" className="py-24 bg-brand-sand-200 bg-gold-glow border-b border-brand-sand-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Hear Our Stories style */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-black font-display tracking-tight text-gold-texture uppercase mb-4">
            {heading || 'HEAR OUR STORIES'}
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] mx-auto rounded-full mb-6" />
          <p className="text-base text-brand-sand-900/70 max-w-xl mx-auto leading-relaxed">
            {description || 'Real faces from the front lines of change. These are the people shaping their communities—and the future.'}
          </p>
        </div>

        {/* Capsule Slices Row/Grid - Image 2 layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center min-h-[480px]">
          
          {/* 1. Featured Wide Capsule */}
          {featuredPhoto && (
            <div
              onClick={() => setLightboxIndex(0)}
              className="relative flex-grow lg:flex-grow-[2] lg:basis-[32%] min-h-[380px] sm:min-h-[440px] lg:min-h-0 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border border-brand-gold-500/15 group-hover:border-brand-gold-500/40 shadow-lg cursor-pointer group transition-all duration-300"
            >
              <Image
                src={featuredPhoto.image_url}
                alt={featuredPhoto.caption || 'Featured story'}
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 sm:p-8" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10 text-white">
                <span className="text-[10px] font-bold tracking-widest text-brand-gold-500 block mb-1">
                  FEATURED STORY
                </span>
                <h3 className="text-xl font-bold font-display leading-tight mb-2">
                  {featuredPhoto.caption || 'Voices of Resilience'}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed max-w-md">
                  Click to view full photo and details. Stories of dedication and empowerment captured directly from the field.
                </p>
              </div>
            </div>
          )}

          {/* 2. Expanding Capsules Row - Slides left continuously when not hovered, expands on hover */}
          <div className="flex-grow lg:flex-grow-[3] lg:basis-[68%] overflow-hidden relative rounded-[2.5rem] sm:rounded-[3rem] h-[380px] sm:h-[440px] lg:h-[480px]">
            <div className="animate-slide-left flex flex-row gap-3 sm:gap-3.5 h-full items-stretch py-1">
              {allMarqueeItems.map((photo, index) => {
                const origIdx = photos.findIndex((p) => p.id === photo.id)
                const targetIdx = origIdx >= 0 ? origIdx : 0

                return (
                  <div
                    key={`slice-${index}-${photo.id}`}
                    onClick={() => setLightboxIndex(targetIdx)}
                    className="group/slice relative rounded-full overflow-hidden border border-brand-gold-500/15 hover:border-brand-gold-500/40 shadow-md cursor-pointer w-[80px] sm:w-[100px] lg:w-[110px] hover:w-[260px] sm:hover:w-[320px] transition-all duration-700 ease-out shrink-0 h-full hover:shadow-[0_15px_30px_rgba(212,175,55,0.2)]"
                  >
                    <Image
                      src={photo.image_url}
                      alt={photo.caption || 'Gallery photo slice'}
                      fill
                      sizes="(max-width: 1024px) 25vw, 15vw"
                      className="object-cover scale-105 group-hover/slice:scale-100 transition-transform duration-700"
                    />
                    {/* Subtle hover overlay to make visual indicator clear */}
                    <div className="absolute inset-0 bg-black/20 group-hover/slice:bg-transparent transition-all duration-500" />
                    <div className="absolute inset-0 bg-brand-gold-600/20 opacity-0 group-hover/slice:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4 sm:p-5">
                      <ImageIcon className="h-6 w-6 text-brand-gold-500 drop-shadow-md mb-2 shrink-0" />
                      {photo.caption && (
                        <span className="text-white text-xs font-bold text-center line-clamp-2 drop-shadow-md">
                          {photo.caption}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Small Bottom CTAs */}
        <div className="flex justify-center gap-4 mt-12">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-3.5 text-xs font-bold tracking-wider uppercase text-primary-foreground bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] hover:opacity-90 rounded-full transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(242,202,80,0.25)]"
          >
            TELL MY STORY
          </a>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-sand-100/95 backdrop-blur-md p-3 sm:p-4 animate-fade-in cursor-pointer"
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close photo"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-2.5 rounded-full bg-white/90 hover:bg-white text-brand-sand-900 shadow-lg transition-all z-30 cursor-pointer"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white text-brand-sand-900 shadow-lg transition-all z-20 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-2 sm:right-6 p-2 sm:p-3 rounded-full bg-white/90 hover:bg-white text-brand-sand-900 shadow-lg transition-all z-20 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Image & Caption Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center max-w-4xl max-h-[85vh] w-full cursor-default px-2 sm:px-8"
          >
            <div className="relative w-full h-[55vh] sm:h-[65vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={photos[lightboxIndex].image_url}
                alt={photos[lightboxIndex].caption || 'Gallery photo'}
                fill
                sizes="(max-width: 1024px) 95vw, 80vw"
                className="object-contain"
              />
            </div>
            
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-2xl px-4">
              {photos[lightboxIndex].caption && (
                <p className="text-sm sm:text-base font-semibold leading-relaxed text-brand-sand-900 text-center sm:text-left">
                  {photos[lightboxIndex].caption}
                </p>
              )}
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-brand-sand-900 border border-brand-sand-300 hover:border-brand-gold-500 shadow-xs transition-all cursor-pointer shrink-0"
              >
                {shared ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-brand-gold-600" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

