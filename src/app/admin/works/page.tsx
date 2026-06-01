'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, Calendar, FileText, Info } from 'lucide-react'

interface Work {
  id: string
  title: string
  description: string
  cover_image_url?: string | null
  is_visible: boolean
  created_at: string
  category?: string
}

// Initial mock data for developer preview
const initialMockWorks: Work[] = [
  {
    id: 'mock-1',
    title: 'Food Distribution Drive',
    description: 'We successfully distributed over 500 meals to daily wage workers and children in the local community.',
    is_visible: true,
    created_at: new Date().toISOString(),
    category: 'DISTRIBUTION',
  },
  {
    id: 'mock-2',
    title: 'Free Health Checkup Camp',
    description: 'Organized a free health and eye checkup camp in collaboration with local hospitals.',
    is_visible: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'HEALTHCARE',
  },
]

export default function AdminWorksList() {
  const [works, setWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function loadWorks() {
      try {
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.warn('Failed to load works from DB, using mock data.')
          setIsDemoMode(true)
          setWorks(initialMockWorks)
        } else {
          setWorks(data || [])
        }
      } catch (err) {
        setIsDemoMode(true)
        setWorks(initialMockWorks)
      } finally {
        setLoading(false)
      }
    }
    loadWorks()
  }, [supabase])

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus
    
    // Update local state
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, is_visible: nextStatus } : w))
    )

    if (isDemoMode) return

    try {
      const { error } = await supabase
        .from('works')
        .update({ is_visible: nextStatus })
        .eq('id', id)

      if (error) {
        // Rollback
        setWorks((prev) =>
          prev.map((w) => (w.id === id ? { ...w, is_visible: currentStatus } : w))
        )
        alert(`Failed to update visibility: ${error.message}`)
      }
    } catch (err: any) {
      // Rollback
      setWorks((prev) =>
        prev.map((w) => (w.id === id ? { ...w, is_visible: currentStatus } : w))
      )
      alert(`Error toggling visibility: ${err.message || err}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) {
      return
    }

    setDeletingId(id)

    if (isDemoMode) {
      setWorks((prev) => prev.filter((w) => w.id !== id))
      setDeletingId(null)
      return
    }

    try {
      const { error } = await supabase.from('works').delete().eq('id', id)
      
      if (error) {
        alert(`Failed to delete work: ${error.message}`)
      } else {
        setWorks((prev) => prev.filter((w) => w.id !== id))
      }
    } catch (err: any) {
      alert(`Error deleting work: ${err.message || err}`)
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Works Manager
          </h1>
          <p className="text-brand-charcoal-100/60 text-sm">
            Add, update, hide, or delete NGO works and projects
          </p>
        </div>
        <Link
          href="/admin/works/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-orange-600 hover:bg-brand-orange-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Work</span>
        </Link>
      </div>

      {isDemoMode && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
          <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>Running in Demo Mode. Actions will update list locally but will not persist.</span>
        </div>
      )}

      {/* List Container */}
      <div className="bg-brand-charcoal-800 border border-brand-charcoal-100/10 rounded-3xl overflow-hidden shadow-xl">
        {works.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-full bg-brand-charcoal-900 border border-brand-charcoal-100/5 text-brand-charcoal-100/20">
              <FileText className="h-12 w-12" />
            </div>
            <div>
              <p className="text-white font-semibold">No works found</p>
              <p className="text-brand-charcoal-100/50 text-xs mt-1">Get started by creating your first NGO work post</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-brand-charcoal-100/10 bg-brand-charcoal-900/40 text-brand-charcoal-100/50 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Title / Info</th>
                  <th className="py-4 px-6">Date Created</th>
                  <th className="py-4 px-6">Visibility</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-charcoal-100/5">
                {works.map((work) => {
                  const dateStr = new Date(work.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })

                  return (
                    <tr
                      key={work.id}
                      className="hover:bg-brand-charcoal-100/5 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">{work.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {work.category && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-brand-gold-500/10 border border-brand-gold-500/25 text-[10px] font-extrabold text-brand-gold-500 uppercase tracking-wider select-none shrink-0">
                              {work.category}
                            </span>
                          )}
                          <span className="text-xs text-brand-charcoal-100/50 line-clamp-1">
                            {work.description}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-brand-charcoal-100/70 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-brand-charcoal-100/30" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {work.is_visible ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Eye className="h-3 w-3" />
                            <span>Visible</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-charcoal-100/10 border border-brand-charcoal-100/20 text-brand-charcoal-100/40">
                            <EyeOff className="h-3 w-3" />
                            <span>Hidden</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap text-sm">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => toggleVisibility(work.id, work.is_visible)}
                            className="p-2 rounded-xl text-brand-charcoal-100/60 hover:text-brand-orange-500 hover:bg-brand-charcoal-900 border border-transparent hover:border-brand-charcoal-100/10 transition-all"
                            title={work.is_visible ? 'Hide' : 'Unhide'}
                          >
                            {work.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          
                          <Link
                            href={`/admin/works/${work.id}/edit`}
                            className="p-2 rounded-xl text-brand-charcoal-100/60 hover:text-brand-orange-500 hover:bg-brand-charcoal-900 border border-transparent hover:border-brand-charcoal-100/10 transition-all inline-block"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>

                          <button
                            disabled={deletingId === work.id}
                            onClick={() => handleDelete(work.id)}
                            className="p-2 rounded-xl text-brand-charcoal-100/60 hover:text-red-400 hover:bg-brand-charcoal-900 border border-transparent hover:border-brand-charcoal-100/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
