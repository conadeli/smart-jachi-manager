// app/api/ai/generate-message/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// ── 사용 제한 설정 ────────────────────────────────────────
const LIMITS = {
  daily:   3,   // IP당 하루 5회
  monthly: 15,  // IP당 한달 20회
}

// ── IP 추출 ───────────────────────────────────────────────
function getIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

// ── 사용 횟수 체크 & 증가 ─────────────────────────────────
async function checkAndIncrementUsage(ip: string): Promise
  { allowed: boolean; dailyLeft: number; monthlyLeft: number }
> {
  const today = new Date().toISOString().slice(0, 10)   // "2026-04-04"
  const month = new Date().toISOString().slice(0, 7)    // "2026-04"
  const dailyKey   = `${ip}:ai-messages:${today}`
  const monthlyKey = `${ip}:ai-messages:${month}`

  const { data: rows } = await supabaseAdmin
    .from('usage_limits')
    .select('key, count')
    .in('key', [dailyKey, monthlyKey])

  const dailyCount   = rows?.find(r => r.key === dailyKey)?.count   ?? 0
  const monthlyCount = rows?.find(r => r.key === monthlyKey)?.count ?? 0

  const dailyLeft   = LIMITS.daily   - dailyCount
  const monthlyLeft = LIMITS.monthly - monthlyCount

  if (dailyCount >= LIMITS.daily || monthlyCount >= LIMITS.monthly) {
    return { allowed: false, dailyLeft: Math.max(0, dailyLeft), monthlyLeft: Math.max(0, monthlyLeft) }
  }

  await Promise.all([
    supabaseAdmin.from('usage_limits').upsert(
      { key: dailyKey,   count: dailyCount + 1,   expires_at: today + 'T23:59:59Z' },
      { onConflict: 'key' }
    ),
    supabaseAdmin.from('usage_limits').upsert(
      { key: monthlyKey, count: monthlyCount + 1, expires_at: month + '-28T23:59:59Z' },
      { onConflict: 'key' }
    ),
  ])

  return {
    allowed: true,
    dailyLeft:   dailyLeft - 1,
    monthlyLeft: monthlyLeft - 1,
  }
}

// ── 슬러그 생성 ───────────────────────────────────────────
function makeSlug(title: string): string {
  const timestamp = Date.now()
  const clean = title
    .replace(/[^\w\s가-힣]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)
  return `${clean}-${timestamp}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { feature, ...data }: { feature: string } & Record<string, string> = body

    // ── IP 기반 사용 제한 체크 ────────────────────────────
    const ip = getIp(request)
    const usage = await checkAndIncrementUsage(ip)

    if (!usage.allowed) {
      return NextResponse.json({
        error: usage.dailyLeft === 0
          ? `오늘 사용 한도(${LIMITS.daily}회)를 초과했어요. 내일 다시 이용해주세요.`
          : `이번 달 사용 한도(${LIMITS.monthly}회)를 초과했어요. 다음 달에 다시 이용해주세요.`,
        dailyLeft:   usage.dailyLeft,
        monthlyLeft: usage.monthlyLeft,
      }, { status: 429 })
    }

    // ── 기존 프롬프트 로직 그대로 유지 ───────────────────
    const title = `AI 문구 생성 - ${data.situation?.slice(0, 20) || '상황별 메시지'}`
    const system = `당신은 자취생을 위한 메시지 작성 전문가입니다. 상황에 맞는 정중하고 효과적인 메시지를 작성해주세요.
응답은 반드시 아래 JSON 형식으로만 출력하세요. 마크다운 코드블록 없이 순수 JSON만 출력하세요:
{
  "message": "메인 메시지",
  "tips": ["팁1", "팁2"],
  "alternatives": ["대안 메시지1", "대안 메시지2"]
}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,   // ✅ 최적화
        system,
        messages: [{ role: 'user', content: JSON.stringify(data) }],
      }),
    })

    if (!response.ok) {
      console.error('Anthropic API error:', await response.text())
      return NextResponse.json({ error: 'AI 생성에 실패했어요.' }, { status: 500 })
    }

    const aiData = await response.json()
    const rawText = aiData.content?.[0]?.text ?? ''

    let parsed: Record<string, unknown>
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim()
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned)
    } catch {
      parsed = { raw: rawText }
    }

    // ── Supabase 저장 ─────────────────────────────────────
    const slug = makeSlug(title)
    supabaseAdmin.from('questions').insert({
      title,
      content: JSON.stringify(parsed),
      category: 'ai-messages',
      slug,
    }).then(({ error }) => {
      if (error) console.error('Archive save error:', error)
    })

    return NextResponse.json({
      ...parsed,
      slug,
      title,
      dailyLeft:   usage.dailyLeft,
      monthlyLeft: usage.monthlyLeft,
    })

  } catch (error) {
    console.error('Route error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했어요.' }, { status: 500 })
  }
}