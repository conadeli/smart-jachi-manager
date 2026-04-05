'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUsage } from '@/hooks/useUsage'

type Target = 'landlord' | 'neighbor' | 'roommate'
type Purpose = 'repair' | 'complaint' | 'negotiation' | 'greeting'
type Tone = 'polite' | 'firm' | 'friendly'
type MessageLength = 'short' | 'medium' | 'long'

const DAILY_LIMIT = 3
const MONTHLY_LIMIT = 15

const DEFAULT_LENGTH: Record<Purpose, MessageLength> = {
  greeting: 'short', repair: 'medium', complaint: 'long', negotiation: 'long',
}
const LENGTH_LABEL: Record<MessageLength, { label: string; desc: string }> = {
  short: { label: '짧게', desc: '2~3문장' },
  medium: { label: '보통', desc: '4~5문장' },
  long: { label: '길게', desc: '6~8문장' },
}

interface GeneratedResult {
  message: string
  tips: string[]
  alternatives: string[]
  dailyLeft?: number
  monthlyLeft?: number
}

function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const start = (str: string) => {
    setDisplayed(''); setDone(false); let i = 0
    const iv = setInterval(() => {
      i++; setDisplayed(str.slice(0, i))
      if (i >= str.length) { clearInterval(iv); setDone(true) }
    }, speed)
  }
  return { displayed, done, start }
}

