'use client'

import { useState } from 'react'
import { Calendar, ArrowUpRight, X } from 'lucide-react'
import Image from 'next/image'

interface Work {
  id: string
  title: string
  description: string
  cover_image_url?: string | null
  created_at: string
  category?: string | null
}

interface WorksProps {
  works: Work[]
  heading?: string
  description?: string
}

export default function Works({ works, heading, description }: WorksProps) {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)

  if (works.length === 0) return null

  // Hardcoded tags to map to index for mock visual categorization
  const categoryTags = ['COMMUNITY', 'EDUCATION', 'HEALTHCARE', 'ADVOCACY', 'DISTRIBUTION']

  return (
    <section id="works" className="py-24 bg-brand-sand-100 bg-gold-glow border-b border-brand-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Editorial Title & Subtitle from Reference */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl font-black font-display tracking-tight text-gold-texture uppercase mb-4">
            {heading || 'WHAT WE DO'}
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] mx-auto rounded-full mb-6" />
          <p className="text-base sm:text-lg text-brand-sand-900/70 max-w-2xl mx-auto leading-relaxed">
            {description || 'We support communities through direct aid, sponsor education programs, and lead campaigns—translating compassionate support into real-world, lasting change.'}
          </p>
        </div>

        {/* Works Grid - Image 4 & 5 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work, idx) => {
            const dateStr = new Date(work.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            })
            const tag = work.category || categoryTags[idx % categoryTags.length]
            const truncatedDesc =
              work.description.length > 100
                ? `${work.description.substring(0, 100)}...`
                : work.description

            return (
              <div
                key={work.id}
                onClick={() => setSelectedWork(work)}
                className="group relative h-[450px] w-full rounded-[2rem] overflow-hidden border border-brand-gold-500/10 group-hover:border-brand-gold-500/25 shadow-sm hover:shadow-[0_15px_35px_rgba(212,175,55,0.06)] cursor-pointer transition-all duration-500 transform hover:-translate-y-1.5 flex flex-col justify-between p-8 bg-brand-sand-200"
              >
                {/* Background Image - Always visible, blurred/darkened by default, clear on hover */}
                <div className="absolute inset-0 z-0 transition-all duration-700">
                  {work.cover_image_url ? (
                    <Image
                      src={work.cover_image_url}
                      alt={work.title}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover scale-105 group-hover:scale-100 transition-all duration-700 brightness-[0.7] group-hover:brightness-[0.85]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-brand-gold-600/20" />
                  )}
                  {/* Shadow overlay to make white text readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                </div>

                {/* Card Top: Tag & Arrow Icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary group-hover:bg-gradient-to-r group-hover:from-[#ffe088] group-hover:via-[#f2ca50] group-hover:to-[#d4af37] group-hover:text-primary-foreground transition-all duration-300">
                    {tag}
                  </span>
                  
                  {/* Circular Up-Right Arrow from Dribbble shot */}
                  <div className="p-3.5 rounded-full bg-white/10 border border-white/10 text-white group-hover:bg-gradient-to-r group-hover:from-[#ffe088] group-hover:via-[#f2ca50] group-hover:to-[#d4af37] group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
                    <ArrowUpRight className="h-4.5 w-4.5 transform group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>

                {/* Card Bottom: Text */}
                <div className="relative z-10 mt-auto text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block mb-1.5">
                    {dateStr}
                  </span>
                  <h3 className="text-2xl font-black font-display leading-tight text-white mb-3">
                    {work.title}
                  </h3>
                  <p className="text-white/80 text-xs leading-relaxed">
                    {truncatedDesc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedWork && (
        <div
          onClick={() => setSelectedWork(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-brand-sand-200 rounded-[2rem] overflow-hidden shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-brand-sand-300"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedWork(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/95 hover:bg-white text-brand-sand-900 shadow-md transition-all hover:scale-105"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Image */}
            {selectedWork.cover_image_url && (
              <div className="relative h-64 w-full flex-shrink-0">
                <Image
                  src={selectedWork.cover_image_url}
                  alt={selectedWork.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Modal Body */}
            <div className="overflow-y-auto p-8 flex-grow text-brand-sand-900">
              <span className="text-[10px] font-extrabold text-brand-gold-600 uppercase tracking-widest block mb-2">
                {new Date(selectedWork.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <h3 className="text-3xl font-black font-display text-gold-texture leading-tight mb-4 uppercase">
                {selectedWork.title}
              </h3>
              <div className="w-10 h-0.5 bg-brand-gold-600 mb-6" />
              <div className="text-brand-sand-900/80 leading-relaxed whitespace-pre-line text-sm">
                {selectedWork.description}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-brand-sand-300 bg-brand-sand-100 flex justify-end">
              <button
                onClick={() => setSelectedWork(null)}
                className="px-6 py-2.5 font-bold text-xs tracking-wider uppercase text-brand-sand-900 bg-brand-sand-50 border border-brand-sand-300 hover:bg-brand-gold-600 hover:text-primary-foreground rounded-full transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
