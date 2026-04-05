// app/sitemap.ts
import { supabase } from '@/lib/supabase'
import { MetadataRoute } from 'next'

// ✅ 수정: kkulter.com으로 변경
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kkulter.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/utilities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/ai-messages`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/room-checklist`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/eviction-defense`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/roommate-peace`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/management-check`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/archive`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.7 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  const { data: questions } = await supabase
    .from('questions')
    .select('slug, created_at, category')
    .order('created_at', { ascending: false })
    .limit(1000)

  const archivePages: MetadataRoute.Sitemap = (questions ?? []).map((q) => ({
    url: `${BASE_URL}/archive/${q.slug}`,
    lastModified: new Date(q.created_at),
    changeFrequency: 'monthly' as const,
    priority: q.category === 'eviction' ? 0.8 : q.category === 'roommate' ? 0.75 : 0.7,
  }))

  return [...staticPages, ...archivePages]
}