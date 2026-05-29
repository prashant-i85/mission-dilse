'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, Check, AlertCircle, PhoneCall, Info } from 'lucide-react'

interface ContactContent {
  email?: string | null
  phone?: string | null
  address?: string | null
  extra_info?: string | null
}

const mockContact = {
  email: 'info@missiondilse.org',
  phone: '+91 98765 43210',
  address: '12, Community Centre, Okhla Phase 3, New Delhi, India',
  extra_info: 'Our team is available from Monday to Saturday, 10 AM to 6 PM.',
}

export default function AdminContactEditor() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [extraInfo, setExtraInfo] = useState('')
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadContact() {
      try {
        const { data, error } = await supabase
          .from('contact_content')
          .select('email, phone, address, extra_info')
          .eq('id', 1)
          .single()

        if (error) {
          console.warn('Failed to load contact details from database, using mock defaults.')
          setIsDemoMode(true)
          setEmail(mockContact.email)
          setPhone(mockContact.phone)
          setAddress(mockContact.address)
          setExtraInfo(mockContact.extra_info)
        } else if (data) {
          setEmail(data.email || '')
          setPhone(data.phone || '')
          setAddress(data.address || '')
          setExtraInfo(data.extra_info || '')
        }
      } catch (err) {
        setIsDemoMode(true)
        setEmail(mockContact.email)
        setPhone(mockContact.phone)
        setAddress(mockContact.address)
        setExtraInfo(mockContact.extra_info)
      } finally {
        setLoading(false)
      }
    }
    loadContact()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

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
        .from('contact_content')
        .upsert(
          {
            id: 1,
            email: email.trim() || null,
            phone: phone.trim() || null,
            address: address.trim() || null,
            extra_info: extraInfo.trim() || null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )

      if (upsertError) {
        throw new Error(upsertError.message)
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to save Contact details.')
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
          Contact Editor
        </h1>
        <p className="text-brand-charcoal-100/60 text-sm">
          Edit address, phone, email, and additional contact details shown on the homepage
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
              <span>Contact details updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm"
                placeholder="info@missiondilse.org"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="contact-phone" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm"
                placeholder="e.g. +91 98765 43210"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="contact-address" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
              Physical Address
            </label>
            <textarea
              id="contact-address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm leading-relaxed"
              placeholder="e.g. Okhla Phase 3, New Delhi, India"
            />
          </div>

          {/* Extra Info */}
          <div>
            <label htmlFor="contact-extra" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
              Extra Information / Donation Notes
            </label>
            <textarea
              id="contact-extra"
              rows={4}
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm leading-relaxed"
              placeholder="Add details about volunteering hours, specific donations needed, etc."
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
