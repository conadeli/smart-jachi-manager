// app/qa/page.tsx
import AdSense from '@/components/AdSense';
import Link from 'next/link';

// Q&A 목록을 Supabase에서 가져온다고 가정
export default async function QaArchivePage() {
  // 기존 Supabase 데이터 페치 로직 유지
  const questions = await fetchQuestionsFromSupabase(); // 기존 함수 그대로 사용

  return (
    // ✅ 시맨틱 태그: main > article 구조
    <main>
      <header>
        <h1>자취 고민 아카이브</h1>
        <p>자취하면서 생기는 모든 고민에 AI가 답합니다</p>
      </header>

      {/* ✅ Q&A 리스트 — 5개마다 광고 1개 삽입 */}
      <section aria-label="질문 목록">
        {questions.map((q, index) => (
          <>
            <article key={q.id} aria-label={q.question}>
              <Link href={`/qa/${q.id}`}>
                <h2>{q.question}</h2>
                <p>{q.answer?.slice(0, 100)}...</p>
              </Link>
            </article>

            {/* ✅ 5번째 항목마다 광고 삽입 */}
            {(index + 1) % 5 === 0 && (
              <AdSense
                key={`ad-${index}`}
                adSlot="0987654321"
                adFormat="rectangle"
              />
            )}
          </>
        ))}
      </section>
    </main>
  );
}