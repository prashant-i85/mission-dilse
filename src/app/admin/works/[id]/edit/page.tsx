'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import WorkForm from '@/components/admin/WorkForm'
import { Loader2 } from 'lucide-react'
import { parseWorkVideo, encodeVideoInDescription } from '@/lib/videoHelper'

interface Work {
  id: string
  title: string
  description: string
  cover_image_url?: string | null
  video_url?: string | null
  is_visible: boolean
  category?: string | null
}

// Initial mock data reference
const mockWorks = [
  {
    id: 'mock-1',
    title: 'Food Distribution Drive & Field Video',
    description: 'We successfully distributed over 500 meals to daily wage workers and children in the local community.',
    cover_image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    is_visible: true,
  },
  {
    id: 'mock-2',
    title: 'Free Health Checkup Camp',
    description: 'Organized a free health and eye checkup camp in collaboration with local hospitals.',
    cover_image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60',
    video_url: '',
    is_visible: false,
  },
]

export default function AdminEditWork() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [work, setWork] = useState<Work | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [hasCategoryColumn, setHasCategoryColumn] = useState(false)
  const [hasVideoColumn, setHasVideoColumn] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadWork() {
      if (id.startsWith('mock-')) {
        setIsDemoMode(true)
        setHasCategoryColumn(true)
        setHasVideoColumn(true)
        const found = mockWorks.find((w) => w.id === id)
        if (found) {
          const parsed = parseWorkVideo(found)
          setWork({
            ...found,
            video_url: parsed.video_url,
            description: parsed.description,
          })
        } else {
          setWork(null)
        }
        setLoading(false)
        return
      }

      try {
        // Dynamic column checks
        const { error: checkCatError } = await supabase
          .from('works')
          .select('category')
          .limit(1)
        const hasCat = !checkCatError || (checkCatError.code !== 'PGRST100' && !checkCatError.message?.includes('category'))
        setHasCategoryColumn(hasCat)

        const { error: checkVidError } = await supabase
          .from('works')
          .select('video_url')
          .limit(1)
        const hasVid = !checkVidError || (checkVidError.code !== 'PGRST100' && !checkVidError.message?.includes('video_url'))
        setHasVideoColumn(hasVid)

        const { data, error } = await supabase
          .from('works')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.warn('Failed to load work, falling back to mock data.')
          setIsDemoMode(true)
          setHasCategoryColumn(true)
          setHasVideoColumn(true)
          const found = mockWorks.find((w) => w.id === id)
          if (found) {
            const parsed = parseWorkVideo(found)
            setWork({
              ...found,
              video_url: parsed.video_url,
              description: parsed.description,
            })
          } else {
            setWork(null)
          }
        } else if (data) {
          const parsed = parseWorkVideo(data)
          setWork({
            ...data,
            video_url: parsed.video_url,
            description: parsed.description,
          })
        }
      } catch (err) {
        setIsDemoMode(true)
        setHasCategoryColumn(true)
        setHasVideoColumn(true)
        const found = mockWorks.find((w) => w.id === id)
        if (found) {
          const parsed = parseWorkVideo(found)
          setWork({
            ...found,
            video_url: parsed.video_url,
            description: parsed.description,
          })
        } else {
          setWork(null)
        }
      } finally {
        setLoading(false)
      }
    }
    loadWork()
  }, [id, supabase])

  const handleSubmit = async (formData: any) => {
    if (isDemoMode) {
      console.log('Saved work details in demo mode:', formData)
      router.push('/admin/works')
      router.refresh()
      return
    }

    try {
      // If DB doesn't have video_url column, embed it in description
      let finalDescription = formData.description
      if (!hasVideoColumn && formData.video_url && formData.video_url.trim().length > 0) {
        finalDescription = encodeVideoInDescription(formData.description, formData.video_url.trim())
      }

      const payload: any = {
        title: formData.title,
        description: finalDescription,
        cover_image_url: formData.cover_image_url,
        is_visible: formData.is_visible,
        updated_at: new Date().toISOString(),
      }

      if (hasVideoColumn) {
        payload.video_url = formData.video_url?.trim() || null
      }

      if (hasCategoryColumn) {
        payload.category = formData.category?.trim() || null
      }

      const { error } = await supabase
        .from('works')
        .update(payload)
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      router.push('/admin/works')
      router.refresh()
    } catch (err: any) {
      alert(`Failed to save changes: ${err.message || err}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-brand-orange-500 animate-spin" />
      </div>
    )
  }

  if (!work) {
    return (
      <div className="p-6 text-center text-white bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl">
        Work not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <WorkForm
        titleLabel="Edit Work Details"
        initialData={work}
        hasCategoryColumn={hasCategoryColumn}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/works')}
      />
    </div>
  )
}
