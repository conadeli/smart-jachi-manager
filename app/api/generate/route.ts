import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

type Feature = 'eviction' | 'roommate' | 'management'

const MAX_TOKENS: Record<Feature, number> = {
  eviction:   1200,
  roommate:   2500,
  management:  800,
}

const LIMITS = { daily: 3, monthly: 15 }

function getIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

async function checkAndIncrementUsage(ip: string, feature: Feature) {
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
  const dailyLeft    = LIMITS.daily   - dailyCount
  const monthlyLeft  = LIMITS.monthly - monthlyCount

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

  return { allowed: true, dailyLeft: dailyLeft - 1, monthlyLeft: monthlyLeft - 1 }
}

function makeCacheKey(feature: Feature, data: Record<string, unknown>): string {
  const sorted = Object.entries(data)
    .filter(([k]) => k !== 'feature')
    .map(([k, v]) => {
      const val = Array.isArray(v) ? [...v].sort().join(',') : String(v ?? '')
      return `${k}:${val}`
    })
    .sort()
    .join('|')
  return `${feature}|${sorted}`
}

function buildPrompt(feature: Feature, data: Record<string, string>) {
  if (feature === 'eviction') {
    const title = `${data.damageType} 파손 - ${data.period} 거주 퇴거 분쟁`
    return {
      title,
      system: `당신은 주택임대차보호법 전문가입니다. 임차인의 퇴거 시 원상복구 분쟁에서 임차인 입장을 도와주는 역할입니다.
응답은 반드시 아래 JSON 형식으로만 출력하세요. 마크다운 코드블록 없이 순수 JSON만 출력하세요:
{
  "verdict": "임차인 과실 없음 | 임차인 일부 과실 | 임차인 과실",
  "reason": "판정 근거 (2~3문장)",
  "negotiation": "집주인에게 보낼 협상 문구 (완성된 메시지)",
  "tips": ["팁1", "팁2", "팁3"],
  "legalBasis": "관련 법령 또는 판례"
}`,
      user: `파손 부위: ${data.damageType}
거주 기간: ${data.period}
파손 상황: ${data.situation || '별도 설명 없음'}
파손 정도: ${data.severity || '보통'}
위 상황에서 임차인의 과실 여부를 판정하고 협상 문구를 작성해주세요.
주택임대차보호법, 민법, 국토교통부 가이드라인을 근거로 판단하세요.`,
    }
  }

  if (feature === 'roommate') {
    const conflicts = Array.isArray(data.conflicts) ? data.conflicts : [data.conflicts]
    const title = `룸메이트 갈등 해결 - ${(conflicts as string[]).slice(0, 2).join(', ')} 등`
    return {
      title,
      system: `당신은 공정한 룸메이트 생활 규칙 중재자입니다. 갈등 항목을 분석해 모두가 동의할 수 있는 공평한 생활 규칙을 만들어줍니다.
응답은 반드시 아래 JSON 형식으로만 출력하세요. 마크다운 코드블록 없이 순수 JSON만 출력하세요:
{
  "summary": "갈등 요약 및 핵심 원인 (2문장)",
  "rules": [
    { "item": "규칙 항목", "rule": "구체적인 규칙 내용", "reason": "이 규칙이 공평한 이유" }
  ],
  "tips": ["추가 팁1", "추가 팁2"],
  "agreement": "룸메이트 모두가 서명할 수 있는 간단한 협정서 문구"
}`,
      user: `갈등 항목: ${conflicts.join(', ')}
룸메이트 수: ${data.roommateCount || '2'}명
거주 유형: ${data.housingType || '일반 쉐어하우스'}
추가 상황: ${data.situation || '없음'}
위 갈등 항목들에 대해 공평한 생활 규칙 리포트를 작성해주세요.`,
    }
  }

  const title = `${data.region} ${data.buildingType} 관리비 적정성 검사 - 월 ${data.amount}원`
  return {
    title,
    system: `당신은 부동산 관리비 전문가입니다. 지역, 건물 유형, 관리비 금액을 분석해 적정성을 평가합니다.
응답은 반드시 아래 JSON 형식으로만 출력하세요. 마크다운 코드블록 없이 순수 JSON만 출력하세요:
{
  "rating": 1,
  "verdict": "매우 비쌈 | 비쌈 | 적정 | 저렴 | 매우 저렴",
  "averageRange": "해당 지역 평균 관리비 범위 (예: 5~8만원)",
  "reason": "판정 근거 (2~3문장)",
  "hiddenCosts": ["숨겨진 비용 가능성1", "숨겨진 비용 가능성2"],
  "negotiationTip": "집주인에게 관리비 인하를 요청하는 문구",
  "checkList": ["확인해야 할 항목1", "확인해야 할 항목2", "확인해야 할 항목3"]
}`,
    user: `지역: ${data.region}
건물 유형: ${data.buildingType}
월 관리비: ${data.amount}원
포함 항목: ${data.includes || '알 수 없음'}
건물 층수: ${data.floors || '알 수 없음'}층
건축 연도: ${data.builtYear || '알 수 없음'}
위 정보를 바탕으로 관리비 적정성을 평가해주세요.`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { feature, ...data }: { feature: Feature } & Record<string, string> = body

    if (!feature) {
      return NextResponse.json({ error: '기능을 선택해주세요.' }, { status: 400 })
    }

    if (feature === 'roommate') {
      const conflicts = Array.isArray(data.conflicts) ? data.conflicts : []
      if (conflicts.length > 8) {
        return NextResponse.json({ error: '갈등 항목은 최대 8개까지 선택할 수 있어요.' }, { status: 400 })
      }
    }

    const ip = getIp(request)
    const usage = await checkAndIncrementUsage(ip, feature)

    if (!usage.allowed) {
      return NextResponse.json({
        error: usage.dailyLeft === 0
          ? `오늘 사용 한도(${LIMITS.daily}회)를 초과했어요. 내일 다시 이용해주세요.`
          : `이번 달 사용 한도(${LIMITS.monthly}회)를 초과했어요. 다음 달에 다시 이용해주세요.`,
        dailyLeft:   usage.dailyLeft,
        monthlyLeft: usage.monthlyLeft,
      }, { status: 429 })
    }

    const cacheKey = makeCacheKey(feature, data)
    const { data: cached } = await supabaseAdmin
      .from('questions')
      .select('content, slug, title')
      .eq('cache_key', cacheKey)
      .single()

    if (cached) {
      try {
        const parsedCache = JSON.parse(cached.content)
        const result = parsedCache.result ?? parsedCache
        return NextResponse.json({
          ...result,
          slug: cached.slug,
          title: cached.title,
          cached: true,
          dailyLeft:   usage.dailyLeft,
          monthlyLeft: usage.monthlyLeft,
        })
      } catch {}
    }

    const { system, user, title } = buildPrompt(feature, data)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: MAX_TOKENS[feature],
        system,
        messages: [{ role: 'user', content: user }],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'AI 생성에 실패했어요.' }, { status: 500 })
    }

    const aiData = await response.json()
    const rawText = aiData.content?.[0]?.text ?? ''

    let parsed: Record<string, unknown>
    try {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleaned)
    } catch {
      parsed = { raw: rawText }
    }

    const slug = `${feature}-${Date.now()}`
    
    // ✅ 수정: await 추가 + 에러 처리 개선
    const { error: insertError } = await supabaseAdmin.from('questions').insert({
      title,
      content: JSON.stringify({ input: data, result: parsed }),
      category: feature,
      slug,
      cache_key: cacheKey,
    })

    if (insertError) {
      console.error('Archive save error:', insertError)
      // 에러가 있어도 응답은 정상 반환 (사용자에게 영향 없음)
    }

    return NextResponse.json({
      ...parsed,
      slug,
      title,
      cached: false,
      dailyLeft:   usage.dailyLeft,
      monthlyLeft: usage.monthlyLeft,
    })

  } catch (error) {
    console.error('Route error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했어요.' }, { status: 500 })
  }
}