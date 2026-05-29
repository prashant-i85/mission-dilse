'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Settings, Eye, EyeOff, Loader2, Info } from 'lucide-react'

interface SectionSetting {
  id?: string
  section_name: string
  is_visible: boolean
}

export default function AdminDashboard() {
  const [settings, setSettings] = useState<SectionSetting[]>([
    { section_name: 'works', is_visible: true },
    { section_name: 'gallery', is_visible: true },
    { section_name: 'about', is_visible: true },
    { section_name: 'contact', is_visible: true },
  ])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('id, section_name, is_visible')
        
        if (error || !data || data.length === 0) {
          console.warn('Could not load settings from database. Defaulting to local preview settings.')
          setIsDemoMode(true)
        } else {
          // Map to make sure we have all 4 sections
          const formatted = ['works', 'gallery', 'about', 'contact'].map((name) => {
            const found = data.find((d) => d.section_name === name)
            return found || { section_name: name, is_visible: true }
          })
          setSettings(formatted)
        }
      } catch (err) {
        setIsDemoMode(true)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [supabase])

  const toggleSection = async (sectionName: string, currentStatus: boolean) => {
    setUpdating(sectionName)
    const newStatus = !currentStatus

    // Optimistic UI update
    setSettings((prev) =>
      prev.map((s) => (s.section_name === sectionName ? { ...s, is_visible: newStatus } : s))
    )

    if (isDemoMode) {
      setUpdating(null)
      return
    }

    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ is_visible: newStatus })
        .eq('section_name', sectionName)

      if (error) {
        // Rollback on error
        setSettings((prev) =>
          prev.map((s) => (s.section_name === sectionName ? { ...s, is_visible: currentStatus } : s))
        )
        alert(`Failed to update settings: ${error.message}`)
      }
    } catch (err: any) {
      // Rollback
      setSettings((prev) =>
        prev.map((s) => (s.section_name === sectionName ? { ...s, is_visible: currentStatus } : s))
      )
      alert(`Error updating settings: ${err.message || err}`)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-brand-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-brand-charcoal-100/60 text-sm">
          Overview and control panel for Mission Dilse NGO website
        </p>
      </div>

      {isDemoMode && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Demo Mode Active</span>
            <span>Toggles will update the UI immediately but will not persist to the database since Supabase keys are not configured.</span>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section Visibility Card */}
        <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-brand-orange-500/10 border border-brand-orange-500/20 text-brand-orange-500 rounded-2xl">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">Section Visibility</h2>
              <p className="text-brand-charcoal-100/60 text-xs mt-0.5">Toggle sections on or off on the public page</p>
            </div>
          </div>

          <div className="space-y-4">
            {settings.map((item) => {
              const label =
                item.section_name.charAt(0).toUpperCase() + item.section_name.slice(1)
              const isSectionVisible = item.is_visible
              const isUpdating = updating === item.section_name

              return (
                <div
                  key={item.section_name}
                  className="flex items-center justify-between p-4 bg-brand-charcoal-900/60 border border-brand-charcoal-100/5 rounded-2xl transition-all"
                >
                  <div className="flex items-center gap-3">
                    {isSectionVisible ? (
                      <Eye className="h-5 w-5 text-brand-orange-500" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-brand-charcoal-100/30" />
                    )}
                    <div>
                      <span className="text-sm font-semibold text-white block">{label} Section</span>
                      <span className="text-xs text-brand-charcoal-100/40">
                        {isSectionVisible ? 'Visible on homepage' : 'Hidden from homepage'}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={isUpdating}
                    onClick={() => toggleSection(item.section_name, isSectionVisible)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isSectionVisible ? 'bg-brand-orange-600' : 'bg-brand-charcoal-100/10'
                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    role="switch"
                    aria-checked={isSectionVisible}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isSectionVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Instructions Card */}
        <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-display text-white">How Section Toggles Work</h3>
            <ul className="space-y-3 text-sm text-brand-charcoal-100/70 list-disc list-inside">
              <li>
                <strong className="text-brand-orange-400">Works Section</strong>: Hides/shows the "Our Works" list. If no active works exist, the section will auto-hide even if turned on.
              </li>
              <li>
                <strong className="text-brand-orange-400">Gallery Section</strong>: Hides/shows the gallery images. If no active gallery photos exist, the section will auto-hide.
              </li>
              <li>
                <strong className="text-brand-orange-400">About Section</strong>: Controls visibility of the "About Mission Dilse" paragraph section.
              </li>
              <li>
                <strong className="text-brand-orange-400">Contact Section</strong>: Controls visibility of the contact details (email, phone, address).
              </li>
            </ul>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-brand-charcoal-900/60 border border-brand-charcoal-100/5 text-xs text-brand-charcoal-100/50 leading-relaxed">
            Note: Changes reflect immediately on the public website. Try opening the public site in another tab to see it live!
          </div>
        </div>
      </div>
    </div>
  )
}
