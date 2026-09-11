'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import WorkForm from '@/components/admin/WorkForm'
import { encodeVideoInDescription } from '@/lib/videoHelper'

export default function AdminNewWork() {
  const router = useRouter()
  const supabase = createClient()
  const [hasCategoryColumn, setHasCategoryColumn] = useState(false)
  const [hasVideoColumn, setHasVideoColumn] = useState(false)

  useEffect(() => {
    async function checkColumns() {
      try {
        const { error: catError } = await supabase
          .from('works')
          .select('category')
          .limit(1)
        const hasCat = !catError || (catError.code !== 'PGRST100' && !catError.message?.includes('category'))
        setHasCategoryColumn(hasCat)

        const { error: vidError } = await supabase
          .from('works')
          .select('video_url')
          .limit(1)
        const hasVid = !vidError || (vidError.code !== 'PGRST100' && !vidError.message?.includes('video_url'))
        setHasVideoColumn(hasVid)
      } catch (err) {
        setHasCategoryColumn(false)
        setHasVideoColumn(false)
      }
    }
    checkColumns()
  }, [supabase])

  const handleSubmit = async (formData: any) => {
    try {
      // If DB has video_url column, store in video_url; otherwise embed in description
      let finalDescription = formData.description
      if (!hasVideoColumn && formData.video_url && formData.video_url.trim().length > 0) {
        finalDescription = encodeVideoInDescription(formData.description, formData.video_url.trim())
      }

      const payload: any = {
        title: formData.title,
        description: finalDescription,
        cover_image_url: formData.cover_image_url,
        is_visible: formData.is_visible,
      }

      if (hasVideoColumn) {
        payload.video_url = formData.video_url?.trim() || null
      }

      if (hasCategoryColumn) {
        payload.category = formData.category?.trim() || null
      }

      const { error } = await supabase.from('works').insert([payload])

      if (error) {
        throw new Error(error.message)
      }

      router.push('/admin/works')
      router.refresh()
    } catch (err: any) {
      console.warn('Supabase insert failed or not configured. Redirecting in demo mode.')
      // In demo mode, redirect back to list anyway
      router.push('/admin/works')
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <WorkForm
        titleLabel="Add New Work"
        hasCategoryColumn={hasCategoryColumn}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/works')}
      />
    </div>
  )
}
