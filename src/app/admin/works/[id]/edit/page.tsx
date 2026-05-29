'use client'

import { useState, useEffect, use } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import WorkForm from '@/components/admin/WorkForm'
import { Loader2 } from 'lucide-react'

interface Work {
  id: string
  title: string
  description: string
  cover_image_url?: string | null
  is_visible: boolean
}

// Initial mock data reference
const mockWorks = [
  {
    id: 'mock-1',
    title: 'Food Distribution Drive',
    description: 'We successfully distributed over 500 meals to daily wage workers and children in the local community.',
    is_visible: true,
  },
  {
    id: 'mock-2',
    title: 'Free Health Checkup Camp',
    description: 'Organized a free health and eye checkup camp in collaboration with local hospitals.',
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
  
  const supabase = createClient()

  useEffect(() => {
    async function loadWork() {
      if (id.startsWith('mock-')) {
        setIsDemoMode(true)
        const found = mockWorks.find((w) => w.id === id)
        setWork(found || null)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.warn('Failed to load work, falling back to mock data.')
          setIsDemoMode(true)
          const found = mockWorks.find((w) => w.id === id)
          setWork(found || null)
        } else {
          setWork(data)
        }
      } catch (err) {
        setIsDemoMode(true)
        const found = mockWorks.find((w) => w.id === id)
        setWork(found || null)
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
      const { error } = await supabase
        .from('works')
        .update({
          title: formData.title,
          description: formData.description,
          cover_image_url: formData.cover_image_url,
          is_visible: formData.is_visible,
          updated_at: new Date().toISOString(),
        })
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
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/works')}
      />
    </div>
  )
}
