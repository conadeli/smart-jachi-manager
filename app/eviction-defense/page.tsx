'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUsage } from '@/hooks/useUsage'

const DAMAGE_TYPES = ['벽 긁힘/구멍', '바닥 스크래치', '장판 훼손', '도배 오염', '창문 파손', '욕실 곰팡이', '가구 파손', '기타']
const PERIODS = ['6개월 미만', '6개월~1년', '1~2년', '2~4년', '4년 이상']
const SEVERITIES = ['경미함', '보통', '심각함']

interface Result {
  verdict: string
  reason: string
  negotiation: string
  tips: string[]
  legalBasis: string
  slug: string
  title: string
  dailyLeft?: number
  monthlyLeft?: number
}

const VERDICT_STYLE: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  '임차인 과실 없음': { bg: '#f0fdf4', border: '#86efac', color: '#15803d', icon: '✅' },
  '임차인 일부 과실': { bg: '#fffbeb', border: '#fcd34d', color: '#92400e', icon: '⚠️' },
  '임차인 과실':     { bg: '#fef2f2', border: '#fca5a5', color: '#b91c1c', icon: '❌' },
}

export default function EvictionDefensePage() {
  const [form, setForm] = useState({ damageType: '', period: '', situation: '', severity: '보통' })
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [limitError, setLimitError] = useState<string | null>(null)

  // ✅ 훅으로 교체 — 페이지 진입 시 바로 사용량 조회
  const { usage, updateFromResponse } = useUsage('eviction')

  const handleSubmit = async () => {
    if (!form.damageType || !form.period) return
    setLoading(true); setResult(null); setLimitError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'eviction', ...form }),
      })
      const data = await res.json()

      if (res.status === 429) {
        setLimitError(data.error)
        if (data.dailyLeft !== undefined) updateFromResponse(data.dailyLeft, data.monthlyLeft)
        return
      }
      if (!res.ok) {
        setLimitError(data.error ?? '오류가 발생했어요.')
        return
      }

      setResult(data)
      // ✅ 생성 후 잔여 횟수 업데이트
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
  const verdictStyle = result ? (VERDICT_STYLE[result.verdict] ?? VERDICT_STYLE['임차인 일부 과실']) : null

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F7', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ maxWidth: 580, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>

        <Link href="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', display: 'inline-block', marginBottom: 12 }}>← 홈으로</Link>

        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 4px' }}>🛡️ AI 퇴거 방어기</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>파손 부위와 거주 기간을 입력하면 임차인 과실 여부를 판정하고 협상 문구를 생성해드려요</p>
        </div>

        {/* ✅ 항상 표시되는 사용 현황 배너 */}
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 12, padding: '10px 14px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>📊 AI 사용 현황</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {usage ? (
              <>
                <span style={{ fontSize: 12, color: usage.dailyLeft <= 0 ? '#dc2626' : '#15803d' }}>
                  오늘 <b>{usage.dailyLeft}회</b> 남음
                </span>
                <span style={{ fontSize: 12, color: usage.monthlyLeft <= 0 ? '#dc2626' : '#15803d' }}>
                  이번 달 <b>{usage.monthlyLeft}회</b> 남음
                </span>
              </>
            ) : (
              <span style={{ fontSize: 12, color: '#9ca3af' }}>확인 중...</span>
            )}
          </div>
        </div>

        {/* ✅ 한도 초과 에러 배너 */}
        {limitError && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '12px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: '#b91c1c', fontWeight: 700, marginBottom: 2 }}>⛔ 사용 한도 초과</div>
            <div style={{ fontSize: 13, color: '#7f1d1d' }}>{limitError}</div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem', marginBottom: '1rem' }}>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>파손 부위</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {DAMAGE_TYPES.map(d => (
                <button key={d} onClick={() => setForm(f => ({ ...f, damageType: d }))}
                  style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: `1.5px solid ${form.damageType === d ? '#2563eb' : '#e5e7eb'}`, background: form.damageType === d ? '#eff6ff' : 'white', color: form.damageType === d ? '#1d4ed8' : '#6b7280', fontWeight: form.damageType === d ? 700 : 400 }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>거주 기간</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PERIODS.map(p => (
                <button key={p} onClick={() => setForm(f => ({ ...f, period: p }))}
                  style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', border: `1.5px solid ${form.period === p ? '#2563eb' : '#e5e7eb'}`, background: form.period === p ? '#eff6ff' : 'white', color: form.period === p ? '#1d4ed8' : '#6b7280', fontWeight: form.period === p ? 700 : 400 }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 8 }}>파손 정도</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {SEVERITIES.map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, severity: s }))}
                  style={{ flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, cursor: 'pointer', border: `1.5px solid ${form.severity === s ? '#2563eb' : '#e5e7eb'}`, background: form.severity === s ? '#eff6ff' : 'white', color: form.severity === s ? '#1d4ed8' : '#6b7280', fontWeight: form.severity === s ? 700 : 400 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>상황 설명 <span style={{ color: '#9ca3af', fontWeight: 400 }}>(선택)</span></label>
            <textarea value={form.situation} onChange={e => setForm(f => ({ ...f, situation: e.target.value }))}
              placeholder="예: 입주 당시부터 있던 흠집인데 집주인이 우리 과실이라고 주장해요" rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: "'Noto Sans KR', sans-serif", color: '#374151' }} />
          </div>

          <button onClick={handleSubmit} disabled={loading || !form.damageType || !form.period || isLimited}
            style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: !form.damageType || !form.period || isLimited ? '#e5e7eb' : '#2563eb', color: !form.damageType || !form.period || isLimited ? '#9ca3af' : 'white', fontSize: 14, fontWeight: 700, cursor: !form.damageType || !form.period || isLimited ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading
              ? (<><span style={{ width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />판정 중...</>)
              : isLimited ? '사용 한도 초과' : '⚖️ 과실 여부 판정하기'}
          </button>
        </div>

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            <div style={{ background: verdictStyle!.bg, border: `1.5px solid ${verdictStyle!.border}`, borderRadius: 16, padding: '1.25rem' }}>
              <div style={{ fontSize: 13, color: verdictStyle!.color, fontWeight: 700, marginBottom: 8 }}>⚖️ 판정 결과</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: verdictStyle!.color, marginBottom: 8 }}>{verdictStyle!.icon} {result.verdict}</div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: '0 0 8px' }}>{result.reason}</p>
              <div style={{ fontSize: 11, color: verdictStyle!.color, background: 'rgba(255,255,255,0.6)', padding: '4px 10px', borderRadius: 6, display: 'inline-block' }}>📚 {result.legalBasis}</div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>💬 협상 문구</span>
                <button onClick={() => handleCopy(result.negotiation)}
                  style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, border: `1px solid ${copied ? '#86efac' : '#e5e7eb'}`, background: copied ? '#f0fdf4' : 'white', color: copied ? '#15803d' : '#6b7280', cursor: 'pointer' }}>
                  {copied ? '✓ 복사됨' : '📋 복사'}
                </button>
              </div>
              <div style={{ fontSize: 13, color: '#1f2937', lineHeight: 1.8, background: '#f9fafb', borderRadius: 10, padding: '12px 14px', whiteSpace: 'pre-wrap', borderLeft: '3px solid #2563eb' }}>
                {result.negotiation}
              </div>
              <button onClick={() => handleCopy(result.negotiation)}
                style={{ marginTop: 10, width: '100%', padding: '10px', borderRadius: 10, border: `1.5px solid ${copied ? '#86efac' : '#FEE033'}`, background: copied ? '#f0fdf4' : '#FFF8E1', color: copied ? '#15803d' : '#92400e', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {copied ? '✓ 복사 완료! 카카오톡에 붙여넣기' : '💬 카카오톡으로 보내기 (복사)'}
              </button>
            </div>

            {result.tips?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 10 }}>💡 대응 팁</div>
                {result.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: 20, padding: '1px 8px', flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>
            )}

            {result.slug && (
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <Link href={`/archive/${result.slug}`} style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>
                  이 결과 고유 링크 보기 →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}