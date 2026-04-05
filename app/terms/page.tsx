import Link from 'next/link'

export const metadata = {
  title: '이용약관 | 자취박사',
  description: '자취박사 서비스 이용약관입니다.',
}

export default function TermsPage() {
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
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111', margin: '0 0 6px', letterSpacing: '-0.5px' }}>이용약관</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 2.5rem' }}>시행일: 2026년 1월 1일 &nbsp;·&nbsp; 최종 수정일: 2026년 4월 1일</p>

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <Section title="제1조 (목적)">
            이 약관은 자취박사(이하 "서비스")가 제공하는 공과금 계산, AI 문구 생성, 방 구하기 체크리스트 등 온라인 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
          </Section>

          <Section title="제2조 (정의)">
            <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ol>
              <li>"서비스"란 자취박사가 PC, 모바일 기기 등을 통해 이용자에게 제공하는 모든 온라인 서비스를 의미합니다.</li>
              <li>"이용자"란 이 약관에 동의하고 서비스를 이용하는 모든 자를 의미합니다.</li>
              <li>"콘텐츠"란 서비스 내에서 제공되는 텍스트, 계산 결과, AI 생성 문구 등 일체의 정보를 의미합니다.</li>
            </ol>
          </Section>

          <Section title="제3조 (약관의 효력 및 변경)">
            <ol>
              <li>이 약관은 서비스 화면에 게시함으로써 효력이 발생합니다.</li>
              <li>서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지를 통해 고지합니다.</li>
              <li>이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다. 변경 고지 후 계속 서비스를 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.</li>
            </ol>
          </Section>

          <Section title="제4조 (서비스의 제공 및 변경)">
            <ol>
              <li>서비스는 다음과 같은 기능을 제공합니다.
                <ul style={{ marginTop: 8 }}>
                  <li>공과금 N빵 계산기: 거주 기간 기반 공과금 자동 정산</li>
                  <li>AI 상황별 문구 생성: Anthropic Claude AI 기반 메시지 작성 보조</li>
                  <li>방 구하기 체크리스트: 방 상태 평가 및 비교 도구</li>
                </ul>
              </li>
              <li>서비스는 운영상·기술상 필요에 따라 제공 중인 서비스를 변경하거나 중단할 수 있습니다.</li>
              <li>AI 문구 생성 기능은 하루 5회, 월 20회 무료 사용이 가능하며, 이는 변경될 수 있습니다.</li>
            </ol>
          </Section>

          <Section title="제5조 (이용자의 의무)">
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ol>
              <li>서비스 이용 시 허위 정보를 입력하는 행위</li>
              <li>서비스의 안정적인 운영을 방해할 목적으로 대량의 정보를 전송하는 행위</li>
              <li>서비스를 통해 얻은 정보를 서비스의 사전 승낙 없이 복제, 유통, 상업적으로 이용하는 행위</li>
              <li>타인의 권리를 침해하거나 법령에 위반되는 행위</li>
            </ol>
          </Section>

          <Section title="제6조 (서비스 이용 제한)">
            서비스는 이용자가 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 서비스 이용을 제한하거나 중단할 수 있습니다.
          </Section>

          <Section title="제7조 (면책 조항)">
            <ol>
              <li>서비스가 제공하는 공과금 계산 결과, AI 생성 문구, 체크리스트 정보는 참고용이며 법적 효력이 없습니다.</li>
              <li>서비스는 이용자가 AI 생성 문구를 실제 사용함으로써 발생하는 분쟁, 손해에 대해 책임을 지지 않습니다.</li>
              <li>방 구하기 체크리스트의 평가 결과는 실제 부동산 전문가의 의견을 대체하지 않습니다. 중요한 계약 결정 전 반드시 전문가의 조언을 구하시기 바랍니다.</li>
              <li>서비스는 천재지변, 통신 장애, 서버 오류 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
            </ol>
          </Section>

          <Section title="제8조 (저작권)">
            <ol>
              <li>서비스가 작성한 콘텐츠의 저작권은 서비스에 귀속됩니다.</li>
              <li>이용자는 서비스를 이용하여 얻은 정보를 서비스의 사전 승인 없이 상업적으로 이용하거나 제3자에게 제공할 수 없습니다.</li>
            </ol>
          </Section>

          <Section title="제9조 (준거법 및 관할 법원)">
            이 약관의 해석 및 서비스 이용과 관련한 분쟁에 대해서는 대한민국 법률을 준거법으로 하며, 분쟁이 발생할 경우 관할 법원은 민사소송법에 따릅니다.
          </Section>

          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1.5rem', fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>
            <strong style={{ color: '#374151' }}>부칙</strong><br />
            이 약관은 2026년 1월 1일부터 시행합니다.
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