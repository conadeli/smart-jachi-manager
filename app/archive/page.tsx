// app/archive/page.tsx
import Link from 'next/link'
import { supabase, CATEGORY_LABEL, CATEGORY_EMOJI, Question } from '@/lib/supabase'

export const metadata = {
  title: '자취 고민 아카이브 | 자취박사',
  description: '자취박사 AI가 해결한 자취 고민들을 모아봤어요. 퇴거 분쟁, 룸메이트 갈등, 관리비 정보를 확인하세요.',
}

export const revalidate = 60 // 1분마다 재검증

async function getQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) { console.error(error); return [] }
  return (data as Question[]) ?? []
}

export default async function ArchivePage() {
  const questions = await getQuestions()

  const categories = ['eviction', 'roommate', 'management'] as const

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: '#111', textDecoration: 'none' }}>자취박사</Link>
          <span style={{ color: '#e5e7eb' }}>›</span>
          <span style={{ fontSize: 14, color: '#6b7280' }}>자취 고민 아카이브</span>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            📚 자취 고민 아카이브
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
            자취박사 AI가 실제로 해결한 자취 고민들이에요. 비슷한 상황을 참고해보세요.
          </p>
        </div>

        {/* 카테고리별 필터 링크 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '2rem', flexWrap: 'wrap' }}>
          <Link href="/archive" style={{ padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, background: '#111', color: 'white', textDecoration: 'none' }}>전체</Link>
          {categories.map(cat => (
            <Link key={cat} href={`/archive?category=${cat}`} style={{ padding: '6px 16px', borderRadius: 20, fontSize: 13, background: 'white', color: '#6b7280', textDecoration: 'none', border: '1px solid #e5e7eb' }}>
              {CATEGORY_EMOJI[cat]} {CATEGORY_LABEL[cat]}
            </Link>
          ))}
        </div>

        {questions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 14 }}>아직 저장된 고민이 없어요. 먼저 AI 기능을 사용해보세요!</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
              <Link href="/eviction-defense" style={{ padding: '8px 18px', borderRadius: 10, background: '#2563eb', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>퇴거 방어기</Link>
              <Link href="/roommate-peace" style={{ padding: '8px 18px', borderRadius: 10, background: '#059669', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>룸메이트 협정기</Link>
              <Link href="/management-check" style={{ padding: '8px 18px', borderRadius: 10, background: '#d97706', color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>관리비 검사기</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {questions.map(q => (
              <Link key={q.id} href={`/archive/${q.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', transition: 'box-shadow 0.15s', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{CATEGORY_EMOJI[q.category]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: q.category === 'eviction' ? '#eff6ff' : q.category === 'roommate' ? '#ecfdf5' : '#fffbeb', color: q.category === 'eviction' ? '#1d4ed8' : q.category === 'roommate' ? '#065f46' : '#92400e', padding: '2px 8px', borderRadius: 10 }}>
                        {CATEGORY_LABEL[q.category]}
                      </span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>
                        {new Date(q.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {q.title}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: '#9ca3af', flexShrink: 0 }}>›</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}