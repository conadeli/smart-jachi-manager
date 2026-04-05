'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Question {
  id: string;
  slug: string;
  category: 'eviction' | 'roommate' | 'management';
  title: string;
  created_at: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  eviction: '🚨',
  roommate: '👥',
  management: '💰',
};

const CATEGORY_LABEL: Record<string, string> = {
  eviction: '퇴거 방어',
  roommate: '룸메이트',
  management: '관리비',
};

export default function HomePage() {
  const [recentQuestions, setRecentQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Supabase의 실제 데이터로 업데이트
    setRecentQuestions([
      {
        id: '1',
        slug: 'roommate-1775222285259',
        category: 'roommate',
        title: '룸메이트와의 갈등, 공동생활 규칙을 어떻게 정해야 할까요?',
        created_at: '2026-04-03',
      },
      {
        id: '2',
        slug: 'eviction-1775221847380',
        category: 'eviction',
        title: '파손 부위에 대한 책임 구분, 정당한 사유 없는 퇴거 요구에 대응하기',
        created_at: '2026-04-03',
      },
      {
        id: '3',
        slug: 'roommate-1775313997120',
        category: 'roommate',
        title: '룸메이트와의 갈등, 공동생활 규칙을 어떻게 정해야 할까요?',
        created_at: '2026-04-04',
      },
      {
        id: '4',
        slug: 'roommate-1775306704908',
        category: 'roommate',
        title: '룸메이트와의 갈등, 공동생활 규칙을 어떻게 정해야 할까요?',
        created_at: '2026-04-04',
      },
      {
        id: '5',
        slug: 'roommate-1775224014353',
        category: 'roommate',
        title: '룸메이트와의 갈등, 공동생활 규칙을 어떻게 정해야 할까요?',
        created_at: '2026-04-03',
      },
      {
        id: '6',
        slug: 'roommate-1775222285259',
        category: 'roommate',
        title: '룸메이트와의 갈등, 공동생활 규칙을 어떻게 정해야 할까요?',
        created_at: '2026-04-03',
      },
    ]);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'Noto Sans KR', 'Pretendard', sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        
        .feature-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          padding: 1.75rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
        }
        
        .killer-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          padding: 1.5rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .killer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        
        .archive-card {
          background: #F8F9FA;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 0.875rem 1rem;
          transition: box-shadow 0.15s;
        }
        .archive-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .hero-decoration {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
        }
        .hero-decoration-1 {
          width: 300px;
          height: 300px;
          background: white;
          top: -100px;
          right: -100px;
        }
        .hero-decoration-2 {
          width: 200px;
          height: 200px;
          background: white;
          bottom: -50px;
          left: -50px;
        }
      `}</style>

      {/* 헤더 */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: '#111', letterSpacing: '-0.5px', textDecoration: 'none' }}>자취박사</Link>
          <nav style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { href: '/utilities', label: '공과금 계산' },
              { href: '/ai-messages', label: 'AI 문구' },
              { href: '/room-checklist', label: '방 체크리스트' },
              { href: '/archive', label: '아카이브' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #0ea5e9 100%)', padding: '5rem 1.5rem 6rem', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-decoration hero-decoration-1" />
        <div className="hero-decoration hero-decoration-2" />
        
        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: 'white', margin: '0 0 12px', lineHeight: 1.3, maxWidth: 500 }}>
            1인 가구의 모든 것을 해결합니다
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', margin: 0, maxWidth: 550, lineHeight: 1.6 }}>
            공과금 정산부터 퇴거 방어까지. 자취 생활의 모든 귀찮은 상황을 AI와 계산기로 한번에 해결하세요.
          </p>
        </div>
      </section>

      {/* 주요 기능 */}
      <section style={{ background: '#F8F9FA', padding: '3.5rem 1.5rem' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: '0 0 2rem', letterSpacing: '-0.5px' }}>주요 기능</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
            {[
              {
                emoji: '💰',
                title: '공과금 N빵 계산기',
                desc: '입주자별로 1원 단위까지 정확히 정산합니다. 중도 입퇴거도 자동 계산.',
                href: '/utilities',
                icon_bg: '#fef3c7',
              },
              {
                emoji: '✍️',
                title: 'AI 상황별 문구 생성',
                desc: '집주인 협상부터 이웃 항의까지. AI가 정중하고 효과적인 문안을 만들어줍니다.',
                href: '/ai-messages',
                icon_bg: '#dbeafe',
              },
              {
                emoji: '📋',
                title: '방 구하기 체크리스트',
                desc: '수압, 곰팡이, 결로, 소음 등 필수항목을 확인하고 점수로 평가합니다.',
                href: '/room-checklist',
                icon_bg: '#dcfce7',
              },
            ].map(({ emoji, title, desc, href, icon_bg }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div className="feature-card">
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: icon_bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 12 }}>
                    {emoji}
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3대 킬러 기능 */}
      <section style={{ background: 'white', padding: '3.5rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: '0 0 2rem', letterSpacing: '-0.5px' }}>자취박사만의 특별한 기능</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { emoji: '🚨', title: 'AI 퇴거 방어', desc: '정당한 사유 없는 퇴거 요구에 효과적으로 대응하는 문안을 제시합니다.', href: '/eviction-defense', color: '#1d4ed8', bg: '#eff6ff' },
              { emoji: '👥', title: '룸메이트 평화협정 생성기', desc: '공동생활 규칙을 체계적으로 정리해 다운로드 가능한 DOCX 파일로 받습니다.', href: '/roommate-peace', color: '#065f46', bg: '#ecfdf5' },
              { emoji: '🏦', title: '관리비 거품 체커', desc: '지역의 평균 관리비와 비교해 당신의 관리비가 적절한지 판단합니다.', href: '/management-check', color: '#92400e', bg: '#fffbeb' },
            ].map(({ emoji, title, desc, href, color, bg }) => (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div className="killer-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {emoji}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>{title}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO 팁 섹션 */}
      <section style={{ background: '#F8F9FA', padding: '3.5rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: '0 0 2rem', letterSpacing: '-0.5px' }}>자취 꿀팁</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {[
              {
                emoji: '💡',
                title: '공과금 절약 꿀팁',
                items: [
                  '세탁기는 찬바람, 따뜻한바람 50:50 섞어서 사용',
                  '보일러는 자동온도 조절기 설정해서 낮은 온도 유지',
                  '차단기에서 불필요한 전자제품 꼭 꺼두기',
                  '에어컨 필터는 2주마다 청소 (1개월 주기 권장)',
                ],
                color: '#d97706',
                bg: '#fffbeb',
              },
              {
                emoji: '📋',
                title: '월세 계약 필수 체크',
                items: [
                  '계약서 위반사항 섹션 꼭 읽어보기',
                  '보증금 환급 일정 명시되어 있는지 확인',
                  '추가 비용 항목 (관리비, 수선비) 명확히 하기',
                  '사진 촬영으로 입주시 상태 기록하기',
                ],
                color: '#2563eb',
                bg: '#eff6ff',
              },
              {
                emoji: '🏠',
                title: '방 구할 때 꼭 확인할 것',
                items: [
                  '곰팡이는 가구 뒤, 창문 틀 안쪽까지 직접 확인',
                  '수압은 샤워기와 주방 수도꼭지 동시에 틀어서 테스트',
                  '소음은 창문 열고 10분 이상 머물러야 파악 가능',
                  '난방비 전월 고지서 요청 — 거절하면 의심할 것',
                ],
                color: '#d97706',
                bg: '#fffbeb',
              },
            ].map(({ emoji, title, items, color, bg }) => (
              <div key={title} style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {emoji}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>{title}</h3>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: bg, color, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 최근 해결된 자취 고민 */}
      <section style={{ background: 'white', padding: '3.5rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.5px' }}>📚 최근 해결된 자취 고민</h2>
            <Link href="/archive" style={{ fontSize: 13, color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
              전체 보기 →
            </Link>
          </div>
          {recentQuestions.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
              {recentQuestions.map(q => (
                <Link key={q.id} href={`/archive/${q.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="archive-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 14 }}>{CATEGORY_EMOJI[q.category]}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: q.category === 'eviction' ? '#1d4ed8' : q.category === 'roommate' ? '#065f46' : '#92400e', background: q.category === 'eviction' ? '#eff6ff' : q.category === 'roommate' ? '#ecfdf5' : '#fffbeb', padding: '1px 6px', borderRadius: 8 }}>
                        {CATEGORY_LABEL[q.category]}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                      {q.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                      {new Date(q.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: 13 }}>
              AI 기능을 사용하면 이곳에 자동으로 저장돼요
            </div>
          )}
        </div>
      </section>

      {/* 푸터 */}
      <footer style={{ background: '#1f2937', color: 'white', padding: '2.5rem 1.5rem 1.5rem', borderTop: '1px solid #374151' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginBottom: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                서비스
              </div>
              {[
                { href: '/utilities', label: '공과금 N빵 계산기' },
                { href: '/ai-messages', label: 'AI 상황별 문구 생성' },
                { href: '/room-checklist', label: '방 구하기 체크리스트' },
                { href: '/archive', label: '아카이브' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ display: 'block', fontSize: 13, color: '#d1d5db', textDecoration: 'none', marginBottom: 6, transition: 'color 0.2s' }}>
                  {label}
                </Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', marginBottom: 10, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                정보
              </div>
              {['이용약관', '개인정보처리방침'].map(label => (
                <div key={label} style={{ fontSize: 13, color: '#d1d5db', marginBottom: 6, cursor: 'pointer' }}>
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #374151', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
              © 2026 자취박사. 본 서비스의 정보는 참고용이며 법적 효력이 없습니다.
            </p>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
              출처: 국토교통부 · 한국전력공사 · 주택도시보증공사
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}