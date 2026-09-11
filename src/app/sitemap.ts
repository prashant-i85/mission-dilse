import type { MetadataRoute } from 'next'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const revalidate = 3600 // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://missiondilse.com'

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseKey) {
    try {
      // Direct client without cookies so it works seamlessly during static/ISR generation
      const supabase = createSupabaseClient(supabaseUrl, supabaseKey)
      const { data: works } = await supabase
        .from('works')
        .select('id, updated_at, created_at')

      if (works && works.length > 0) {
        works.forEach((work) => {
          routes.push({
            url: `${baseUrl}/#work-${work.id}`,
            lastModified: work.updated_at
              ? new Date(work.updated_at)
              : work.created_at
              ? new Date(work.created_at)
              : new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
          })
        })
      }
    } catch (err) {
      console.error('Error fetching works for sitemap:', err)
    }
  }

  return routes
}
