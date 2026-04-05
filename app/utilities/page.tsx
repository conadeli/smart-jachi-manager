'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function UtilitiesPage() {
  const [formData, setFormData] = useState({
    electricityTotal: '',
    gasTotal: '',
    waterTotal: '',
    internetTotal: '',
    residents: [{ id: '1', name: '', moveInDate: '', moveOutDate: '' }]
  })

  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = () => {
    setLoading(true)
    try {
      const personDays = formData.residents.reduce((sum, resident) => {
        if (!resident.name) return sum
        const moveIn = new Date(resident.moveInDate)
        const moveOut = resident.moveOutDate ? new Date(resident.moveOutDate) : new Date()
        const days = Math.floor((moveOut.getTime() - moveIn.getTime()) / (1000 * 60 * 60 * 24)) + 1
        return sum + days
      }, 0)

      const totalAmount =
        (parseInt(formData.electricityTotal) || 0) +
        (parseInt(formData.gasTotal) || 0) +
        (parseInt(formData.waterTotal) || 0) +
        (parseInt(formData.internetTotal) || 0)

      const costPerPersonDay = {
        electricity: (parseInt(formData.electricityTotal) || 0) / personDays,
        gas: (parseInt(formData.gasTotal) || 0) / personDays,
        water: (parseInt(formData.waterTotal) || 0) / personDays,
        internet: (parseInt(formData.internetTotal) || 0) / personDays,
      }

      const individuals = formData.residents
        .filter(r => r.name)
        .map(resident => {
          const moveIn = new Date(resident.moveInDate)
          const moveOut = resident.moveOutDate ? new Date(resident.moveOutDate) : new Date()
          const residencyDays = Math.floor((moveOut.getTime() - moveIn.getTime()) / (1000 * 60 * 60 * 24)) + 1
          const bill = Math.round(
            (costPerPersonDay.electricity + costPerPersonDay.gas + costPerPersonDay.water + costPerPersonDay.internet) * residencyDays
          )
          return { id: resident.id, residentName: resident.name, residencyDays, finalAmount: bill }
        })

      setResult({
        summary: { totalResidents: formData.residents.filter(r => r.name).length, totalPersonDays: personDays, totalAmount },
        individuals,
      })
    } catch (error) {
      console.error('계산 실패:', error)
      alert('계산 중 오류가 발생했습니다')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-block mb-6 text-yellow-600 hover:text-yellow-700 font-semibold">
          ← 홈으로
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          💰 공과금 N빵 계산기
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { label: '전기요금', key: 'electricityTotal' },
              { label: '가스요금', key: 'gasTotal' },
              { label: '수도요금', key: 'waterTotal' },
              { label: '인터넷요금', key: 'internetTotal' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>
                <input
                  type="number"
                  value={(formData as any)[key]}
                  onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">거주자 정보</h3>
            {formData.residents.map((resident, idx) => (
              <div key={resident.id} className="grid grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="이름"
                  value={resident.name}
                  onChange={e => {
                    const newResidents = [...formData.residents]
                    newResidents[idx].name = e.target.value
                    setFormData({ ...formData, residents: newResidents })
                  }}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500"
                />
                <input
                  type="date"
                  value={resident.moveInDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => {
                    const newResidents = [...formData.residents]
                    newResidents[idx].moveInDate = e.target.value
                    setFormData({ ...formData, residents: newResidents })
                  }}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500"
                />
                <input
                  type="date"
                  value={resident.moveOutDate}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => {
                    const newResidents = [...formData.residents]
                    newResidents[idx].moveOutDate = e.target.value
                    setFormData({ ...formData, residents: newResidents })
                  }}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-yellow-500"
                />
              </div>
            ))}
            <button
              onClick={() => setFormData({
                ...formData,
                residents: [...formData.residents, { id: Date.now().toString(), name: '', moveInDate: '', moveOutDate: '' }]
              })}
              className="px-4 py-2 text-yellow-600 font-semibold border-2 border-yellow-600 rounded-lg hover:bg-yellow-50 transition"
            >
              + 거주자 추가
            </button>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full px-6 py-4 bg-yellow-600 text-white rounded-lg font-bold text-lg hover:bg-yellow-700 disabled:opacity-50 transition"
          >
            {loading ? '계산 중...' : '정산 계산하기'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">정산 결과</h2>
            <div className="bg-yellow-50 rounded-xl p-6 mb-8">
              <p className="text-gray-600 mb-2">총 정산액</p>
              <p className="text-4xl font-bold text-yellow-600">
                ₩{result.summary.totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">개인별 정산</h3>
              {result.individuals.map((person: any) => (
                <div key={person.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{person.residentName}</p>
                    <p className="text-sm text-gray-600">{person.residencyDays}일 거주</p>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">
                    ₩{person.finalAmount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* SEO 콘텐츠 섹션 */}
      <UtilitiesSeoSection />
    </div>
  )
}

// ─── SEO 섹션 ───────────────────────────────────────────────

function UtilitiesSeoSection() {
  return (
    <section style={{ background: '#F8F9FA', padding: '3rem 0 2rem', marginTop: '2rem' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            💡 공과금 절약 완벽 가이드
          </h2>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>자취생이 실천하면 월 2~5만원 아낄 수 있는 방법들</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TipCard emoji="⚡" title="전기세 줄이는 실전 방법" color="#2563eb" bg="#eff6ff" border="#bfdbfe">
            <p>자취생 전기세의 절반 이상은 에어컨과 전기장판에서 나옵니다. 에어컨 설정 온도를 26도로 유지하면 25도 대비 전력 소비를 약 7~10% 줄일 수 있고, 제습 모드는 냉방 모드보다 전력을 30% 이상 덜 씁니다. 여름철에는 선풍기와 에어컨을 함께 사용하면 체감 온도를 낮추면서 에어컨 사용 시간을 줄일 수 있어요.</p>
            <p>대기 전력도 무시하면 안 됩니다. TV, 전자레인지, 충전기 등은 꺼져 있어도 꽂혀있으면 전력을 소비해요. 멀티탭 스위치로 통째로 끄는 습관을 들이면 월 3,000~5,000원 절약이 가능합니다. 냉장고는 70% 이하로 채우면 냉기 순환이 잘 돼 효율이 올라가고, 뒷면과 벽 사이 10cm 이상 간격을 유지해야 방열이 제대로 됩니다.</p>
            <p>LED 조명으로 교체하면 형광등 대비 전력 소비가 75% 줄어듭니다. 전기 요금은 누진제가 적용되기 때문에 사용량이 늘수록 단가가 가파르게 오릅니다. 특히 여름·겨울 냉난방 시즌에는 200kWh 이하를 유지하는 것을 목표로 하세요.</p>
          </TipCard>
          <TipCard emoji="🔥" title="가스비·난방비 절약법" color="#d97706" bg="#fffbeb" border="#fde68a">
            <p>가스비는 보일러 사용 방식에 따라 크게 달라집니다. 외출 시 보일러를 완전히 끄는 것보다 외출 모드(10~15도 유지)로 설정하는 게 오히려 가스비를 줄일 수 있어요. 완전히 식은 방을 다시 데우는 데 더 많은 에너지가 들기 때문입니다.</p>
            <p>창문 단열 시트는 3,000~5,000원으로 구입할 수 있고 겨울 난방비를 최대 20% 줄여줍니다. 문풍지는 현관문과 창문 틈새 냉기를 차단해 체감 온도를 2~3도 높여줘요. 샤워 시간을 1분 줄이면 가스비가 월 1,000~2,000원 절약되고, 설거지는 흐르는 물보다 고인 물을 사용하는 게 훨씬 절약됩니다.</p>
            <p>보일러 필터는 3개월마다 청소하면 효율이 유지됩니다. 보일러가 10년 이상 됐다면 효율이 크게 떨어진 상태일 수 있어요. 입주 시 집주인에게 보일러 연식 확인을 요청하세요.</p>
          </TipCard>
          <TipCard emoji="💧" title="수도·인터넷 요금 관리" color="#059669" bg="#ecfdf5" border="#a7f3d0">
            <p>수도 요금은 샤워 시간 조절로 가장 많이 절약할 수 있습니다. 5분 샤워와 10분 샤워는 요금이 2배 가까이 차이납니다. 수도꼭지 절수 어댑터는 2,000원 안팎으로 물 사용량을 30% 줄여줍니다.</p>
            <p>인터넷 요금은 통신사 경쟁이 심해 협상 여지가 큽니다. 기존 계약 만료 시 해지 의사를 밝히면 대부분 요금을 낮춰주거나 사은품을 제공합니다. 혼자 사는 경우 100Mbps로도 충분하며, 통신사 결합 할인을 활용하면 휴대폰 요금과 합산해 월 1~2만원 절약이 가능합니다.</p>
            <p>관리비에 인터넷이 포함된 경우 별도 계약 없이 공용 인터넷을 쓸 수 있어요. 입주 전 반드시 확인하세요.</p>
          </TipCard>
          <TipCard emoji="🧮" title="공과금 정산, 이것만 알면 분쟁 없다" color="#7c3aed" bg="#f5f3ff" border="#c4b5fd">
            <p>룸메이트나 공동 거주자와 공과금을 나눌 때 분쟁이 생기는 가장 큰 이유는 거주 기간 차이를 고려하지 않기 때문입니다. 중간에 들어오거나 나간 사람이 있을 때는 1인 1일 기준으로 계산하는 것이 가장 공정합니다.</p>
            <p>정산 시 고지서 기간과 실제 거주 기간이 일치하지 않는 경우도 있어요. 카카오페이, 토스 등 간편 송금 앱을 활용하면 정산 내역이 기록으로 남아 나중에 분쟁이 생겨도 증빙이 됩니다.</p>
            <p>공과금 외에도 공용 소모품(화장지, 세제 등) 정산을 위한 공동 통장을 만들어 매달 일정 금액씩 넣는 방식도 분쟁을 줄이는 좋은 방법입니다.</p>
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