import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'

export const dynamic = 'force-dynamic'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let works = true
  let gallery = true
  let about = true
  let contact = true

  try {
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from('site_settings')
      .select('section_name, is_visible')
    
    if (settings && settings.length > 0) {
      works = settings.find((s) => s.section_name === 'works')?.is_visible ?? true
      gallery = settings.find((s) => s.section_name === 'gallery')?.is_visible ?? true
      about = settings.find((s) => s.section_name === 'about')?.is_visible ?? true
      contact = settings.find((s) => s.section_name === 'contact')?.is_visible ?? true
    }
  } catch (err) {
    console.error('Failed to load settings in layout:', err)
  }

  const visibleSections = { works, gallery, about, contact }

  return (
    <div className="flex flex-col min-h-screen bg-grain">
      <Navbar visibleSections={visibleSections} />
      <main className="flex-grow">{children}</main>
      <footer className="bg-brand-sand-200 text-brand-sand-900 py-12 border-t border-brand-sand-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display font-bold text-lg text-gold-texture">Mission Dilse NGO</h3>
            <p className="text-[10px] sm:text-xs font-bold text-brand-sand-800 uppercase tracking-widest mt-1.5">
              BE SOMEONE'S REASON TO SMILE
            </p>
          </div>
          <p className="text-xs text-brand-sand-800/60">
            © {new Date().getFullYear()} Mission Dilse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