export default function AiMessagesPage() {
  const [target, setTarget] = useState<Target>('landlord')
  const [purpose, setPurpose] = useState<Purpose>('repair')
  const [tone, setTone] = useState<Tone>('polite')
  const [messageLength, setMessageLength] = useState<MessageLength>('medium')
  const [situation, setSituation] = useState('')
  const [result, setResult] = useState<GeneratedResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [limitError, setLimitError] = useState<string | null>(null)
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({})

  // ✅ 훅으로 교체 — 페이지 진입 시 바로 사용량 조회
  const { usage, updateFromResponse } = useUsage('ai-messages')

  const handlePurposeChange = (p: Purpose) => {
    setPurpose(p); setMessageLength(DEFAULT_LENGTH[p])
  }

  const { displayed, done, start: startTypewriter } = useTypewriter(result?.message ?? '', 20)

  const handleGenerate = async () => {
    setLoading(true); setLimitError(null); setResult(null)
    try {
      const res = await fetch('/api/ai/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, purpose, tone, situation, messageLength }),
      })
      const data = await res.json()

      if (res.status === 429) {
        setLimitError(data.error)
        if (data.dailyLeft !== undefined) updateFromResponse(data.dailyLeft, data.monthlyLeft)
        return
      }
      if (!res.ok) {
        setLimitError(data.error ?? '메시지 생성에 실패했어요. 잠시 후 다시 시도해주세요.')
        return
      }

      setResult(data)
      startTypewriter(data.message)
      if (data.dailyLeft !== undefined) updateFromResponse(data.dailyLeft, data.monthlyLeft)
    } catch {
      setLimitError('네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text) } catch {
      const el = document.createElement('textarea'); el.value = text
      document.body.appendChild(el); el.select()
      document.execCommand('copy'); document.body.removeChild(el)
    }
    setCopyStates(p => ({ ...p, [key]: true }))
    setTimeout(() => setCopyStates(p => ({ ...p, [key]: false })), 2000)
  }

  const isLimited = usage !== null && (usage.dailyLeft <= 0 || usage.monthlyLeft <= 0)

  const sel = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: '1.5px solid #e5e7eb', background: 'white',
    fontSize: 14, color: '#374151', cursor: 'pointer',
    appearance: 'none' as const,
  }

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button onClick={() => handleCopy(text, id)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${copyStates[id] ? '#86efac' : '#e5e7eb'}`, background: copyStates[id] ? '#f0fdf4' : 'white', color: copyStates[id] ? '#15803d' : '#6b7280', cursor: 'pointer', fontWeight: copyStates[id] ? 700 : 400, transition: 'all 0.2s', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
      {copyStates[id] ? '✓ 복사됨' : '📋 복사'}
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F7', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
        <Link href="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', display: 'inline-block', marginBottom: 12 }}>← 홈으로</Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>✍️ AI 상황별 문구 생성</h1>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 1.25rem' }}>집주인, 이웃과의 소통을 스마트하게</p>

        {/* ✅ 항상 표시되는 사용 현황 배너 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
          {[
            { label: '오늘 남은 횟수', left: usage?.dailyLeft, limit: DAILY_LIMIT },
            { label: '이번 달 남은 횟수', left: usage?.monthlyLeft, limit: MONTHLY_LIMIT },
          ].map(({ label, left, limit }) => {
            const used = left !== undefined ? limit - left : 0
            const isOver = left !== undefined && left <= 0
            return (
              <div key={label} style={{ flex: 1, background: 'white', borderRadius: 12, border: `1px solid ${isOver ? '#fca5a5' : '#e5e7eb'}`, padding: '0.6rem 1rem' }}>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, transition: 'width 0.3s', width: usage ? `${Math.min((used / limit) * 100, 100)}%` : '0%', background: isOver ? '#ef4444' : '#00C896' }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isOver ? '#ef4444' : '#374151' }}>
                    {usage ? `${left}/${limit}` : `?/${limit}`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {limitError && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '12px 16px', marginBottom: '1rem' }}>
            <div style={{ fontSize: 13, color: '#b91c1c', fontWeight: 700, marginBottom: 2 }}>⛔ 사용 한도 초과</div>
            <div style={{ fontSize: 13, color: '#7f1d1d' }}>{limitError}</div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6 }}>대상</label>
              <select value={target} onChange={e => setTarget(e.target.value as Target)} style={sel}>
                <option value="landlord">🏠 집주인</option>
                <option value="neighbor">👥 이웃 주민</option>
                <option value="roommate">🤝 룸메이트</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6 }}>목적</label>
              <select value={purpose} onChange={e => handlePurposeChange(e.target.value as Purpose)} style={sel}>
                <option value="repair">🔧 시설 수리</option>
                <option value="complaint">😤 항의</option>
                <option value="negotiation">🤝 협상</option>
                <option value="greeting">👋 인사</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, color: '#6b7280' }}>메시지 길이</label>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>목적에 맞게 자동 설정됨</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['short', 'medium', 'long'] as MessageLength[]).map(len => (
                <button key={len} onClick={() => setMessageLength(len)} style={{ flex: 1, padding: '8px 4px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${messageLength === len ? '#FFB800' : '#e5e7eb'}`, background: messageLength === len ? '#FFF8E1' : 'white', color: messageLength === len ? '#92400e' : '#6b7280', fontSize: 12, fontWeight: messageLength === len ? 700 : 400, transition: 'all 0.15s', lineHeight: 1.4 }}>
                  <div>{LENGTH_LABEL[len].label}</div>
                  <div style={{ fontSize: 10, opacity: 0.7 }}>{LENGTH_LABEL[len].desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6 }}>톤</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {([{ val: 'polite', label: '😊 정중함' }, { val: 'firm', label: '😤 단호함' }, { val: 'friendly', label: '😄 친근함' }] as { val: Tone; label: string }[]).map(({ val, label }) => (
                <button key={val} onClick={() => setTone(val)} style={{ flex: 1, padding: '8px 4px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${tone === val ? '#00C896' : '#e5e7eb'}`, background: tone === val ? '#ecfdf5' : 'white', color: tone === val ? '#065f46' : '#6b7280', fontSize: 12, fontWeight: tone === val ? 700 : 400, transition: 'all 0.15s' }}>{label}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6 }}>상황 설명 <span style={{ color: '#d1d5db' }}>(선택)</span></label>
            <textarea value={situation} onChange={e => setSituation(e.target.value)}
              placeholder="예: 보일러가 3일째 고장났는데 집주인이 연락을 안 받아요" rows={3}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid #e5e7eb', fontSize: 13, color: '#374151', resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: "'Noto Sans KR', sans-serif" }} />
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading || isLimited}
          style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: isLimited ? '#e5e7eb' : loading ? '#a7f3d0' : '#00C896', color: isLimited ? '#9ca3af' : 'white', fontSize: 15, fontWeight: 700, cursor: isLimited || loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {loading
            ? (<><span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />문구 생성 중...</>)
            : isLimited ? '사용 한도 초과' : '✨ 문구 생성하기'}
        </button>

        {loading && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <div style={{ height: 16, width: 80, background: '#f3f4f6', borderRadius: 6, animation: 'pulse 1.2s ease-in-out infinite', marginBottom: 12 }} />
            {[100, 85, 92].map((w, i) => (
              <div key={i} style={{ height: 14, width: `${w}%`, background: '#f3f4f6', borderRadius: 6, marginBottom: 8, animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite` }} />
            ))}
          </div>
        )}

        {result && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>💬 생성된 메시지</span>
                <CopyBtn text={result.message} id="message" />
              </div>
              <div style={{ fontSize: 14, color: '#1f2937', lineHeight: 1.8, background: '#f9fafb', borderRadius: 10, padding: '12px 14px', whiteSpace: 'pre-wrap', minHeight: 60, borderLeft: '3px solid #00C896' }}>
                {displayed}
                {!done && <span style={{ display: 'inline-block', width: 2, height: 16, background: '#00C896', marginLeft: 2, verticalAlign: 'text-bottom', animation: 'blink 0.7s step-end infinite' }} />}
              </div>
              {done && (
                <button onClick={() => handleCopy(result.message, 'kakao')}
                  style={{ marginTop: 10, width: '100%', padding: '10px', borderRadius: 10, border: `1.5px solid ${copyStates['kakao'] ? '#86efac' : '#FEE033'}`, background: copyStates['kakao'] ? '#f0fdf4' : '#FFF8E1', color: copyStates['kakao'] ? '#15803d' : '#92400e', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {copyStates['kakao'] ? '✓ 복사 완료! 카카오톡에 붙여넣기' : '💬 카카오톡으로 보내기 (복사)'}
                </button>
              )}
            </div>

            {result.tips?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 10 }}>💡 상황별 팁</div>
                {result.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, background: '#ecfdf5', color: '#065f46', border: '1px solid #86efac', borderRadius: 20, padding: '1px 8px', flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{tip}</span>
                  </div>
                ))}
              </div>
            )}

            {result.alternatives?.length > 0 && (
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1.25rem' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111', marginBottom: 10 }}>🔄 대안 표현</div>
                {result.alternatives.map((alt, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: i < result.alternatives.length - 1 ? 10 : 0, paddingBottom: i < result.alternatives.length - 1 ? 10 : 0, borderBottom: i < result.alternatives.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, flex: 1 }}>{alt}</span>
                    <CopyBtn text={alt} id={`alt-${i}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <AiMessagesSeoSection />
    </div>
  )
}

function AiMessagesSeoSection() {
  return (
    <section style={{ background: '#F0F0F2', padding: '3rem 0 2rem' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: '0 0 6px', letterSpacing: '-0.5px' }}>💬 집주인·이웃과 갈등 없이 소통하는 법</h2>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>자취 생활에서 자주 마주치는 상황별 소통 가이드</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TipCard emoji="🏠" title="집주인에게 수리 요청하는 올바른 방법" color="#2563eb" bg="#eff6ff" border="#bfdbfe">
            <p>집주인에게 수리를 요청할 때 가장 중요한 것은 증거 남기기입니다. 카카오톡이나 문자로 요청하면 대화 내역이 증거로 남아 나중에 분쟁이 생겼을 때 도움이 됩니다. 전화로만 연락하는 건 피하세요.</p>
            <p>요청 메시지에는 고장 발생 날짜, 구체적인 증상 설명, 수리 희망 기한 세 가지가 반드시 들어가야 합니다. "보일러가 고장났어요"보다 "11월 3일부터 온수가 나오지 않습니다. 이번 주 내로 수리 부탁드립니다"가 훨씬 효과적이에요.</p>
            <p>집주인이 7일 이상 응답이 없거나 수리를 거부할 경우, 주택임대차분쟁조정위원회(1600-6099)에 신고할 수 있습니다. 수리 의무는 임대인에게 있으며, 이행하지 않을 경우 임차인이 수리 후 비용을 청구할 수 있는 법적 근거가 있습니다.</p>
          </TipCard>
          <TipCard emoji="📢" title="층간 소음·이웃 민원, 감정 상하지 않게 해결하기" color="#d97706" bg="#fffbeb" border="#fde68a">
            <p>이웃 소음 문제는 직접 찾아가는 것보다 메모나 문자가 더 효과적인 경우가 많습니다. 직접 대면은 서로 감정이 상하기 쉽고, 상대방도 방어적으로 반응할 수 있어요. 관리사무소나 경비실을 통해 전달하는 방법도 좋습니다.</p>
            <p>"시끄럽게 하지 마세요"가 아니라 "밤 11시 이후에는 발소리를 좀 줄여주시면 감사하겠습니다"처럼 구체적이고 정중한 요청 형식이 훨씬 효과적입니다. 상대방도 모르고 있었을 가능성이 높아요.</p>
            <p>반복적으로 소음이 발생할 경우 층간소음이웃사이센터(1661-2642)에 신고하거나 관리사무소에 공식 민원을 넣을 수 있습니다. 소음 측정 앱으로 데시벨을 기록해두면 분쟁 시 증거가 됩니다.</p>
          </TipCard>
          <TipCard emoji="🤝" title="룸메이트와 갈등 없이 지내는 생활 규칙" color="#059669" bg="#ecfdf5" border="#a7f3d0">
            <p>룸메이트 갈등의 90%는 입주 전에 명확하게 얘기하지 않아서 발생합니다. 함께 살기 시작하기 전에 청소 주기, 샤워 시간, 음식 공유 여부, 손님 초대 규칙, 취침 시간 등을 미리 정해두세요. 어색하더라도 이 대화가 나중의 큰 갈등을 막아줍니다.</p>
            <p>공과금 정산 방식도 미리 정해야 합니다. 거주 기간이 다를 경우 자취박사 계산기를 활용해 일 기준으로 정산하는 게 공정합니다. 정산일과 방법을 처음부터 정해두면 매달 눈치 보는 상황이 생기지 않아요.</p>
            <p>갈등이 생겼을 때는 "나는 ~할 때 불편했어"처럼 자신의 감정을 중심으로 표현하면 방어적 반응을 줄일 수 있어요. 감정적으로 격해졌을 때는 메시지로 먼저 의견을 전달하는 것도 좋은 방법입니다.</p>
          </TipCard>
          <TipCard emoji="📝" title="계약 갱신·퇴실 시 집주인과 소통하는 법" color="#7c3aed" bg="#f5f3ff" border="#c4b5fd">
            <p>계약 만료 2개월 전부터 집주인과 갱신 여부를 논의하는 것이 좋습니다. 주택임대차보호법에 따라 임차인은 1회에 한해 계약갱신청구권을 행사할 수 있고, 집주인은 정당한 사유 없이 거절할 수 없어요. 갱신 시 월세 인상은 연 5%를 초과할 수 없습니다.</p>
            <p>퇴실을 통보할 때는 계약서에 명시된 사전 통보 기간(보통 1개월)을 반드시 지켜야 합니다. 문자나 카카오톡으로 퇴실 의사를 전달하고 날짜를 기록해두세요. 퇴실 전 방 상태를 사진으로 촬영해두면 보증금 분쟁을 예방할 수 있습니다.</p>
            <p>보증금 반환이 늦어질 경우 지연 이자를 청구할 수 있으며, 임차권등기명령 신청으로 법적으로 보증금을 보호받을 수 있습니다. 이사 후에도 전입신고를 유지하거나 임차권등기를 해두면 보증금을 지킬 수 있어요.</p>
          </TipCard>
        </div>
      </div>
    </section>
  )
}

function TipCard({ emoji, title, color, bg, border, children }: {
  emoji: string; title: string; color: string; bg: string; border: string; children: React.ReactNode
}) {
  return (
    <article style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ background: bg, borderBottom: `1px solid ${border}`, padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <h3 style={{ fontSize: 15, fontWeight: 700, color, margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: '1.25rem', fontSize: 13, color: '#374151', lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {children}
      </div>
    </article>
  )
}