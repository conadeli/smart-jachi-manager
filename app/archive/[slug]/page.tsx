// app/archive/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase, CATEGORY_LABEL, CATEGORY_EMOJI, Question } from '@/lib/supabase'
import AdSense from '@/components/AdSense'

// ISR: 새 아카이브 등록 시 해당 페이지만 재생성
export const revalidate = 3600 // 1시간

type Props = { params: Promise<{ slug: string }> }

const BASE_URL = 'https://smart-jachi-manager.vercel.app'

const DAMAGE_LABEL: Record<string, string> = {
  damageType: '파손 부위', period: '거주 기간', severity: '파손 정도', situation: '상황 설명',
  conflicts: '갈등 항목', roommateCount: '룸메이트 수', housingType: '거주 유형',
  region: '지역', buildingType: '건물 유형', amount: '월 관리비', includes: '포함 항목',
  floors: '건물 층수', builtYear: '건축 연도',
}

const FEATURE_LABEL: Record<string, string> = {
  eviction: 'AI 퇴거 방어기', roommate: '룸메이트 평화 협정기', management: '관리비 거품 검사기'
}

const FEATURE_HREF: Record<string, string> = {
  eviction: '/eviction-defense', roommate: '/roommate-peace', management: '/management-check'
}

async function getQuestion(slug: string): Promise<Question | null> {
  const { data, error } = await supabase
    .from('questions').select('*').eq('slug', slug).single()
  if (error || !data) return null
  return data as Question
}

// ISR: 빌드 시 최신 50개 페이지 미리 생성
export async function generateStaticParams() {
  const { data } = await supabase
    .from('questions')
    .select('slug')
    .order('created_at', { ascending: false })
    .limit(50)
  return (data ?? []).map(q => ({ slug: q.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const q = await getQuestion(slug)
  if (!q) return { title: '찾을 수 없음 | 자취박사' }
  return {
    title: `${q.title} | 자취박사`,
    description: `자취박사 AI가 해결한 자취 고민: ${q.title}. ${CATEGORY_LABEL[q.category]} 관련 정보를 확인하세요.`,
    openGraph: {
      title: q.title,
      description: `자취박사 AI 해결 사례 - ${CATEGORY_LABEL[q.category]}`,
      type: 'article',
      url: `${BASE_URL}/archive/${q.slug}`,
      siteName: '자취박사',
    },
    alternates: { canonical: `${BASE_URL}/archive/${q.slug}` },
  }
}

// 사용자 입력 표시
function renderInput(input: Record<string, unknown>) {
  const skip = ['feature']
  const entries = Object.entries(input).filter(([k, v]) => !skip.includes(k) && v && v !== '')
  if (entries.length === 0) return null
  return (
    <div style={{ background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 10, letterSpacing: '0.5px' }}>📋 질문 상황</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.map(([key, value]) => {
          const label = DAMAGE_LABEL[key] ?? key
          const displayValue = Array.isArray(value) ? value.join(', ') : String(value)
          if (!displayValue || displayValue === 'undefined') return null
          return (
            <div key={key} style={{ display: 'flex', gap: 8, fontSize: 13 }}>
              <span style={{ color: '#9ca3af', flexShrink: 0, minWidth: 80 }}>{label}</span>
              <span style={{ color: '#374151', fontWeight: 500 }}>{displayValue}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function renderResult(category: string, result: Record<string, unknown>) {
  if (category === 'eviction') {
    const colors: Record<string, string> = { '임차인 과실 없음': '#15803d', '임차인 일부 과실': '#92400e', '임차인 과실': '#b91c1c' }
    const bgs: Record<string, string> = { '임차인 과실 없음': '#f0fdf4', '임차인 일부 과실': '#fffbeb', '임차인 과실': '#fef2f2' }
    const verdict = result.verdict as string
    const color = colors[verdict] ?? '#374151'
    const bg = bgs[verdict] ?? '#f9fafb'
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: bg, borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 4 }}>⚖️ 판정 결과</div>
          <div style={{ fontSize: 20, fontWeight: 800, color, marginBottom: 8 }}>{verdict}</div>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: '0 0 8px' }}>{result.reason as string}</p>
          {result.legalBasis && <div style={{ fontSize: 11, color, background: 'rgba(255,255,255,0.6)', padding: '3px 8px', borderRadius: 6, display: 'inline-block' }}>📚 {result.legalBasis as string}</div>}
        </div>
        {result.negotiation && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 8 }}>💬 협상 문구</div>
            <div style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.8, background: '#f9fafb', borderRadius: 10, padding: '12px 14px', whiteSpace: 'pre-wrap', borderLeft: '3px solid #2563eb' }}>{result.negotiation as string}</div>
          </div>
        )}
        {/* 광고 — 협상 문구 아래 */}
        <AdSense slot="1234567890" style={{ display: 'block', margin: '0.5rem 0' }} />
        {Array.isArray(result.tips) && result.tips.length > 0 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 8 }}>💡 대응 팁</div>
            {(result.tips as string[]).map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 11, background: '#eff6ff', color: '#1d4ed8', borderRadius: 20, padding: '1px 8px', flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (category === 'roommate') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {result.summary && (
          <div style={{ background: '#ecfdf5', borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46', marginBottom: 6 }}>📊 갈등 분석</div>
            <p style={{ fontSize: 13, color: '#065f46', lineHeight: 1.7, margin: 0 }}>{result.summary as string}</p>
          </div>
        )}
        {Array.isArray(result.rules) && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 10 }}>📏 생활 규칙</div>
            {(result.rules as Array<{ item: string; rule: string; reason: string }>).map((rule, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < (result.rules as unknown[]).length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <span style={{ fontSize: 11, background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', borderRadius: 20, padding: '1px 8px', fontWeight: 700 }}>{rule.item}</span>
                <p style={{ fontSize: 13, color: '#1f2937', fontWeight: 600, margin: '6px 0 2px', lineHeight: 1.6 }}>{rule.rule}</p>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>💡 {rule.reason}</p>
              </div>
            ))}
          </div>
        )}
        {/* 광고 — 규칙 아래, 협정서 위 */}
        <AdSense slot="2345678901" style={{ display: 'block', margin: '0.5rem 0' }} />
        {result.agreement && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 8 }}>📝 생활 협정서</div>
            <div style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.8, background: '#f9fafb', borderRadius: 10, padding: '12px 14px', whiteSpace: 'pre-wrap', borderLeft: '3px solid #059669' }}>{result.agreement as string}</div>
          </div>
        )}
      </div>
    )
  }

  // management
  const ratingNum = (result.rating as number) ?? 3
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: 28, marginBottom: 6, letterSpacing: 4 }}>
          {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: i < ratingNum ? '#f59e0b' : '#e5e7eb' }}>★</span>)}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#d97706', marginBottom: 8 }}>{result.verdict as string}</div>
        {result.averageRange && <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>이 지역 평균: {result.averageRange as string}</div>}
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0, textAlign: 'left' }}>{result.reason as string}</p>
      </div>
      {/* 광고 — 별점 결과 아래 */}
      <AdSense slot="3456789012" style={{ display: 'block', margin: '0.5rem 0' }} />
      {Array.isArray(result.hiddenCosts) && result.hiddenCosts.length > 0 && (
        <div style={{ background: '#fef2f2', borderRadius: 12, padding: '1.25rem' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#b91c1c', marginBottom: 8 }}>⚠️ 숨겨진 비용 가능성</div>
          {(result.hiddenCosts as string[]).map((c, i) => <div key={i} style={{ fontSize: 13, color: '#7f1d1d', marginBottom: 4 }}>• {c}</div>)}
        </div>
      )}
      {result.negotiationTip && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 8 }}>💬 인하 요청 문구</div>
          <div style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.8, background: '#f9fafb', borderRadius: 10, padding: '12px 14px', whiteSpace: 'pre-wrap', borderLeft: '3px solid #d97706' }}>{result.negotiationTip as string}</div>
        </div>
      )}
    </div>
  )
}

