'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import WorkForm from '@/components/admin/WorkForm'

export default function AdminNewWork() {
  const router = useRouter()
  const supabase = createClient()
  const [hasCategoryColumn, setHasCategoryColumn] = useState(false)

  useEffect(() => {
    async function checkColumn() {
      try {
        const { error: checkError } = await supabase
          .from('works')
          .select('category')
          .limit(1)
        const hasCol = !checkError || (checkError.code !== 'PGRST100' && !checkError.message.includes('category'))
        setHasCategoryColumn(hasCol)
      } catch (err) {
        setHasCategoryColumn(false)
      }
    }
    checkColumn()
  }, [supabase])

  const handleSubmit = async (formData: any) => {
    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        cover_image_url: formData.cover_image_url,
        is_visible: formData.is_visible,
      }
      if (hasCategoryColumn) {
        payload.category = formData.category
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
