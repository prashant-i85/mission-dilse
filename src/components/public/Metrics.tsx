'use client'

import { useEffect, useRef, useState } from 'react'
import { Calendar, Users, Award, ShieldCheck } from 'lucide-react'
import { motion, useInView, animate } from 'framer-motion'

interface MetricsProps {
  textCopy?: {
    metric_1_val: string
    metric_1_label: string
    metric_1_desc: string
    metric_2_val: string
    metric_2_label: string
    metric_2_desc: string
    metric_3_val: string
    metric_3_label: string
    metric_3_desc: string
    metric_4_val: string
    metric_4_label: string
    metric_4_desc: string
  }
}

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [displayValue, setDisplayValue] = useState('0')

  // Parse numeric part and suffix/prefix (e.g. "5,000+" -> number: 5000, suffix: "+")
  const match = value.match(/([\d,]+)/)
  const rawNum = match ? parseInt(match[0].replace(/,/g, ''), 10) : null
  const prefix = match ? value.slice(0, match.index) : ''
  const suffix = match && match.index !== undefined ? value.slice(match.index + match[0].length) : ''

  useEffect(() => {
    if (!isInView) return

    if (rawNum === null || isNaN(rawNum)) {
      setDisplayValue(value)
      return
    }

    const controls = animate(0, rawNum, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        const rounded = Math.round(latest)
        setDisplayValue(`${prefix}${rounded.toLocaleString('en-IN')}${suffix}`)
      },
    })

    return () => controls.stop()
  }, [isInView, rawNum, value, prefix, suffix])

  if (rawNum === null || isNaN(rawNum)) {
    return <span>{value}</span>
  }

  return <span ref={ref}>{displayValue}</span>
}

export default function Metrics({ textCopy }: MetricsProps) {
  const stats = [
    {
      id: 1,
      value: textCopy?.metric_1_val || '5,000+',
      label: textCopy?.metric_1_label || 'Meals Distributed',
      icon: Calendar,
      description: textCopy?.metric_1_desc || 'Healthy meals cooked & served',
    },
    {
      id: 2,
      value: textCopy?.metric_2_val || '150+',
      label: textCopy?.metric_2_label || 'Kids Educated',
      icon: Users,
      description: textCopy?.metric_2_desc || 'Sponsorships & school kits',
    },
    {
      id: 3,
      value: textCopy?.metric_3_val || '25+',
      label: textCopy?.metric_3_label || 'Active Projects',
      icon: Award,
      description: textCopy?.metric_3_desc || 'Local development initiatives',
    },
  ]

  return (
    <section className="bg-brand-sand-100 bg-gold-glow py-16 border-b border-brand-sand-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 divide-y-0 divide-x-0 sm:divide-x sm:divide-brand-gold-500/15">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: 'easeOut' }}
                className={`flex flex-col items-center text-center px-4 group hover:scale-105 transition-transform duration-300 cursor-default ${
                  idx > 0 ? 'pt-8 sm:pt-0' : ''
                }`}
              >
                <div className="p-3.5 bg-brand-gold-500/10 text-brand-gold-500 rounded-2xl mb-4 border border-brand-gold-500/25 shadow-[0_0_15px_rgba(242,202,80,0.1)] group-hover:shadow-[0_0_25px_rgba(242,202,80,0.3)] group-hover:border-brand-gold-500/50 group-hover:scale-110 transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="relative py-1 px-4 mb-1">
                  {/* Ambient glow and ring pulse */}
                  <div className="absolute inset-0 -m-1.5 rounded-full bg-brand-gold-500/15 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute inset-0 rounded-full border border-brand-gold-500/30 scale-90 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                  <div className="relative z-10 text-4xl sm:text-5xl font-black font-display text-gold-texture tracking-tight">
                    <AnimatedCounter value={stat.value} />
                  </div>
                </div>
                <div className="text-sm font-bold text-brand-gold-500 tracking-wide mb-1 uppercase">
                  {stat.label}
                </div>
                <div className="text-xs text-brand-sand-900/60 leading-normal max-w-[180px]">
                  {stat.description}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

