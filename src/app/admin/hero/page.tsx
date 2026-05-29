'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/cloudinary'
import { Save, Loader2, Check, AlertCircle, Info, Upload } from 'lucide-react'
import Image from 'next/image'

interface HeroData {
  ngo_name: string
  tagline: string
  slogans: string[]
  background_image_url?: string | null
}

const defaultHero = {
  ngo_name: 'MISSION DILSE',
  tagline: 'COMPASSION IN ACTION',
  slogans: ['EQUAL OPPORTUNITY', 'CHILD EDUCATION', 'COMMUNITY DEVOTION'],
  background_image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80',
}

export default function AdminHeroEditor() {
  const [ngoName, setNgoName] = useState('')
  const [tagline, setTagline] = useState('')
  const [slogan1, setSlogan1] = useState('')
  const [slogan2, setSlogan2] = useState('')
  const [slogan3, setSlogan3] = useState('')
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadHero() {
      try {
        const { data, error } = await supabase
          .from('hero_content')
          .select('*')
          .eq('id', 1)
          .single()

        if (error) {
          console.warn('Failed to load hero from database, using mock defaults.')
          setIsDemoMode(true)
          setNgoName(defaultHero.ngo_name)
          setTagline(defaultHero.tagline)
          setSlogan1(defaultHero.slogans[0])
          setSlogan2(defaultHero.slogans[1])
          setSlogan3(defaultHero.slogans[2])
          setBgImageUrl(defaultHero.background_image_url)
        } else if (data) {
          setNgoName(data.ngo_name || '')
          setTagline(data.tagline || '')
          setSlogan1(data.slogans?.[0] || '')
          setSlogan2(data.slogans?.[1] || '')
          setSlogan3(data.slogans?.[2] || '')
          setBgImageUrl(data.background_image_url || null)
        }
      } catch (err) {
        setIsDemoMode(true)
        setNgoName(defaultHero.ngo_name)
        setTagline(defaultHero.tagline)
        setSlogan1(defaultHero.slogans[0])
        setSlogan2(defaultHero.slogans[1])
        setSlogan3(defaultHero.slogans[2])
        setBgImageUrl(defaultHero.background_image_url)
      } finally {
        setLoading(false)
      }
    }
    loadHero()
  }, [supabase])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError(null)

    try {
      const url = await uploadImage(file)
      setBgImageUrl(url)
    } catch (err: any) {
      setError(err.message || 'Failed to upload background photo.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ngoName.trim() || !tagline.trim()) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    const updatedSlogans = [slogan1.trim(), slogan2.trim(), slogan3.trim()].filter(Boolean)

    if (isDemoMode) {
      setTimeout(() => {
        setSaving(false)
        setSuccess(true)
      }, 1000)
      return
    }

    try {
      const { error: upsertError } = await supabase
        .from('hero_content')
        .upsert(
          {
            id: 1,
            ngo_name: ngoName.trim(),
            tagline: tagline.trim(),
            slogans: updatedSlogans,
            background_image_url: bgImageUrl,
          },
          { onConflict: 'id' }
        )

      if (upsertError) {
        throw new Error(upsertError.message)
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to save Hero contents.')
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
          Hero Editor
        </h1>
        <p className="text-brand-charcoal-100/60 text-sm">
          Tweak the header section display including background image, slogans, and taglines
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
              <span>Hero layout updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NGO Name */}
            <div>
              <label htmlFor="ngo-name" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                NGO Name (Large Display)
              </label>
              <input
                id="ngo-name"
                type="text"
                required
                value={ngoName}
                onChange={(e) => setNgoName(e.target.value)}
                className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm"
                placeholder="e.g. MISSION DILSE"
              />
            </div>

            {/* Tagline */}
            <div>
              <label htmlFor="tagline" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                Tagline Badge
              </label>
              <input
                id="tagline"
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm"
                placeholder="e.g. COMPASSION IN ACTION"
              />
            </div>
          </div>

          {/* Slogans stack */}
          <div className="space-y-4 pt-2 border-t border-brand-charcoal-100/5">
            <h3 className="text-sm font-bold text-white">Focus Slogans (Stacked in Hero)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Slogan 1 (Solid Emerald Green)
                </label>
                <input
                  type="text"
                  value={slogan1}
                  onChange={(e) => setSlogan1(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                  placeholder="e.g. EQUAL OPPORTUNITY"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Slogan 2 (Outline Text)
                </label>
                <input
                  type="text"
                  value={slogan2}
                  onChange={(e) => setSlogan2(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                  placeholder="e.g. CHILD EDUCATION"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-charcoal-100/55 mb-1.5">
                  Slogan 3 (Solid White)
                </label>
                <input
                  type="text"
                  value={slogan3}
                  onChange={(e) => setSlogan3(e.target.value)}
                  className="block w-full px-4 py-2.5 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-xl text-white focus:outline-none focus:border-brand-orange-500 text-xs"
                  placeholder="e.g. COMMUNITY DEVOTION"
                />
              </div>
            </div>
          </div>

          {/* Hero background image upload */}
          <div className="pt-2 border-t border-brand-charcoal-100/5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
              Background Photo (Clear inside letters, blurred outside)
            </label>
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative w-44 h-28 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-100/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {bgImageUrl ? (
                  <Image
                    src={bgImageUrl}
                    alt="Background image preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-brand-charcoal-100/20 text-xs">No Photo</span>
                )}
              </div>

              <div className="w-full sm:w-auto">
                <label className="relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-dashed border-brand-charcoal-100/20 hover:border-brand-orange-500 text-brand-charcoal-100/70 hover:text-white cursor-pointer transition-all">
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-brand-orange-500" />
                      <span className="text-sm font-semibold">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span className="text-sm font-semibold">Upload Background Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <p className="text-brand-charcoal-100/40 text-[11px] mt-2">
                  Supports high-resolution PNG, JPG, WEBP.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-brand-charcoal-100/10">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm text-white bg-brand-orange-600 hover:bg-brand-orange-700 disabled:bg-brand-orange-600/50 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Layout...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Layout</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
