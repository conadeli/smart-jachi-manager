// app/qa/[id]/page.tsx
import AdSense from '@/components/AdSense';
import Link from 'next/link';

export default async function QaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 기존 Supabase 데이터 페치 로직
  const question = await fetchQuestionById(id);
  const relatedQuestions = await fetchRelatedQuestions(id); // 같은 테이블에서 다른 5개

  return (
    <main>
      {/* ✅ 시맨틱 태그: article로 감싸기 */}
      <article itemScope itemType="https://schema.org/QAPage">

        {/* 질문 */}
        <header>
          <h1 itemProp="name">{question.question}</h1>
        </header>

        {/* AI 답변 — 핵심 콘텐츠 */}
        <section
          aria-label="AI 답변"
          itemProp="acceptedAnswer"
          itemScope
          itemType="https://schema.org/Answer"
        >
          <h2>답변</h2>
          {/* ✅ 답변을 단락 단위로 분리해서 렌더링 */}
          <div itemProp="text">
            {question.answer.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* ✅ 광고: 답변 바로 아래 */}
        <AdSense adSlot="1122334455" adFormat="rectangle" />

        {/* ✅ 내부 링크: 관련 질문 보기 */}
        <nav aria-label="관련 질문">
          <h2>관련된 다른 고민 보기</h2>
          <ul>
            {relatedQuestions.map((rq) => (
              <li key={rq.id}>
                <Link href={`/qa/${rq.id}`}>
                  {rq.question}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ✅ 다른 도구로 유도 — 내부 링크 추가 */}
        <aside aria-label="관련 도구">
          <h2>이런 도구도 있어요</h2>
          <ul>
            <li><Link href="/message">집주인에게 메시지 보내기 →</Link></li>
            <li><Link href="/checklist">방 구할 때 체크리스트 →</Link></li>
            <li><Link href="/eviction">부당퇴거 대응하기 →</Link></li>
          </ul>
        </aside>

      </article>
    </main>
  );
}