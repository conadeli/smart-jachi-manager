// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 클라이언트용 (공개 읽기)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 서버용 (쓰기 권한)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export type Question = {
  id: string
  title: string
  content: string
  category: 'eviction' | 'roommate' | 'management'
  slug: string
  created_at: string
}

export const CATEGORY_LABEL: Record<string, string> = {
  eviction: '퇴거 방어',
  roommate: '룸메이트',
  management: '관리비',
}

export const CATEGORY_EMOJI: Record<string, string> = {
  eviction: '🛡️',
  roommate: '🤝',
  management: '💰',
}