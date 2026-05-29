'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, Save, Loader2, Check, AlertCircle, Info } from 'lucide-react'

interface AboutContent {
  heading?: string | null
  body: string
}

const mockAbout = {
  heading: 'About Mission Dilse',
  body: 'Mission Dilse is a non-profit organization started with a single, clear vision: to bring hope, relief, and opportunity to the most vulnerable sections of our society.\n\nWe believe that true service comes from the heart ("Dilse"). Our primary focus areas include basic child education support, nutritional food security, health camps, and building sustainable community capabilities.',
}

export default function AdminAboutEditor() {
  const [heading, setHeading] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadAbout() {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('heading, body')
          .eq('id', 1)
          .single()

        if (error) {
          console.warn('Failed to load about details from database, using mock defaults.')
          setIsDemoMode(true)
          setHeading(mockAbout.heading)
          setBody(mockAbout.body)
        } else if (data) {
          setHeading(data.heading || '')
          setBody(data.body || '')
        }
      } catch (err) {
        setIsDemoMode(true)
        setHeading(mockAbout.heading)
        setBody(mockAbout.body)
      } finally {
        setLoading(false)
      }
    }
    loadAbout()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    if (isDemoMode) {
      setTimeout(() => {
        setSaving(false)
        setSuccess(true)
      }, 1000)
      return
    }

    try {
      const { error: upsertError } = await supabase
        .from('about_content')
        .upsert(
          {
            id: 1,
            heading: heading.trim() || null,
            body: body.trim(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )

      if (upsertError) {
        throw new Error(upsertError.message)
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to save About contents.')
    } finally {
      setSaving(false)
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
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          About Editor
        </h1>
        <p className="text-brand-charcoal-100/60 text-sm">
          Edit the main about story paragraph displayed on the public page
        </p>
      </div>

      {isDemoMode && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>Running in Demo Mode. Edits will simulate saving but will not persist.</span>
        </div>
      )}

      {/* Editor Form */}
      <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-200 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-sm">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>About details updated successfully!</span>
            </div>
          )}

          {/* Heading */}
          <div>
            <label htmlFor="about-heading" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
              Heading (Optional)
            </label>
            <input
              id="about-heading"
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm"
              placeholder="e.g. About Mission Dilse"
            />
          </div>

          {/* Body content */}
          <div>
            <label htmlFor="about-body" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
              About Body Text
            </label>
            <textarea
              id="about-body"
              rows={12}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm leading-relaxed"
              placeholder="Write the NGO profile description..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm text-white bg-brand-orange-600 hover:bg-brand-orange-700 disabled:bg-brand-orange-600/50 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
