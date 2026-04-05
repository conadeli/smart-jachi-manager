'use client'

import { useState } from 'react'
import Link from 'next/link'
import AdSense from '@/components/AdSense'
import { useUsage } from '@/hooks/useUsage'

const CONFLICT_OPTIONS = [
  '청소 분담', '설거지', '화장실 사용 시간', '소음 (TV/음악)', '취침 시간',
  '손님 초대', '공용 음식', '냉장고 공간', '인터넷 속도', '냉난방 온도',
  '공과금 정산', '세탁기 사용', '택배 수령', '주차', '흡연',
]
const ROOMMATE_COUNTS = ['2명', '3명', '4명 이상']
const HOUSING_TYPES = ['일반 원룸', '쉐어하우스', '투룸 셰어', '빌라/아파트']
const MAX_CONFLICTS = 8

interface Rule { item: string; rule: string; reason: string }
interface Result {
  summary: string
  rules: Rule[]
  tips: string[]
  agreement: string
  slug: string
  title: string
  dailyLeft?: number
  monthlyLeft?: number
}

export default function RoommatePeacePage() {
  const [conflicts, setConflicts] = useState<string[]>([])
  const [roommateCount, setRoommateCount] = useState('2명')
  const [housingType, setHousingType] = useState('일반 원룸')
  const [situation, setSituation] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copiedRule, setCopiedRule] = useState<number | null>(null)
  const [limitError, setLimitError] = useState<string | null>(null)

  // ✅ 훅으로 교체
  const { usage, updateFromResponse } = useUsage('roommate')

  const toggleConflict = (c: string) => {
    setConflicts(prev => {
      if (prev.includes(c)) return prev.filter(x => x !== c)
      if (prev.length >= MAX_CONFLICTS) return prev
      return [...prev, c]
    })
  }

  const handleSubmit = async () => {
    if (conflicts.length === 0) return
    setLoading(true); setResult(null); setLimitError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'roommate', conflicts, roommateCount, housingType, situation }),
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

  const handleCopyRule = async (rule: Rule, index: number) => {
    const text = `[${rule.item}]\n규칙: ${rule.rule}\n이유: ${rule.reason}`
    await navigator.clipboard.writeText(text).catch(() => {})
    setCopiedRule(index); setTimeout(() => setCopiedRule(null), 2000)
  }

  const handleDownload = async () => {
    if (!result) return
    setDownloading(true)
    try {
      const res = await fetch('/api/download/roommate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: result.summary, rules: result.rules, agreement: result.agreement, tips: result.tips, title: result.title }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = '룸메이트_생활협정서.docx'
      document.body.appendChild(a); a.click()
      document.body.removeChild(a); URL.revokeObjectURL(url)
    } catch { alert('다운로드에 실패했어요. 잠시 후 다시 시도해주세요.') }
    finally { setDownloading(false) }
  }

  const isLimited = usage !== null && (usage.dailyLeft <= 0 || usage.monthlyLeft <= 0)

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F7', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

        <Link href="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', display: 'inline-block', marginBottom: 12 }}>← 홈으로</Link>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 4px' }}>🤝 룸메이트 평화 협정기</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>갈등 항목을 선택하면 AI가 공평한 생활 규칙과 협정서를 만들어드려요</p>
        </div>

        {/* ✅ 항상 표시되는 사용 현황 배너 */}
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '10px 14px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>📊 AI 사용 현황</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {usage ? (
              <>
                <span style={{ fontSize: 12, color: usage.dailyLeft <= 0 ? '#dc2626' : '#15803d' }}>오늘 <b>{usage.dailyLeft}회</b> 남음</span>
                <span style={{ fontSize: 12, color: usage.monthlyLeft <= 0 ? '#dc2626' : '#15803d' }}>이번 달 <b>{usage.monthlyLeft}회</b> 남음</span>
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
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>
              갈등 항목 선택{' '}
              <span style={{ color: conflicts.length >= MAX_CONFLICTS ? '#dc2626' : '#9ca3af', fontWeight: 400 }}>
                ({conflicts.length}/{MAX_CONFLICTS}개 선택 · 최대 {MAX_CONFLICTS}개)
              </span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CONFLICT_OPTIONS.map(c => {
                const selected = conflicts.includes(c)
                const disabled = !selected && conflicts.length >= MAX_CONFLICTS
                return (
                  <button key={c} onClick={() => toggleConflict(c)}
                    style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: disabled ? 'not-allowed' : 'pointer', border: `1.5px solid ${selected ? '#059669' : '#e5e7eb'}`, background: selected ? '#ecfdf5' : disabled ? '#f9fafb' : 'white', color: selected ? '#065f46' : disabled ? '#d1d5db' : '#6b7280', fontWeight: selected ? 700 : 400, opacity: disabled ? 0.5 : 1 }}>
                    {selected ? '✓ ' : ''}{c}
                  </button>
                )
              })}
            </div>
            {conflicts.length >= MAX_CONFLICTS && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#dc2626', fontWeight: 600 }}>⚠️ 최대 {MAX_CONFLICTS}개까지 선택할 수 있어요</div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>룸메이트 수</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ROOMMATE_COUNTS.map(c => (
                  <button key={c} onClick={() => setRoommateCount(c)}
                    style={{ padding: '7px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', border: `1.5px solid ${roommateCount === c ? '#059669' : '#e5e7eb'}`, background: roommateCount === c ? '#ecfdf5' : 'white', color: roommateCount === c ? '#065f46' : '#6b7280', fontWeight: roommateCount === c ? 700 : 400 }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>거주 유형</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {HOUSING_TYPES.map(t => (
                  <button key={t} onClick={() => setHousingType(t)}
                    style={{ padding: '7px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer', border: `1.5px solid ${housingType === t ? '#059669' : '#e5e7eb'}`, background: housingType === t ? '#ecfdf5' : 'white', color: housingType === t ? '#065f46' : '#6b7280', fontWeight: housingType === t ? 700 : 400 }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>추가 상황 <span style={{ color: '#9ca3af', fontWeight: 400 }}>(선택)</span></label>
            <textarea value={situation} onChange={e => setSituation(e.target.value)}
              placeholder="예: 한 명이 재택근무를 해서 낮에 집에 있는 시간이 많아요" rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: "'Noto Sans KR', sans-serif", color: '#374151' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading || conflicts.length === 0 || isLimited}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: conflicts.length === 0 || isLimited ? '#e5e7eb' : '#059669', color: conflicts.length === 0 || isLimited ? '#9ca3af' : 'white', fontSize: 14, fontWeight: 700, cursor: conflicts.length === 0 || isLimited ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading
              ? (<><span style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />규칙 생성 중...</>)
              : isLimited ? '사용 한도 초과' : '📋 평화 협정 만들기'}
          </button>
        </div>

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.summary && (
              <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: 16, padding: '1.25rem' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46', marginBottom: 6 }}>📊 갈등 분석</div>
                <p style={{ fontSize: 13, color: '#065f46', lineHeight: 1.7, margin: 0 }}>{result.summary}</p>
              </div>
            )}

            {result.rules?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>📏 생활 규칙</span>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>각 규칙을 개별 복사할 수 있어요</span>
                </div>
                {result.rules.map((rule, i) => (
                  <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < result.rules.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', borderRadius: 20, padding: '2px 10px', fontWeight: 700, flexShrink: 0 }}>{i + 1}. {rule.item}</span>
                      <button onClick={() => handleCopyRule(rule, i)}
                        style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, flexShrink: 0, border: `1px solid ${copiedRule === i ? '#86efac' : '#e5e7eb'}`, background: copiedRule === i ? '#f0fdf4' : '#f9fafb', color: copiedRule === i ? '#15803d' : '#9ca3af', cursor: 'pointer', transition: 'all 0.2s' }}>
                        {copiedRule === i ? '✓ 복사됨' : '📋 복사'}
                      </button>
                    </div>
                    <p style={{ fontSize: 13, color: '#1f2937', fontWeight: 600, margin: '0 0 4px', lineHeight: 1.6 }}>{rule.rule}</p>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>💡 {rule.reason}</p>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const all = result.rules.map((r, i) => `${i + 1}. [${r.item}]\n규칙: ${r.rule}\n이유: ${r.reason}`).join('\n\n')
                    navigator.clipboard.writeText(all).catch(() => {})
                    setCopied(true); setTimeout(() => setCopied(false), 2000)
                  }}
                  style={{ width: '100%', marginTop: 8, padding: '8px', borderRadius: 8, border: `1px solid ${copied ? '#86efac' : '#e5e7eb'}`, background: copied ? '#f0fdf4' : '#f9fafb', color: copied ? '#15803d' : '#6b7280', fontSize: 12, cursor: 'pointer', fontWeight: copied ? 700 : 400 }}>
                  {copied ? '✓ 전체 복사됨' : '📋 전체 규칙 한번에 복사'}
                </button>
              </div>
            )}

            {result.agreement && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 10 }}>📝 생활 협정서</div>
                <div style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.8, background: '#f9fafb', borderRadius: 10, padding: '12px 14px', whiteSpace: 'pre-wrap', borderLeft: '3px solid #059669', marginBottom: 10 }}>
                  {result.agreement}
                </div>
                <button onClick={() => handleCopy(result.agreement)}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, border: `1.5px solid ${copied ? '#86efac' : '#FEE033'}`, background: copied ? '#f0fdf4' : '#FFF8E1', color: copied ? '#15803d' : '#92400e', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {copied ? '✓ 복사 완료! 카카오톡에 붙여넣기' : '💬 룸메이트에게 공유하기 (복사)'}
                </button>
              </div>
            )}

            {result.tips?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 10 }}>💡 추가 팁</div>
                {result.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', borderRadius: 20, padding: '1px 8px', flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>
            )}

            <AdSense adSlot="5566778899" adFormat="rectangle" />

            <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #059669', padding: '1.25rem' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#065f46', marginBottom: 6 }}>📄 협정서 파일 다운로드</div>
              <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 12px', lineHeight: 1.6 }}>Word 문서(.docx)로 다운로드하면 규칙을 복사해 붙여넣거나 직접 수정할 수 있어요. 서명란도 포함되어 있어요.</p>
              <button onClick={handleDownload} disabled={downloading}
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: downloading ? '#a7f3d0' : '#059669', color: 'white', fontSize: 14, fontWeight: 700, cursor: downloading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                {downloading
                  ? (<><span style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />파일 생성 중...</>)
                  : <>⬇️ 협정서 Word 파일 다운로드 (.docx)</>}
              </button>
            </div>

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