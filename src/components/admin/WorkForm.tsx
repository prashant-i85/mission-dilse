'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/cloudinary'
import { ArrowLeft, Loader2, Upload, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface WorkFormData {
  title: string
  description: string
  cover_image_url?: string | null
  is_visible: boolean
}

interface WorkFormProps {
  initialData?: WorkFormData
  onSubmit: (data: WorkFormData) => Promise<void>
  onCancel: () => void
  titleLabel: string
}

export default function WorkForm({
  initialData,
  onSubmit,
  onCancel,
  titleLabel,
}: WorkFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialData?.cover_image_url || null
  )
  const [isVisible, setIsVisible] = useState(initialData?.is_visible !== false)
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    setUploadingImage(true)
    setError(null)

    try {
      const url = await uploadImage(file)
      setCoverImageUrl(url)
    } catch (err: any) {
      setError(err.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setSaving(true)
    setError(null)

    try {
      await onSubmit({
        title,
        description,
        cover_image_url: coverImageUrl,
        is_visible: isVisible,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to save work details.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onCancel}
          className="p-2 rounded-xl bg-brand-charcoal-900 border border-brand-charcoal-100/10 text-brand-charcoal-100/70 hover:text-white transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold font-display text-white">{titleLabel}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-200 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
            Work Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm"
            placeholder="e.g. Winter Clothes Distribution 2026"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
            Description / Body text
          </label>
          <textarea
            id="description"
            rows={10}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm leading-relaxed"
            placeholder="Write full story here. Multi-paragraphs are supported..."
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
            Cover Image (Optional)
          </label>
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Image Preview */}
            <div className="relative w-40 h-32 rounded-2xl bg-brand-charcoal-900 border border-brand-charcoal-100/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {coverImageUrl ? (
                <Image
                  src={coverImageUrl}
                  alt="Cover image preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-brand-charcoal-100/20 text-xs">No Image</span>
              )}
            </div>

            {/* Upload Button */}
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
                    <span className="text-sm font-semibold">Upload Image</span>
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
                Supports JPG, PNG, WEBP. Uploads directly to Cloudinary CDN.
              </p>
            </div>
          </div>
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center gap-3 p-4 bg-brand-charcoal-900/40 border border-brand-charcoal-100/5 rounded-2xl">
          <input
            id="visible-toggle"
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="h-4.5 w-4.5 text-brand-orange-600 focus:ring-brand-orange-500 border-brand-charcoal-100/20 rounded accent-brand-orange-600"
          />
          <div>
            <label htmlFor="visible-toggle" className="text-sm font-semibold text-white cursor-pointer">
              Publish immediately
            </label>
            <span className="text-xs text-brand-charcoal-100/40 block mt-0.5">
              If checked, this story will appear on the homepage immediately.
            </span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-brand-charcoal-100/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 font-semibold text-sm text-brand-charcoal-100/70 hover:text-white bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm text-white bg-brand-orange-600 hover:bg-brand-orange-700 disabled:bg-brand-orange-600/50 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Work</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
