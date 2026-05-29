interface AboutProps {
  heading?: string | null
  body: string
}

export default function About({ heading, body }: AboutProps) {
  return (
    <section id="about" className="py-24 bg-brand-sand-100 border-b border-brand-sand-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Deep Forest Container Card */}
        <div style={{ backgroundColor: '#052114' }} className="text-white rounded-[3rem] p-10 sm:p-16 lg:p-20 shadow-2xl relative overflow-hidden border border-brand-emerald-900/50">
          
          {/* Subtle gold decoration bubble */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-brand-gold-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-brand-emerald-600/20 blur-3xl pointer-events-none" />

          {/* Section details */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Title / Left Side */}
            <div className="lg:col-span-1">
              <span className="text-[10px] font-bold tracking-widest text-brand-gold-500 block mb-2">
                WHO WE ARE
              </span>
              <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight uppercase">
                {heading || 'About Us'}
              </h2>
              <div className="w-12 h-1 bg-brand-gold-500 rounded-full mt-4" />
            </div>

            {/* Paragraph / Right Side */}
            <div className="lg:col-span-2 text-white/80 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-sans">
              {body}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
