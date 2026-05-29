'use client'

import { useState } from 'react'
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react'
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

  if (photos.length === 0) return null

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1))
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0))
    }
  }

  // Pick the first photo as the "Featured Story" capsule, and the rest as narrow capsules
  const featuredPhoto = photos[0]
  const otherPhotos = photos.slice(1)

  return (
    <section id="gallery" className="py-24 bg-brand-sand-200 border-b border-brand-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Hear Our Stories style */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl font-black font-display tracking-tight text-brand-sand-900 uppercase mb-4">
            {heading || 'HEAR OUR STORIES'}
          </h2>
          <div className="w-12 h-1 bg-brand-emerald-600 mx-auto rounded-full mb-6" />
          <p className="text-base text-brand-sand-900/70 max-w-xl mx-auto leading-relaxed">
            {description || 'Real faces from the front lines of change. These are the people shaping their communities—and the future.'}
          </p>
        </div>

        {/* Capsule Slices Row/Grid - Image 2 layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center min-h-[500px]">
          
          {/* 1. Featured Wide Capsule */}
          {featuredPhoto && (
            <div
              onClick={() => setLightboxIndex(0)}
              className="relative flex-grow lg:flex-grow-[2] lg:basis-[30%] min-h-[400px] lg:min-h-0 rounded-[3rem] overflow-hidden border border-brand-sand-300 shadow-lg cursor-pointer group"
            >
              <Image
                src={featuredPhoto.image_url}
                alt={featuredPhoto.caption || 'Featured story'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-emerald-950/80 via-brand-emerald-950/20 to-transparent flex flex-col justify-end p-8" />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10 text-white">
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

          {/* 2. Expanding Capsules Row - Smoothly expands from 1x to 3.5x on hover */}
          <div className="flex-grow lg:flex-grow-[3] lg:basis-[70%] flex flex-row gap-3 min-h-[350px] lg:min-h-0">
            {otherPhotos.slice(0, 5).map((photo, index) => {
              const photoIdx = index + 1 // Offset by 1 since we sliced off index 0

              return (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(photoIdx)}
                  className="group relative rounded-full overflow-hidden border border-brand-sand-300 shadow-md cursor-pointer flex-1 hover:flex-[3.5] transition-all duration-700 ease-out min-w-[60px]"
                >
                  <Image
                    src={photo.image_url}
                    alt={photo.caption || 'Gallery photo slice'}
                    fill
                    className="object-cover scale-105 transition-transform duration-700"
                  />
                  {/* Subtle hover overlay to make visual indicator clear */}
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-all duration-500" />
                  <div className="absolute inset-0 bg-brand-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-white drop-shadow-md" />
                  </div>
                </div>
              )
            })}
          </div>

        </div>

        {/* Small Bottom CTAs inspired by Image 2 */}
        <div className="flex justify-center gap-4 mt-12">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-3.5 text-xs font-bold tracking-wider uppercase text-white bg-brand-emerald-600 hover:bg-brand-emerald-700 rounded-full transition-all duration-300 shadow-md"
          >
            TELL MY STORY
          </a>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-emerald-950/95 p-4 animate-fade-in"
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image & Caption Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center max-w-4xl max-h-[75vh] w-full"
          >
            <div className="relative w-full h-[60vh]">
              <Image
                src={photos[lightboxIndex].image_url}
                alt={photos[lightboxIndex].caption || 'Gallery photo'}
                fill
                className="object-contain"
              />
            </div>
            {photos[lightboxIndex].caption && (
              <div className="mt-6 text-center text-white max-w-xl px-4">
                <p className="text-base font-semibold leading-relaxed">{photos[lightboxIndex].caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