export default async function ArchiveDetailPage({ params }: Props) {
  const { slug } = await params
  const q = await getQuestion(slug)
  if (!q) notFound()

  let input: Record<string, unknown> = {}
  let result: Record<string, unknown> = {}
  try {
    const parsed = JSON.parse(q.content)
    if (parsed.input && parsed.result) {
      input = parsed.input
      result = parsed.result
    } else {
      result = parsed
    }
  } catch { result = { raw: q.content } }

  const categoryHref = FEATURE_HREF[q.category] ?? '/'

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/" style={{ fontSize: 16, fontWeight: 800, color: '#111', textDecoration: 'none' }}>자취박사</Link>
          <span style={{ color: '#e5e7eb' }}>›</span>
          <Link href="/archive" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>아카이브</Link>
          <span style={{ color: '#e5e7eb' }}>›</span>
          <span style={{ fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.title.slice(0, 30)}...</span>
        </div>
      </header>

      {/* 상단 광고 — 헤더 바로 아래 */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '1rem 1.5rem 0' }}>
        <AdSense slot="4567890123" format="horizontal" style={{ display: 'block' }} />
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '1.5rem 1.5rem 5rem' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: q.category === 'eviction' ? '#eff6ff' : q.category === 'roommate' ? '#ecfdf5' : '#fffbeb', color: q.category === 'eviction' ? '#1d4ed8' : q.category === 'roommate' ? '#065f46' : '#92400e', padding: '2px 10px', borderRadius: 10 }}>
              {CATEGORY_EMOJI[q.category]} {FEATURE_LABEL[q.category] ?? CATEGORY_LABEL[q.category]}
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              {new Date(q.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0, lineHeight: 1.4 }}>{q.title}</h1>
        </div>

        {/* 사용자 입력 */}
        {Object.keys(input).length > 0 && renderInput(input)}

        {/* AI 결과 */}
        {renderResult(q.category, result)}

        {/* 하단 CTA + 광고 */}
        <div style={{ marginTop: '1.5rem' }}>
          {/* 광고 — 다운로드 버튼 위 */}
          <AdSense slot="5678901234" style={{ display: 'block', marginBottom: '1rem' }} />

          <div style={{ padding: '1.25rem', background: 'white', borderRadius: 14, border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>비슷한 상황이신가요? 직접 AI에게 물어보세요.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link href={categoryHref} style={{ padding: '9px 18px', borderRadius: 10, background: '#111', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
                직접 검사해보기 →
              </Link>
              <Link href="/archive" style={{ padding: '9px 18px', borderRadius: 10, background: '#f3f4f6', color: '#374151', textDecoration: 'none', fontSize: 13 }}>
                목록으로
              </Link>
              <Link href="/" style={{ padding: '9px 18px', borderRadius: 10, background: '#f3f4f6', color: '#374151', textDecoration: 'none', fontSize: 13 }}>
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}