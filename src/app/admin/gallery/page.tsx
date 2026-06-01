'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/cloudinary'
import {
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Info,
} from 'lucide-react'
import Image from 'next/image'
import ImageCropper from '@/components/admin/ImageCropper'

interface Photo {
  id: string
  image_url: string
  caption?: string | null
  is_visible: boolean
  created_at: string
}

const initialMockPhotos: Photo[] = [
  {
    id: 'mock-p1',
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=60',
    caption: 'Smiling children receiving school supplies',
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-p2',
    image_url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&auto=format&fit=crop&q=60',
    caption: 'Volunteers planning the distribution drive',
    is_visible: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export default function AdminGalleryManager() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [caption, setCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadPhotos() {
      try {
        const { data, error } = await supabase
          .from('photos')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.warn('Failed to load photos from DB, using mock data.')
          setIsDemoMode(true)
          setPhotos(initialMockPhotos)
        } else {
          setPhotos(data || [])
        }
      } catch (err) {
        setIsDemoMode(true)
        setPhotos(initialMockPhotos)
      } finally {
        setLoading(false)
      }
    }
    loadPhotos()
  }, [supabase])

  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [rawImageFile, setRawImageFile] = useState<File | null>(null)
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRawImageFile(e.target.files[0])
      setIsCropperOpen(true)
      setError(null)
    }
  }

  const handleCropComplete = (croppedFile: File, croppedUrl: string) => {
    setSelectedFile(croppedFile)
    setCroppedPreviewUrl(croppedUrl)
    setIsCropperOpen(false)
    setRawImageFile(null)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      // 1. Upload to Cloudinary
      const imageUrl = await uploadImage(selectedFile)

      if (isDemoMode) {
        const newPhoto: Photo = {
          id: `mock-uploaded-${Math.random()}`,
          image_url: imageUrl,
          caption: caption.trim() || null,
          is_visible: true,
          created_at: new Date().toISOString(),
        }
        setPhotos((prev) => [newPhoto, ...prev])
        setSuccess(true)
        setCaption('')
        setCroppedPreviewUrl(null)
        // Reset file input value
        const fileInput = document.getElementById('photo-upload-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        return
      }

      // 2. Insert row into photos table
      const { data, error: insertError } = await supabase
        .from('photos')
        .insert([
          {
            image_url: imageUrl,
            caption: caption.trim() || null,
            is_visible: true,
          },
        ])
        .select()

      if (insertError) {
        throw new Error(insertError.message)
      }

      if (data && data.length > 0) {
        setPhotos((prev) => [data[0], ...prev])
      }

      setSuccess(true)
      setCaption('')
      setSelectedFile(null)
      setCroppedPreviewUrl(null)
      const fileInput = document.getElementById('photo-upload-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (err: any) {
      setError(err.message || 'Failed to upload photo. Please verify environment keys.')
    } finally {
      setUploading(false)
    }
  }

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id)
    const nextStatus = !currentStatus

    // Optimistic state update
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_visible: nextStatus } : p))
    )

    if (isDemoMode) {
      setUpdatingId(null)
      return
    }

    try {
      const { error } = await supabase
        .from('photos')
        .update({ is_visible: nextStatus })
        .eq('id', id)

      if (error) {
        // Rollback
        setPhotos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_visible: currentStatus } : p))
        )
        alert(`Failed to update visibility: ${error.message}`)
      }
    } catch (err: any) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_visible: currentStatus } : p))
      )
      alert(`Error toggling visibility: ${err.message || err}`)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this photo? This cannot be undone.')) {
      return
    }

    setDeletingId(id)

    if (isDemoMode) {
      setPhotos((prev) => prev.filter((p) => p.id !== id))
      setDeletingId(null)
      return
    }

    try {
      const { error } = await supabase.from('photos').delete().eq('id', id)
      
      if (error) {
        alert(`Failed to delete photo: ${error.message}`)
      } else {
        setPhotos((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (err: any) {
      alert(`Error deleting photo: ${err.message || err}`)
    } finally {
      setDeletingId(null)
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
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
          Gallery Manager
        </h1>
        <p className="text-brand-charcoal-100/60 text-sm">
          Upload and manage photos displayed in the public gallery section
        </p>
      </div>

      {isDemoMode && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>Running in Demo Mode. Uploads generate temporary random placeholders.</span>
        </div>
      )}

      {/* Upload and Form panel */}
      <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-lg font-bold font-display text-white mb-4">Upload New Photo</h2>
        <form onSubmit={handleUpload} className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-200 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-sm">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>Photo uploaded successfully and added to the gallery!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                Select Photo
              </label>
              <div className="relative">
                <input
                  id="photo-upload-input"
                  type="file"
                  required
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-brand-charcoal-100/50 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-charcoal-800 file:text-white file:cursor-pointer file:hover:bg-brand-charcoal-700 text-xs focus:outline-none focus:border-brand-orange-500 transition-all"
                />
              </div>
              {croppedPreviewUrl && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-brand-charcoal-100/50">Cropped Image Preview:</p>
                  <div className="relative w-36 h-28 rounded-xl bg-brand-charcoal-900 border border-brand-charcoal-100/10 overflow-hidden">
                    <img src={croppedPreviewUrl} alt="Cropped Preview" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-brand-charcoal-100/40">
                    Ready to upload ({(selectedFile!.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>

            {/* Caption Input */}
            <div>
              <label htmlFor="caption" className="block text-xs font-semibold uppercase tracking-wider text-brand-charcoal-100/70 mb-2">
                Caption (Optional)
              </label>
              <input
                id="caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="block w-full px-4 py-3 bg-brand-charcoal-900 border border-brand-charcoal-100/10 rounded-2xl text-white placeholder-brand-charcoal-100/30 focus:outline-none focus:border-brand-orange-500 transition-all text-sm"
                placeholder="e.g. Health camp distribution volunteers"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm text-white bg-brand-orange-600 hover:bg-brand-orange-700 disabled:bg-brand-orange-600/50 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Photo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Grid of uploaded photos */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold font-display text-white">Uploaded Photos ({photos.length})</h2>
        {photos.length === 0 ? (
          <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4 shadow-md">
            <div className="p-4 rounded-full bg-brand-charcoal-900 border border-brand-charcoal-100/5 text-brand-charcoal-100/20">
              <ImageIcon className="h-12 w-12" />
            </div>
            <div>
              <p className="text-white font-semibold">No photos in the gallery</p>
              <p className="text-brand-charcoal-100/50 text-xs mt-1">Upload your first photo above to display it on the website</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between"
              >
                {/* Photo Image with overlay if hidden */}
                <div className="relative aspect-square w-full bg-brand-charcoal-900 overflow-hidden">
                  <Image
                    src={photo.image_url}
                    alt={photo.caption || 'Gallery photo'}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      !photo.is_visible ? 'opacity-40' : ''
                    }`}
                  />
                  {!photo.is_visible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-charcoal-900 border border-brand-charcoal-100/20 text-brand-charcoal-100/80">
                        Hidden
                      </span>
                    </div>
                  )}
                </div>

                {/* Caption / Actions panel */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <p className="text-xs text-brand-charcoal-100/70 font-medium line-clamp-2 min-h-[2rem] leading-relaxed mb-4">
                    {photo.caption || <span className="italic opacity-40">No caption</span>}
                  </p>
                  
                  {/* Actions buttons */}
                  <div className="flex items-center justify-between border-t border-brand-charcoal-100/5 pt-3">
                    <button
                      disabled={updatingId === photo.id}
                      onClick={() => toggleVisibility(photo.id, photo.is_visible)}
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl transition-all ${
                        photo.is_visible
                          ? 'text-brand-charcoal-100/50 hover:text-brand-orange-500 hover:bg-brand-charcoal-950'
                          : 'text-brand-orange-400 hover:text-brand-orange-300 hover:bg-brand-charcoal-950'
                      }`}
                    >
                      {updatingId === photo.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : photo.is_visible ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          <span>Unhide</span>
                        </>
                      )}
                    </button>

                    <button
                      disabled={deletingId === photo.id}
                      onClick={() => handleDelete(photo.id)}
                      className="p-1.5 text-brand-charcoal-100/40 hover:text-red-400 hover:bg-brand-charcoal-950 rounded-xl transition-all disabled:opacity-50"
                      title="Delete Photo"
                    >
                      {deletingId === photo.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ImageCropper
        isOpen={isCropperOpen}
        file={rawImageFile}
        aspectRatio={4 / 3}
        onCrop={handleCropComplete}
        onCancel={() => {
          setIsCropperOpen(false)
          setRawImageFile(null)
          const fileInput = document.getElementById('photo-upload-input') as HTMLInputElement
          if (fileInput) fileInput.value = ''
        }}
      />
    </div>
  )
}
