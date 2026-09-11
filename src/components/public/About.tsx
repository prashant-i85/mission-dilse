interface AboutProps {
  heading?: string | null
  body: string
}

export default function About({ heading, body }: AboutProps) {
  return (
    <section id="about" className="py-24 bg-brand-sand-100 bg-gold-glow border-b border-brand-sand-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Soft Warm Ivory Container Card */}
        <div className="bg-brand-sand-200 text-brand-sand-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 lg:p-16 shadow-xl hover:shadow-[0_0_45px_rgba(212,175,55,0.06)] relative overflow-hidden border border-brand-gold-500/10 transition-all duration-500">
          
          {/* Subtle gold decoration bubble */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-gold-500/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-brand-gold-600/5 blur-3xl pointer-events-none" />
 
          {/* Section details */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            
            {/* Title / Left Side */}
            <div className="lg:col-span-1">
              <span className="text-[10px] font-bold tracking-widest text-brand-gold-500 block mb-2">
                WHO WE ARE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-gold-texture leading-tight uppercase">
                {heading || 'About Us'}
              </h2>
              <div className="w-12 h-1 bg-brand-gold-500 rounded-full mt-4" />
            </div>

            {/* Paragraph / Right Side */}
            <div className="lg:col-span-2 text-brand-sand-900/85 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-sans">
              {body}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
