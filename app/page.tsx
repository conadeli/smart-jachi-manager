import Link from 'next/link'
import { Calculator, MessageSquare, Home, CheckCircle, Zap, ChevronRight, Shield, Users, Search } from 'lucide-react'
import { supabase, CATEGORY_LABEL, CATEGORY_EMOJI, Question } from '@/lib/supabase'
import AdSense from '@/components/AdSense'

export const revalidate = 60

async function getRecentQuestions(): Promise<Question[]> {
  const { data } = await supabase
    .from('questions')
    .select('id, title, category, slug, created_at')
    .order('created_at', { ascending: false })
    .limit(6)
  return (data as Question[]) ?? []
}

export default async function HomePage() {
  const recentQuestions = await getRecentQuestions()

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'Noto Sans KR', 'Pretendard', sans-serif" }}>
      <style>{`
        .feature-card {
          background: white; border-radius: 20px; border: 1px solid #e5e7eb;
          padding: 1.75rem; transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer; box-sizing: border-box; height: 100%; display: block;
        }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
        .killer-card {
          background: white; border-radius: 16px; border: 1px solid #e5e7eb;
          padding: 1.5rem; transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer; box-sizing: border-box; height: 100%; display: block;
        }
        .killer-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .archive-card { transition: box-shadow 0.15s; }
        .archive-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
      `}</style>

      {/* ✅ 시맨틱: 사이트 전체 헤더 */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#111', letterSpacing: '-0.5px' }}>자취박사</span>
          <nav aria-label="주요 메뉴" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { href: '/utilities', label: '공과금 계산' },
              { href: '/ai-messages', label: 'AI 문구' },
              { href: '/room-checklist', label: '방 체크리스트' },
              { href: '/eviction-defense', label: '퇴거 방어' },
              { href: '/archive', label: '아카이브' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>{label}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* ✅ 시맨틱: 히어로를 section으로 */}
        <section aria-label="서비스 소개" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #0ea5e9 100%)', padding: '5rem 1.5rem 6rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 14px', marginBottom: 20 }}>
              <Zap size={12} color="white" />
              <span style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>자취생을 위한 AI 도우미</span>
            </div>
            {/* ✅ 시맨틱: 페이지 대표 h1 */}
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, color: 'white', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-1px' }}>
              자취의 모든 귀찮음을<br />한 번에 해결한다
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, margin: '0 0 32px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              공과금 정산부터 집주인 항의 문자까지.<br />자취박사가 대신 계산하고, 대신 써드립니다.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/utilities" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', color: '#1e40af', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                무료로 시작하기 <ChevronRight size={16} />
              </Link>
              <Link href="/room-checklist" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', color: 'white', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>
                방 구하기 체크리스트
              </Link>
            </div>
          </div>
        </section>

        {/* ✅ 광고: 히어로 바로 아래 */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 1.5rem' }}>
            <AdSense adSlot="1234567890" adFormat="horizontal" />
          </div>
        </div>

        {/* 통계 */}
        <section aria-label="서비스 통계" style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[{ num: '6가지', label: 'AI 자취 해결 도구' }, { num: '무료', label: '모든 계산 기능' }, { num: 'AI', label: 'Claude 기반 문구 생성' }].map(({ num, label }, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1rem', borderRight: i < 2 ? '1px solid #e5e7eb' : 'none' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#2563eb', marginBottom: 2 }}>{num}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ 시맨틱: 기존 기능 카드 */}
        <section aria-label="주요 기능" style={{ padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111', margin: '0 0 8px', letterSpacing: '-0.5px' }}>자취 생활의 모든 순간</h2>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>세 가지 도구로 자취의 귀찮음을 해결하세요</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {[
                { href: '/utilities', icon: <Calculator size={24} color="#2563eb" />, iconBg: '#eff6ff', tag: '계산기', tagColor: '#2563eb', tagBg: '#eff6ff', title: '공과금 N빵 계산기', desc: '전기·가스·수도 공과금을 거주 기간 기준으로 자동 정산. 입퇴거 포함 1원 단위까지 정확하게.', features: ['거주 일수 자동 계산', '인원별 분담금 산출', '입퇴거 부분 정산'], cta: '계산 시작하기' },
                { href: '/ai-messages', icon: <MessageSquare size={24} color="#059669" />, iconBg: '#ecfdf5', tag: 'AI 생성', tagColor: '#059669', tagBg: '#ecfdf5', title: 'AI 상황별 문구 생성', desc: '집주인 항의, 이웃 소음 민원, 룸메이트 갈등. 상황만 입력하면 바로 쓸 수 있는 메시지를 만들어드려요.', features: ['집주인·이웃·룸메이트 대상', '정중함·단호함·친근함 톤 선택', '길이 조절 기능'], cta: '문구 생성하기' },
                { href: '/room-checklist', icon: <Home size={24} color="#d97706" />, iconBg: '#fffbeb', tag: '체크리스트', tagColor: '#d97706', tagBg: '#fffbeb', title: '방 구하기 체크리스트', desc: '35개 항목으로 방 상태를 100점 만점으로 평가. 전세사기 예방부터 월세 협상 팁까지.', features: ['월세·전세 맞춤 항목', '레드플래그 자동 경고', '방 3개 비교 + 카카오 공유'], cta: '방 평가하기' },
              ].map(({ href, icon, iconBg, tag, tagColor, tagBg, title, desc, features, cta }) => (
                <article key={href}>
                  <Link href={href} style={{ textDecoration: 'none' }}>
                    <div className="feature-card">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: tagColor, background: tagBg, padding: '3px 10px', borderRadius: 20 }}>{tag}</span>
                      </div>
                      <h2 style={{ fontSize: 17, fontWeight: 800, color: '#111', margin: '0 0 8px', letterSpacing: '-0.3px' }}>{title}</h2>
                      <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, margin: '0 0 16px' }}>{desc}</p>
                      <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {features.map((f, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151' }}>
                            <CheckCircle size={13} color={tagColor} />{f}
                          </li>
                        ))}
                      </ul>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: tagColor }}>
                        {cta} <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ 시맨틱: 킬러 기능 */}
        <section aria-label="AI 분쟁 해결 기능" style={{ padding: '4rem 1.5rem', background: 'white', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 20, padding: '4px 14px', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#b91c1c', fontWeight: 700 }}>🔥 NEW 킬러 기능</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: '0 0 8px', letterSpacing: '-0.5px' }}>자취 분쟁, AI로 해결하세요</h2>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>퇴거 협박, 룸메이트 갈등, 관리비 폭탄 — 세 가지 무기로 대응하세요</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {[
                { href: '/eviction-defense', icon: <Shield size={22} color="#2563eb" />, iconBg: '#eff6ff', tag: '퇴거분쟁', tagColor: '#2563eb', tagBg: '#eff6ff', accentColor: '#2563eb', title: 'AI 퇴거 방어기', desc: '파손 부위·거주기간 입력 시 임차인 과실 여부 판정 + 협상 문구 즉시 생성', features: ['과실 여부 법적 판정', '주택임대차보호법 근거 제시', '협상 문구 자동 생성'], cta: '과실 판정받기' },
                { href: '/roommate-peace', icon: <Users size={22} color="#059669" />, iconBg: '#ecfdf5', tag: '룸메이트', tagColor: '#059669', tagBg: '#ecfdf5', accentColor: '#059669', title: '룸메이트 평화 협정기', desc: '갈등 항목 선택 시 공평한 생활 규칙 리포트 + 서명용 협정서 생성', features: ['15가지 갈등 항목 분석', '공평한 규칙 자동 생성', '카카오톡 공유 협정서'], cta: '협정 만들기' },
                { href: '/management-check', icon: <Search size={22} color="#d97706" />, iconBg: '#fffbeb', tag: '관리비', tagColor: '#d97706', tagBg: '#fffbeb', accentColor: '#d97706', title: '관리비 거품 검사기', desc: '지역·건물유형·금액 입력 시 적정성 별점 평가 + 인하 요청 문구 생성', features: ['지역별 평균 비교', '별점 시각화 적정성 평가', '숨겨진 비용 분석'], cta: '거품 검사하기' },
              ].map(({ href, icon, iconBg, tag, tagColor, tagBg, accentColor, title, desc, features, cta }) => (
                <article key={href}>
                  <Link href={href} style={{ textDecoration: 'none' }}>
                    <div className="killer-card" style={{ borderTop: `3px solid ${accentColor}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: tagColor, background: tagBg, padding: '2px 8px', borderRadius: 10 }}>{tag}</span>
                      </div>
                      <h2 style={{ fontSize: 16, fontWeight: 800, color: '#111', margin: '0 0 6px', letterSpacing: '-0.3px' }}>{title}</h2>
                      <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: '0 0 12px' }}>{desc}</p>
                      <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {features.map((f, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#374151' }}>
                            <CheckCircle size={12} color={accentColor} />{f}
                          </li>
                        ))}
                      </ul>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: accentColor }}>
                        {cta} <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ 시맨틱: SEO 콘텐츠 */}
        <section aria-label="자취 필수 정보" style={{ background: '#F8F9FA', padding: '4rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: '0 0 8px', letterSpacing: '-0.5px' }}>자취생을 위한 필수 정보</h2>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>자취 생활에서 꼭 알아야 할 핵심 정보를 정리했어요</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {[
                { emoji: '💡', title: '공과금 절약 팁', items: ['에어컨 설정 온도 26도 유지 시 전기료 30% 절감', '가스레인지보다 인덕션이 에너지 효율 15% 높음', '대기 전력 차단 멀티탭으로 월 3,000~5,000원 절약 가능', '단열 필름 부착으로 겨울 난방비 최대 20% 절감'], color: '#2563eb', bg: '#eff6ff' },
                { emoji: '📋', title: '월세 계약 필수 체크', items: ['계약 전 등기부등본 직접 발급 확인 (iros.go.kr, 700원)', '관리비 포함 항목 계약서에 반드시 명시', '입주 전 방 상태 사진 촬영 후 날짜 기록 보관', '전입신고는 잔금 당일 바로 처리 — 하루 늦으면 보호 불가'], color: '#059669', bg: '#ecfdf5' },
                { emoji: '🏠', title: '방 구할 때 꼭 확인할 것', items: ['곰팡이는 가구 뒤, 창문 틀 안쪽까지 직접 확인', '수압은 샤워기와 주방 수도꼭지 동시에 틀어서 테스트', '소음은 창문 열고 10분 이상 머물러야 파악 가능', '난방비 전월 고지서 요청 — 거절하면 의심할 것'], color: '#d97706', bg: '#fffbeb' },
              ].map(({ emoji, title, items, color, bg }) => (
                <article key={title} style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{emoji}</div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>{title}</h2>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {items.map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: bg, color: color, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                        <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ 시맨틱: 최근 Q&A */}
        <section aria-label="최근 자취 고민 아카이브" style={{ background: 'white', padding: '3.5rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.5px' }}>📚 최근 해결된 자취 고민</h2>
              <Link href="/archive" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>전체 보기 →</Link>
            </div>
            {recentQuestions.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                {recentQuestions.map(q => (
                  <article key={q.id}>
                    <Link href={`/archive/${q.slug}`} style={{ textDecoration: 'none' }}>
                      <div className="archive-card" style={{ background: '#F8F9FA', borderRadius: 12, border: '1px solid #e5e7eb', padding: '0.875rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 14 }}>{CATEGORY_EMOJI[q.category]}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: q.category === 'eviction' ? '#1d4ed8' : q.category === 'roommate' ? '#065f46' : '#92400e', background: q.category === 'eviction' ? '#eff6ff' : q.category === 'roommate' ? '#ecfdf5' : '#fffbeb', padding: '1px 6px', borderRadius: 8 }}>
                            {CATEGORY_LABEL[q.category]}
                          </span>
                        </div>
                        <h3 style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, margin: 0 }}>
                          {q.title}
                        </h3>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                          {new Date(q.created_at).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: '#9ca3af', background: '#F8F9FA', borderRadius: 16, border: '1px dashed #e5e7eb' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                <p style={{ fontSize: 14, margin: '0 0 16px' }}>AI 기능을 사용하면 이곳에 자동으로 저장돼요</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/eviction-defense" style={{ padding: '7px 16px', borderRadius: 8, background: '#2563eb', color: 'white', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>퇴거 방어기</Link>
                  <Link href="/roommate-peace" style={{ padding: '7px 16px', borderRadius: 8, background: '#059669', color: 'white', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>룸메이트 협정기</Link>
                  <Link href="/management-check" style={{ padding: '7px 16px', borderRadius: 8, background: '#d97706', color: 'white', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>관리비 검사기</Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section aria-label="시작 유도" style={{ background: 'linear-gradient(135deg, #1e40af, #0ea5e9)', padding: '3.5rem 1.5rem' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 10px', letterSpacing: '-0.5px' }}>지금 바로 시작하세요</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: '0 0 24px' }}>회원가입 없이 무료로 모든 기능을 사용할 수 있어요</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/utilities" style={{ background: 'white', color: '#1e40af', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>공과금 계산하기</Link>
              <Link href="/eviction-defense" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>퇴거 방어기 사용하기</Link>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer style={{ background: '#111827', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 6 }}>자취박사</div>
              <p style={{ fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.7, maxWidth: 280 }}>자취생의 모든 귀찮고 껄끄러운 상황을<br />AI와 계산기로 해결합니다.</p>
            </div>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginBottom: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}>서비스</div>
                {[
                  { href: '/utilities', label: '공과금 N빵 계산기' },
                  { href: '/ai-messages', label: 'AI 상황별 문구 생성' },
                  { href: '/room-checklist', label: '방 구하기 체크리스트' },
                  { href: '/eviction-defense', label: 'AI 퇴거 방어기' },
                  { href: '/roommate-peace', label: '룸메이트 평화 협정기' },
                  { href: '/management-check', label: '관리비 거품 검사기' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} style={{ display: 'block', fontSize: 13, color: '#6b7280', textDecoration: 'none', marginBottom: 6 }}>{label}</Link>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginBottom: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}>법적 고지</div>
                <Link href="/terms" style={{ display: 'block', fontSize: 13, color: '#6b7280', textDecoration: 'none', marginBottom: 6 }}>이용약관</Link>
                <Link href="/privacy" style={{ display: 'block', fontSize: 13, color: '#6b7280', textDecoration: 'none', marginBottom: 6 }}>개인정보처리방침</Link>
                <Link href="/archive" style={{ display: 'block', fontSize: 13, color: '#6b7280', textDecoration: 'none', marginBottom: 6 }}>자취 고민 아카이브</Link>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1f2937', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontSize: 11, color: '#4b5563', margin: 0 }}>© 2026 자취박사. 본 서비스의 정보는 참고용이며 법적 효력이 없습니다.</p>
            <p style={{ fontSize: 11, color: '#4b5563', margin: 0 }}>출처: 국토교통부 · 한국전력공사 · 주택도시보증공사 가이드 준수</p>
          </div>
        </div>
      </footer>

    </div>
  )
}