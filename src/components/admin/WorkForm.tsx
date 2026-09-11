'use client'

import { useState, useRef } from 'react'
import { uploadImage, uploadVideo } from '@/lib/cloudinary'
import { ArrowLeft, Loader2, Upload, Video, Check, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import ImageCropper from '@/components/admin/ImageCropper'
import { parseWorkVideo } from '@/lib/videoHelper'

interface WorkFormData {
  title: string
  description: string
  cover_image_url?: string | null
  video_url?: string | null
  is_visible: boolean
  category?: string
}

interface WorkFormProps {
  initialData?: any
  onSubmit: (data: WorkFormData) => Promise<void>
  onCancel: () => void
  titleLabel: string
  hasCategoryColumn: boolean
}

export default function WorkForm({
  initialData,
  onSubmit,
  onCancel,
  titleLabel,
  hasCategoryColumn,
}: WorkFormProps) {
  const initialParsed = parseWorkVideo({
    video_url: initialData?.video_url,
    description: initialData?.description,
  })

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialParsed.description)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(
    initialData?.cover_image_url || null
  )
  const [videoUrl, setVideoUrl] = useState(initialParsed.video_url || '')
  const [isVisible, setIsVisible] = useState(initialData?.is_visible !== false)
  const [category, setCategory] = useState(initialData?.category || '')
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const videoFileInputRef = useRef<HTMLInputElement>(null)

  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [rawImageFile, setRawImageFile] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setRawImageFile(file)
    setIsCropperOpen(true)
  }

  const handleCropComplete = async (croppedFile: File) => {
    setIsCropperOpen(false)
    setImageFile(croppedFile)
    setUploadingImage(true)
    setError(null)

    try {
      const url = await uploadImage(croppedFile)
      setCoverImageUrl(url)
    } catch (err: any) {
      setError(err.message || 'Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
      setRawImageFile(null)
    }
  }

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideo(true)
    setError(null)
    try {
      const url = await uploadVideo(file)
      setVideoUrl(url)
    } catch (err: any) {
      setError(err.message || 'Failed to upload video. Please try again.')
    } finally {
      setUploadingVideo(false)
      // Reset file input so same file can be re-selected if needed
      if (videoFileInputRef.current) videoFileInputRef.current.value = ''
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
        video_url: videoUrl.trim(),
        is_visible: isVisible,
        category: category.trim(),
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

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
            Work Category / Focus Area
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. ELDER WORK, EDUCATION, DONATION, HEALTHCARE"
            className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm"
          />
          {!hasCategoryColumn && (
            <p className="text-amber-500 text-[10px] mt-1.5 leading-normal">
              ⚠️ <strong>Database update required:</strong> To save this category, copy and run this in your **Supabase SQL Editor**: <code className="bg-black/35 px-1.5 py-0.5 rounded text-amber-200 font-mono text-[10px] select-all">ALTER TABLE works ADD COLUMN IF NOT EXISTS category text;</code>
            </p>
          )}
        </div>

        {/* Video Feed */}
        <div>
          <label htmlFor="video_url" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
            Video Feed (Optional)
          </label>

          {/* URL text input */}
          <div className="flex gap-2 items-center">
            <input
              id="video_url"
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={uploadingVideo}
              placeholder="Paste YouTube link or upload a video file →"
              className="block flex-1 min-w-0 px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm font-mono disabled:opacity-50"
            />

            {/* Upload video file button */}
            <label className={`relative inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-dashed transition-all shrink-0 ${
              uploadingVideo
                ? 'border-brand-orange-500/40 text-brand-orange-400 cursor-wait'
                : 'border-brand-charcoal-100/20 hover:border-brand-orange-500 text-brand-charcoal-100/70 hover:text-white cursor-pointer'
            }`}>
              {uploadingVideo ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-brand-orange-500" />
                  <span className="text-sm font-semibold">Uploading…</span>
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  <span className="text-sm font-semibold">Upload File</span>
                </>
              )}
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                disabled={uploadingVideo}
                className="hidden"
              />
            </label>
          </div>

          {/* Status hint */}
          {videoUrl && !uploadingVideo ? (
            <p className="text-emerald-400 text-[11px] mt-1.5 flex items-center gap-1">
              <Check className="h-3 w-3" /> Video URL set. Will preview on the public page.
            </p>
          ) : (
            <p className="text-brand-charcoal-100/40 text-[11px] mt-1.5">
              Upload an MP4/WebM file or paste a YouTube / direct video link.
            </p>
          )}
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
                  id="work-upload-input"
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
            disabled={saving || uploadingImage || uploadingVideo}
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

      <ImageCropper
        isOpen={isCropperOpen}
        file={rawImageFile}
        aspectRatio={4 / 3}
        onCrop={handleCropComplete}
        onCancel={() => {
          setIsCropperOpen(false)
          setRawImageFile(null)
          const fileInput = document.getElementById('work-upload-input') as HTMLInputElement
          if (fileInput) fileInput.value = ''
        }}
      />
    </div>
  )
}
