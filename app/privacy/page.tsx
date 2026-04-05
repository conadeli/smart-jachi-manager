import Link from 'next/link'

export const metadata = {
  title: '개인정보처리방침 | 자취박사',
  description: '자취박사 서비스 개인정보처리방침입니다.',
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'Noto Sans KR', sans-serif" }}>

      {/* 헤더 */}
      <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 1.5rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: '#111', textDecoration: 'none', letterSpacing: '-0.5px' }}>
            자취박사
          </Link>
          <Link href="/" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>← 홈으로</Link>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111', margin: '0 0 6px', letterSpacing: '-0.5px' }}>개인정보처리방침</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 2.5rem' }}>시행일: 2026년 1월 1일 &nbsp;·&nbsp; 최종 수정일: 2026년 4월 1일</p>

        {/* 요약 카드 */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e40af', marginBottom: 6 }}>📋 핵심 요약</div>
          <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: '#1e40af', lineHeight: 1.8 }}>
            <li>자취박사는 <strong>별도의 회원가입이 없어</strong> 이름·이메일 등 개인정보를 수집하지 않습니다.</li>
            <li>사용 횟수는 <strong>브라우저 로컬 스토리지</strong>에만 저장되며 서버로 전송되지 않습니다.</li>
            <li>AI 문구 생성 시 입력한 상황 텍스트는 Anthropic API로 전송되며 응답 후 저장되지 않습니다.</li>
          </ul>
        </div>

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <Section title="제1조 (개인정보의 처리 목적)">
            자취박사(이하 "서비스")는 다음 목적을 위해 개인정보를 처리합니다. 처리하는 개인정보는 다음 목적 이외의 용도로 이용되지 않으며, 목적이 변경되는 경우 별도의 동의를 받겠습니다.
            <ul style={{ marginTop: 8 }}>
              <li>서비스 이용 통계 파악 (익명 집계, 개인 식별 불가)</li>
              <li>AI 문구 생성 기능 제공 (입력 텍스트의 일시적 처리)</li>
              <li>서비스 품질 개선</li>
            </ul>
          </Section>

          <Section title="제2조 (수집하는 개인정보 항목)">
            <p style={{ marginBottom: 12 }}>자취박사는 회원가입을 요구하지 않으며, 다음과 같이 최소한의 정보만 처리합니다.</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb', fontWeight: 700 }}>구분</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb', fontWeight: 700 }}>항목</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb', fontWeight: 700 }}>저장 위치</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb', fontWeight: 700 }}>보유 기간</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI 사용 횟수', '일/월 사용 횟수', '브라우저 로컬스토리지', '브라우저 데이터 삭제 시'],
                  ['AI 입력 텍스트', '상황 설명 텍스트', 'Anthropic API (일시적)', '응답 생성 후 즉시 삭제'],
                  ['접속 로그', 'IP, 접속 시간, URL', '서버 로그', '90일'],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', color: '#374151' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="제3조 (개인정보의 제3자 제공)">
            <p>서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 다음의 경우는 예외입니다.</p>
            <ol>
              <li><strong>Anthropic Inc.</strong>: AI 문구 생성 기능 제공을 위해 입력 텍스트가 Anthropic Claude API로 전송됩니다. 이는 응답 생성에만 사용되며 Anthropic의 개인정보처리방침을 따릅니다. (<a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>anthropic.com/privacy</a>)</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ol>
          </Section>

          <Section title="제4조 (개인정보처리의 위탁)">
            서비스는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다.
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 12 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb', fontWeight: 700 }}>수탁업체</th>
                  <th style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #e5e7eb', fontWeight: 700 }}>위탁 업무</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Vercel Inc.', '웹 서버 호스팅 및 CDN 서비스'],
                  ['Anthropic Inc.', 'AI 문구 생성 API 서비스'],
                ].map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '8px 12px', border: '1px solid #e5e7eb', color: '#374151' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="제5조 (이용자의 권리)">
            <p>이용자는 개인정보 주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ol>
              <li>브라우저 로컬스토리지에 저장된 사용 횟수 데이터는 브라우저 설정에서 직접 삭제할 수 있습니다.</li>
              <li>개인정보 관련 문의는 아래 연락처로 요청하실 수 있습니다.</li>
            </ol>
          </Section>

          <Section title="제6조 (쿠키의 사용)">
            서비스는 현재 쿠키를 사용하지 않습니다. 단, 향후 서비스 개선을 위해 쿠키를 도입할 경우 본 방침을 업데이트하고 이용자에게 고지할 예정입니다.
          </Section>

          <Section title="제7조 (개인정보의 안전성 확보 조치)">
            서비스는 개인정보 보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적 조치를 하고 있습니다.
            <ul style={{ marginTop: 8 }}>
              <li>모든 통신 구간 HTTPS(SSL/TLS) 암호화 적용</li>
              <li>API 키 등 민감 정보는 서버 환경 변수로 관리 (클라이언트 노출 없음)</li>
              <li>이용자 개인정보 미수집으로 인한 데이터 침해 위험 최소화</li>
            </ul>
          </Section>

          <Section title="제8조 (개인정보 보호책임자)">
            <p>서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 이용자의 개인정보 관련 문의, 불만 처리 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 16px', marginTop: 10, fontSize: 13, color: '#374151', lineHeight: 1.8 }}>
              <strong>개인정보 보호책임자</strong><br />
              서비스명: 자취박사<br />
              문의: 서비스 내 피드백 기능을 통해 접수
            </div>
          </Section>

          <Section title="제9조 (개인정보처리방침의 변경)">
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 서비스 화면을 통하여 고지할 것입니다.
          </Section>

          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem', fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>
            <strong style={{ color: '#374151' }}>부칙</strong><br />
            이 방침은 2026년 1월 1일부터 시행합니다.
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 12px', paddingBottom: 10, borderBottom: '1px solid #f3f4f6' }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.9 }}>
        {children}
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#111827', padding: '2rem 1.5rem', textAlign: 'center' }}>
      <p style={{ fontSize: 12, color: '#4b5563', margin: '0 0 8px' }}>© 2026 자취박사. 본 서비스의 정보는 참고용이며 법적 효력이 없습니다.</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <Link href="/terms" style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none' }}>이용약관</Link>
        <Link href="/privacy" style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none' }}>개인정보처리방침</Link>
      </div>
    </footer>
  )
}