'use client'
 
import { useState } from 'react'
import { Calendar, ArrowUpRight, X, Play, Film, Heart } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { parseWorkVideo, getYouTubeEmbedUrl } from '@/lib/videoHelper'

interface Work {
  id: string
  title: string
  description: string
  cover_image_url?: string | null
  video_url?: string | null
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

  const categoryTags = ['COMMUNITY', 'EDUCATION', 'HEALTHCARE', 'ADVOCACY', 'DISTRIBUTION']

  return (
    <section id="works" className="py-24 bg-brand-sand-100 bg-gold-glow border-b border-brand-sand-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-5xl font-black font-display tracking-tight text-gold-texture uppercase mb-4">
            {heading || 'WHAT WE DO'}
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] mx-auto rounded-full mb-6" />
          <p className="text-base sm:text-lg text-brand-sand-900/70 max-w-2xl mx-auto leading-relaxed">
            {description || 'We support communities through direct aid, sponsor education programs, and lead campaigns—translating compassionate support into real-world, lasting change.'}
          </p>
        </motion.div>

        {/* Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {works.map((work, idx) => {
            const parsed = parseWorkVideo(work)
            const workItem = {
              ...work,
              video_url: parsed.video_url,
              description: parsed.description,
            }

            const dateStr = new Date(workItem.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            })
            const tag = workItem.category || categoryTags[idx % categoryTags.length]
            const truncatedDesc =
              workItem.description.length > 100
                ? `${workItem.description.substring(0, 100)}...`
                : workItem.description

            const hasVideo = Boolean(workItem.video_url && workItem.video_url.trim().length > 0)

            return (
              <motion.div
                key={workItem.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.6,
                  delay: (idx % 3) * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => setSelectedWork(workItem)}
                className="group relative h-[420px] sm:h-[450px] w-full rounded-[2rem] overflow-hidden border border-brand-gold-500/15 hover:border-brand-gold-500/50 shadow-sm hover:-translate-y-2 hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex flex-col justify-between p-5 sm:p-8 bg-brand-sand-200"
              >
                {/* Background Image / Cover */}
                <div className="absolute inset-0 z-0 transition-all duration-700">
                  {workItem.cover_image_url ? (
                    <Image
                      src={workItem.cover_image_url}
                      alt={workItem.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover scale-105 group-hover:scale-100 transition-all duration-700 brightness-[0.7] group-hover:brightness-[0.85]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-brand-gold-600/20" />
                  )}
                  {/* Shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                </div>

                {/* Video Play Overlay Badge if video exists */}
                {hasVideo && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-gold-500/90 text-primary-foreground flex items-center justify-center shadow-xl group-hover:scale-120 transition-transform duration-300 backdrop-blur-xs border border-white/40">
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5 sm:ml-1" />
                    </div>
                  </div>
                )}

                {/* Card Top: Tag & Arrow Icon */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-primary group-hover:bg-gradient-to-r group-hover:from-[#ffe088] group-hover:via-[#f2ca50] group-hover:to-[#d4af37] group-hover:text-primary-foreground transition-all duration-300">
                      {tag}
                    </span>
                    {hasVideo && (
                      <span className="text-[9px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-red-600/90 text-white flex items-center gap-1 uppercase shadow-sm">
                        <Film className="w-3 h-3" /> VIDEO
                      </span>
                    )}
                  </div>
                  
                  <div className="p-3 sm:p-3.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-white group-hover:bg-gradient-to-r group-hover:from-[#ffe088] group-hover:via-[#f2ca50] group-hover:to-[#d4af37] group-hover:text-primary-foreground group-hover:scale-110 active:scale-90 transition-all duration-300 shadow-sm shrink-0">
                    <ArrowUpRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 transform group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>

                {/* Card Bottom: Text */}
                <div className="relative z-10 mt-auto text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block mb-1.5">
                    {dateStr}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-display leading-tight text-white mb-2 sm:mb-3 group-hover:text-amber-200 transition-colors">
                    {workItem.title}
                  </h3>
                  <p className="text-white/80 text-xs leading-relaxed">
                    {truncatedDesc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal with Video Player Support */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedWork(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.94, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 15, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-brand-sand-200 rounded-3xl sm:rounded-[2rem] overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-brand-sand-300 cursor-default"
            >
            {/* Close Button */}
            <button
              onClick={() => setSelectedWork(null)}
              aria-label="Close modal"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white shadow-lg backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Video / Image Display Header */}
            {selectedWork.video_url && selectedWork.video_url.trim().length > 0 ? (
              <div className="relative w-full aspect-video max-h-[48vh] sm:max-h-[58vh] bg-black flex-shrink-0 flex items-center justify-center">
                {getYouTubeEmbedUrl(selectedWork.video_url) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedWork.video_url)!}
                    title={selectedWork.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <video
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                    src={selectedWork.video_url}
                  >
                    Your browser does not support video playback.
                  </video>
                )}
              </div>
            ) : selectedWork.cover_image_url ? (
              <div className="relative h-56 sm:h-72 md:h-80 w-full flex-shrink-0">
                <Image
                  src={selectedWork.cover_image_url}
                  alt={selectedWork.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 sm:p-8 flex-grow text-brand-sand-900">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-[10px] font-extrabold text-brand-gold-600 uppercase tracking-widest">
                  {new Date(selectedWork.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {selectedWork.video_url && (
                  <span className="text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1 uppercase">
                    <Film className="w-3 h-3" /> VIDEO FEED
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-3xl font-black font-display text-gold-texture leading-tight mb-3 uppercase">
                {selectedWork.title}
              </h3>
              <div className="w-12 h-1 bg-brand-gold-600 mb-5 rounded-full" />
              <div className="text-brand-sand-900/85 leading-relaxed whitespace-pre-line text-xs sm:text-base font-sans">
                {selectedWork.description}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-brand-sand-300 bg-brand-sand-100 flex items-center justify-between gap-3">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  setSelectedWork(null)
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="px-5 sm:px-6 py-2.5 font-extrabold text-xs tracking-wider uppercase text-primary-foreground bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#d4af37] hover:scale-105 active:scale-95 rounded-full transition-all shadow-md flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                Support This Project
              </a>
              <button
                onClick={() => setSelectedWork(null)}
                className="px-5 sm:px-6 py-2.5 font-bold text-xs tracking-wider uppercase text-brand-sand-900 bg-white border border-brand-sand-300 hover:bg-brand-gold-600 hover:text-primary-foreground rounded-full transition-all cursor-pointer active:scale-95"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </section>
  )
}
