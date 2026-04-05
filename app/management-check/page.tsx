'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUsage } from '@/hooks/useUsage'

const REGIONS = ['서울 강남', '서울 강북', '서울 마포/홍대', '서울 신촌/연대', '서울 기타', '경기 수원', '경기 성남', '경기 기타', '인천', '부산', '대구', '대전', '광주', '기타 지방']
const BUILDING_TYPES = ['원룸', '투룸', '오피스텔', '빌라/다세대', '아파트', '고시원']
const INCLUDES = ['전기 포함', '가스 포함', '수도 포함', '인터넷 포함', '청소 포함', '주차 포함']

interface Result {
  rating: number
  verdict: string
  averageRange: string
  reason: string
  hiddenCosts: string[]
  negotiationTip: string
  checkList: string[]
  slug: string
  dailyLeft?: number
  monthlyLeft?: number
}

const VERDICT_COLOR: Record<string, string> = {
  '매우 비쌈': '#dc2626', '비쌈': '#d97706', '적정': '#059669', '저렴': '#2563eb', '매우 저렴': '#7c3aed'
}

export default function ManagementCheckPage() {
  const [region, setRegion] = useState('')
  const [buildingType, setBuildingType] = useState('')
  const [amount, setAmount] = useState('')
  const [includes, setIncludes] = useState<string[]>([])
  const [floors, setFloors] = useState('')
  const [builtYear, setBuiltYear] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [limitError, setLimitError] = useState<string | null>(null)

  // ✅ 훅으로 교체
  const { usage, updateFromResponse } = useUsage('management')

  const toggleInclude = (i: string) =>
    setIncludes(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  const handleSubmit = async () => {
    if (!region || !buildingType || !amount) return
    setLoading(true); setResult(null); setLimitError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'management', region, buildingType, amount, includes: includes.join(', ') || '알 수 없음', floors, builtYear }),
      })
      const data = await res.json()

      if (res.status === 429) {
        setLimitError(data.error)
        if (data.dailyLeft !== undefined) updateFromResponse(data.dailyLeft, data.monthlyLeft)
        return
      }
      if (!res.ok) { setLimitError(data.error ?? '오류가 발생했어요.'); return }

      setResult(data)
      if (data.dailyLeft !== undefined) updateFromResponse(data.dailyLeft, data.monthlyLeft)
    } catch {
      setLimitError('네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const isLimited = usage !== null && (usage.dailyLeft <= 0 || usage.monthlyLeft <= 0)
  const verdictColor = result ? (VERDICT_COLOR[result.verdict] ?? '#6b7280') : '#6b7280'

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F7', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

        <Link href="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', display: 'inline-block', marginBottom: 12 }}>← 홈으로</Link>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 4px' }}>💰 관리비 거품 검사기</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>지역, 건물 유형, 관리비를 입력하면 주변 시세 대비 적정성을 별점으로 알려드려요</p>
        </div>

        {/* ✅ 항상 표시되는 사용 현황 배너 */}
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 12, padding: '10px 14px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>📊 AI 사용 현황</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {usage ? (
              <>
                <span style={{ fontSize: 12, color: usage.dailyLeft <= 0 ? '#dc2626' : '#92400e' }}>오늘 <b>{usage.dailyLeft}회</b> 남음</span>
                <span style={{ fontSize: 12, color: usage.monthlyLeft <= 0 ? '#dc2626' : '#92400e' }}>이번 달 <b>{usage.monthlyLeft}회</b> 남음</span>
              </>
            ) : (
              <span style={{ fontSize: 12, color: '#9ca3af' }}>확인 중...</span>
            )}
          </div>
        </div>

        {limitError && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '12px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: '#b91c1c', fontWeight: 700, marginBottom: 2 }}>⛔ 사용 한도 초과</div>
            <div style={{ fontSize: 13, color: '#7f1d1d' }}>{limitError}</div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>지역</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegion(r)}
                  style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: `1.5px solid ${region === r ? '#d97706' : '#e5e7eb'}`, background: region === r ? '#fffbeb' : 'white', color: region === r ? '#92400e' : '#6b7280', fontWeight: region === r ? 700 : 400 }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>건물 유형</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {BUILDING_TYPES.map(b => (
                <button key={b} onClick={() => setBuildingType(b)}
                  style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: `1.5px solid ${buildingType === b ? '#d97706' : '#e5e7eb'}`, background: buildingType === b ? '#fffbeb' : 'white', color: buildingType === b ? '#92400e' : '#6b7280', fontWeight: buildingType === b ? 700 : 400 }}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>월 관리비</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="예: 80000"
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', color: '#374151' }} />
                <span style={{ fontSize: 13, color: '#6b7280', flexShrink: 0 }}>원</span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>건물 층수 <span style={{ color: '#9ca3af', fontWeight: 400 }}>(선택)</span></label>
              <input type="number" value={floors} onChange={e => setFloors(e.target.value)} placeholder="예: 5"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none', color: '#374151', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>관리비 포함 항목 <span style={{ color: '#9ca3af', fontWeight: 400 }}>(선택)</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {INCLUDES.map(i => (
                <button key={i} onClick={() => toggleInclude(i)}
                  style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: `1.5px solid ${includes.includes(i) ? '#d97706' : '#e5e7eb'}`, background: includes.includes(i) ? '#fffbeb' : 'white', color: includes.includes(i) ? '#92400e' : '#6b7280', fontWeight: includes.includes(i) ? 700 : 400 }}>
                  {includes.includes(i) ? '✓ ' : ''}{i}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading || !region || !buildingType || !amount || isLimited}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: !region || !buildingType || !amount || isLimited ? '#e5e7eb' : '#d97706', color: !region || !buildingType || !amount || isLimited ? '#9ca3af' : 'white', fontSize: 14, fontWeight: 700, cursor: !region || !buildingType || !amount || isLimited ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading
              ? (<><span style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />검사 중...</>)
              : isLimited ? '사용 한도 초과' : '🔍 관리비 거품 검사하기'}
          </button>
        </div>

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8, letterSpacing: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < result.rating ? '#f59e0b' : '#e5e7eb' }}>★</span>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>적정성 {result.rating}/5점</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: verdictColor, marginBottom: 8 }}>{result.verdict}</div>
              <div style={{ display: 'inline-block', fontSize: 12, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 12px', color: '#374151', marginBottom: 12 }}>
                📊 이 지역 평균: {result.averageRange}
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0, textAlign: 'left' }}>{result.reason}</p>
            </div>

            {result.hiddenCosts?.length > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 16, padding: '1.25rem' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#b91c1c', marginBottom: 10 }}>⚠️ 숨겨진 비용 가능성</div>
                {result.hiddenCosts.map((cost, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: '#ef4444', flexShrink: 0 }}>•</span>
                    <span style={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.6 }}>{cost}</span>
                  </div>
                ))}
              </div>
            )}

            {result.negotiationTip && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>💬 관리비 인하 요청 문구</span>
                  <button onClick={() => handleCopy(result.negotiationTip)}
                    style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, border: `1px solid ${copied ? '#86efac' : '#e5e7eb'}`, background: copied ? '#f0fdf4' : 'white', color: copied ? '#15803d' : '#6b7280', cursor: 'pointer' }}>
                    {copied ? '✓ 복사됨' : '📋 복사'}
                  </button>
                </div>
                <div style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.8, background: '#f9fafb', borderRadius: 10, padding: '12px 14px', whiteSpace: 'pre-wrap', borderLeft: '3px solid #d97706' }}>
                  {result.negotiationTip}
                </div>
                <button onClick={() => handleCopy(result.negotiationTip)}
                  style={{ marginTop: 10, width: '100%', padding: '10px', borderRadius: 10, border: `1.5px solid ${copied ? '#86efac' : '#FEE033'}`, background: copied ? '#f0fdf4' : '#FFF8E1', color: copied ? '#15803d' : '#92400e', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {copied ? '✓ 복사 완료! 카카오톡에 붙여넣기' : '💬 카카오톡으로 보내기 (복사)'}
                </button>
              </div>
            )}

            {result.checkList?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 10 }}>✅ 추가 확인 항목</div>
                {result.checkList.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, background: '#fffbeb', color: '#92400e', border: '1px solid #fcd34d', borderRadius: 20, padding: '1px 8px', flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {result.slug && (
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <Link href={`/archive/${result.slug}`} style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>이 결과 고유 링크 보기 →</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}