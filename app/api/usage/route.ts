import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const LIMITS = { daily: 3, monthly: 15 }

function getIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function GET(request: NextRequest) {
  const ip = getIp(request)
  const feature = request.nextUrl.searchParams.get('feature') ?? 'eviction'

  const today = new Date().toISOString().slice(0, 10)
  const month = new Date().toISOString().slice(0, 7)
  const dailyKey   = `${ip}:${feature}:${today}`
  const monthlyKey = `${ip}:${feature}:${month}`

  const { data: rows } = await supabaseAdmin
    .from('usage_limits')
    .select('key, count')
    .in('key', [dailyKey, monthlyKey])

  const dailyCount   = rows?.find(r => r.key === dailyKey)?.count   ?? 0
  const monthlyCount = rows?.find(r => r.key === monthlyKey)?.count ?? 0

  return NextResponse.json({
    dailyLeft:   Math.max(0, LIMITS.daily   - dailyCount),
    monthlyLeft: Math.max(0, LIMITS.monthly - monthlyCount),
    dailyLimit:   LIMITS.daily,
    monthlyLimit: LIMITS.monthly,
  })
}