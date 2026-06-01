'use client'

import { Calendar, Users, Award, ShieldCheck } from 'lucide-react'

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
    <section className="bg-brand-sand-100 bg-gold-glow py-16 border-b border-brand-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 divide-y-0 divide-x-0 sm:divide-x sm:divide-brand-gold-500/15">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.id}
                className={`flex flex-col items-center text-center px-4 ${
                  idx > 0 ? 'pt-8 sm:pt-0' : ''
                }`}
              >
                <div className="p-3 bg-brand-gold-500/10 text-brand-gold-500 rounded-2xl mb-4 border border-brand-gold-500/25 shadow-[0_0_15px_rgba(242,202,80,0.1)]">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-4xl sm:text-5xl font-black font-display text-gold-texture tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-brand-gold-500 tracking-wide mb-1 uppercase">
                  {stat.label}
                </div>
                <div className="text-xs text-brand-sand-900/60 leading-normal max-w-[180px]">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
