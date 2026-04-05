'use client'

import { useState } from 'react'
import Link from 'next/link'

type Rating = 'excellent' | 'good' | 'poor' | null
type ContractType = 'monthly' | 'jeonse'

interface CheckItem {
  id: string
  label: string
  why: string
  detail: string
  pts: { excellent: number; good: number; poor: number }
  redFlag?: boolean
  onlyFor?: ContractType // 없으면 월세·전세 공통
}

interface Category {
  id: string
  title: string
  emoji: string
  items: CheckItem[]
}

const CATEGORIES: Category[] = [
  {
    id: 'contract', title: '계약 조건', emoji: '📄',
    items: [
      // ── 월세·전세 공통 ──
      {
        id: 'owner_match',
        label: '계약자 = 집주인 신분증 일치',
        why: '신분증·계약서·등기부 3개가 모두 같은 사람이어야 해요',
        detail: `집주인 신분증과 계약서 이름이 일치하는지 직접 눈으로 확인하세요.\n\n• 대리인이 계약하면 공증된 위임장 + 집주인 신분증 사본 요구\n• 계약 당일 집주인과 직접 통화라도 해보는 것이 좋음\n• 법인 소유 부동산은 법인 등기사항증명서도 확인`,
        pts: { excellent: 4, good: 2, poor: 0 },
        redFlag: true
      },
      {
        id: 'management_fee',
        label: '관리비 항목 및 금액 명확',
        why: '관리비 분쟁은 자취 생활 1순위 갈등',
        detail: `"관리비 몇만원"만 듣지 말고, 포함 항목을 서면으로 확인하세요.\n\n• 청소비, 인터넷, TV, 주차, 냉난방, 엘리베이터 포함 여부 확인\n• 계절별 관리비 변동 — 전월 고지서 직접 요청\n• 계약서에 관리비 항목 명시 필수 (분쟁 예방)\n• 공용전기·수도 별도 청구하는 집주인 있으니 주의`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
      {
        id: 'deposit_return',
        label: '보증금 반환 조건 명확 (계약서 명시)',
        why: '퇴실 시 보증금 분쟁은 월세도 자주 발생해요',
        detail: `월세도 보증금(통상 1~2개월치)이 있어요. 반환 조건을 계약서에 명확히 적어두세요.\n\n• 수리비 공제 기준 명시 (어디까지 세입자 부담인지)\n• 입주 전 방 상태 사진 촬영 — 날짜 찍히게 보관\n• 도배·장판 교체 주기 및 부담 주체 계약서 명시\n• 퇴실 1개월 전 통보 조건도 확인`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
      {
        id: 'building_ledger',
        label: '건축물대장 확인 (불법건축물 여부)',
        why: '불법 건축물은 전입신고·대출·보험 모두 안 될 수 있어요',
        detail: `정부24(gov.kr)에서 무료로 발급 가능해요.\n\n• 건물 용도가 "주거용"인지 확인 (근린생활시설이면 대출 불가)\n• 반지하·창고 개조 등 무허가 주택인지 확인\n• 실제 면적이 건축물대장 면적과 일치하는지 비교`,
        pts: { excellent: 3, good: 1, poor: 0 },
        redFlag: true
      },

      // ── 월세 전용 ──
      {
        id: 'monthly_rent_negotiable',
        label: '월세 협상 가능 여부 확인',
        why: '장기 거주 의사가 있으면 월세 5~10% 협상이 되는 경우가 많아요',
        detail: `월세는 집주인 재량이 크기 때문에 협상 여지가 있어요.\n\n• "1년 더 살겠다"는 조건으로 협상 시도 가능\n• 선불로 몇 달치 낼 경우 할인 여부 확인\n• 관리비 항목 조정으로 실질 월세 낮추는 방법도 있음\n• 공실 기간이 길었던 방은 협상 여지가 더 큼`,
        pts: { excellent: 3, good: 2, poor: 0 },
        onlyFor: 'monthly'
      },
      {
        id: 'monthly_auto_raise',
        label: '월세 자동 인상 조항 없음',
        why: '매년 5% 인상 조항이 숨어있는 계약서가 있어요',
        detail: `계약서를 꼼꼼히 읽어야 해요.\n\n• 주택임대차보호법상 연 5% 초과 인상은 불법\n• "물가상승률 연동" 조항도 실질적으로 인상 조항임\n• 2년 계약 후 갱신 시 인상 조건 미리 협의\n• 묵시적 갱신 시 기존 조건 유지됨 (집주인이 먼저 갱신 거절 통보 안 하면)`,
        pts: { excellent: 3, good: 2, poor: 0 },
        onlyFor: 'monthly'
      },

      // ── 전세 전용 ──
      {
        id: 'registry',
        label: '등기부등본 직접 발급·확인',
        why: '중개사가 보여주는 것만 믿으면 안 돼요 — 직접 떼야 해요',
        detail: `대법원 인터넷등기소(iros.go.kr) 열람 700원.\n\n✅ 핵심 체크:\n• "말소사항 포함" 전부증명서로 발급\n• 갑구: 압류·가압류·가등기 있으면 계약 NO\n• 을구: 근저당권 총액 확인 — 보증금+근저당 > 집값이면 위험\n• "신탁" 표기 있으면 신탁원부 별도 발급 필수\n• 다가구·빌라는 토지 등기부등본도 따로 확인\n• 잔금 당일 한 번 더 확인 (그 사이 대출 가능)`,
        pts: { excellent: 5, good: 2, poor: 0 },
        redFlag: true,
        onlyFor: 'jeonse'
      },
      {
        id: 'tax_certificate',
        label: '집주인 국세·지방세 완납증명서 확인',
        why: '등기부등본이 깨끗해도 세금 체납이면 보증금 날릴 수 있어요',
        detail: `등기부등본에는 나타나지 않는 위험이에요.\n\n• 집주인 체납 세금은 경매 시 전세보증금보다 먼저 배당\n• 임대차계약서 지참 후 세무서에서 미납국세 열람 신청 가능\n• 주택임대차보호법 개정으로 집주인의 납세증명서 제시 의무화\n• 거절하면 계약 재고 필요`,
        pts: { excellent: 4, good: 2, poor: 0 },
        redFlag: true,
        onlyFor: 'jeonse'
      },
      {
        id: 'jeonse_ratio',
        label: '전세가율 80% 미만 확인',
        why: '전세가율 80% 넘으면 깡통전세 — 집값 하락 시 보증금 못 돌려받아요',
        detail: `전세가율 = 전세가격 ÷ 매매가격 × 100\n\n• 80% 초과 = 위험 신호\n• 네이버 부동산·호갱노노 앱으로 주변 매매가 확인\n• 빌라·다가구는 매매가 파악 어려워 특히 주의\n• HUG 안심전세포털(khug.or.kr)에서 적정 전세가 조회 가능`,
        pts: { excellent: 5, good: 2, poor: 0 },
        redFlag: true,
        onlyFor: 'jeonse'
      },
      {
        id: 'insurance',
        label: '전세보증보험 가입 가능 여부',
        why: '보증보험 가입 불가 = 보증금 돌려받을 수단이 없다는 뜻',
        detail: `HUG 또는 SGI서울보증 전세보증보험 사전 조회하세요.\n\n• HUG 안심전세포털(khug.or.kr)에서 계약 전 조회 가능\n• 가입 안 되는 집 = 계약 재고\n• 보험료 보증금의 약 0.1~0.2% (매우 저렴)\n• 가입 가능해도 입주 후 전입신고·확정일자 받아야 효력 발생`,
        pts: { excellent: 5, good: 2, poor: 0 },
        redFlag: true,
        onlyFor: 'jeonse'
      },
    ]
  },
  {
    id: 'condition', title: '구조 / 상태', emoji: '🏚️',
    items: [
      {
        id: 'mold',
        label: '곰팡이 없음',
        why: '곰팡이는 제거 거의 불가능, 건강에 직접 영향',
        detail: `계약 전 반드시 직접 육안 확인. 집주인 앞에서도 꼼꼼히 보세요.\n\n• 확인 포인트: 창문 틀 안쪽, 화장실 천장, 벽 모서리, 가구 뒤\n• 흰 곰팡이보다 검은 곰팡이가 훨씬 위험 (호흡기 질환 유발)\n• 손으로 벽을 눌러보면 습한 느낌 = 속에 곰팡이 있을 수 있음\n• 방향제·탈취제 냄새가 강하면 뭔가 숨기는 것일 수 있음\n• 발견 시 계약 거부 또는 입주 전 완전 제거 조건 계약서 명시`,
        pts: { excellent: 5, good: 2, poor: 0 },
        redFlag: true
      },
      {
        id: 'damp',
        label: '결로/습기 없음',
        why: '결로는 겨울마다 반복되고 곰팡이로 이어짐',
        detail: `더운 날씨에도 결로 흔적(물자국, 바닥 젖은 자국)은 남아있어요.\n\n• 외벽 쪽 벽면을 손으로 만져보세요 — 냉기 느껴지면 단열 불량\n• 창문 밑 벽면, 베란다 쪽 벽이 결로 취약 부위\n• 전 세입자가 왜 이사갔는지 물어보세요\n• 결로 심한 방은 매 겨울 제습기를 하루 종일 틀어야 하는 수준`,
        pts: { excellent: 4, good: 2, poor: 0 },
        redFlag: true
      },
      {
        id: 'crack',
        label: '벽/천장 균열 없음',
        why: '큰 균열은 건물 구조적 문제일 수 있음',
        detail: `가는 실금은 일반적이지만 넓은 균열은 다른 문제예요.\n\n• 손가락이 들어갈 정도의 균열 = 구조적 문제 가능성\n• 균열 따라 물자국 있으면 비 올 때 누수 발생한다는 뜻\n• 베란다 외벽, 옥상 바로 아래 층이 누수 취약 지점\n• 발견 시 수리 조건을 계약서에 명시하거나 계약 거부`,
        pts: { excellent: 3, good: 1, poor: 0 }
      },
      {
        id: 'floor',
        label: '바닥 상태 양호',
        why: '퇴실 시 장판·마루 수리비 분쟁 1순위',
        detail: `특히 원룸·오피스텔에서 퇴실 시 분쟁이 많은 항목이에요.\n\n• 장판 들뜸, 마루 갈라짐, 변색은 사진으로 반드시 기록\n• 입주 시 상태를 날짜 찍히게 사진 보관\n• 마루 삐걱거림 = 생활 소음 심함 (아래층 민원 가능)\n• 걸레받이(벽 아래 모서리)에 물자국 있으면 배관 누수 흔적`,
        pts: { excellent: 3, good: 1, poor: 0 }
      },
      {
        id: 'smell',
        label: '이상한 냄새 없음',
        why: '하수 냄새, 담배 냄새는 입주 후 제거 거의 불가능',
        detail: `입구에서부터 냄새를 맡아보고, 화장실·주방을 집중 확인하세요.\n\n• 하수 냄새: 배관 방수 문제. 여름엔 더 심해짐\n• 담배 냄새: 벽지에 완전히 배어 교체 전엔 제거 불가\n• 강한 방향제 냄새 = 뭔가 숨기고 있을 가능성\n• 겨울엔 창문 닫혀있어서 냄새가 더 진하게 남아있음`,
        pts: { excellent: 3, good: 1, poor: 0 },
        redFlag: true
      },
      {
        id: 'water',
        label: '수압 정상',
        why: '수압 약하면 샤워·설거지가 매일 고통',
        detail: `수도꼭지를 직접 최대로 틀어보세요.\n\n• 화장실 샤워기 + 주방 수도꼭지 동시에 틀어서 수압 확인\n• 고층(4층 이상)일수록 수압이 낮아질 수 있음\n• 온수 나오는 데 3분 이상 걸리면 가스비 낭비\n• 수압 약한 건 건물 문제라 세입자가 해결 불가`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
      {
        id: 'drain',
        label: '배수 잘 됨',
        why: '배수 불량은 역류·악취로 이어짐',
        detail: `화장실 세면대와 주방 싱크대에 물을 받아서 내려보세요.\n\n• 물이 고이거나 느리게 빠지면 배관 노후화 가능성\n• 주방 싱크대 아래 공간 열어서 물기·곰팡이 없는지 확인\n• 화장실 배수구 주변 물자국 있으면 이미 문제 있다는 신호`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
    ]
  },
  {
    id: 'light', title: '채광 / 환기', emoji: '☀️',
    items: [
      {
        id: 'sunlight',
        label: '햇빛이 잘 들어옴',
        why: '채광 부족은 우울감, 빨래 안 마름, 습기 문제로 이어짐',
        detail: `오전·오후 방문 시 채광이 크게 다르므로 가능하면 오전에 방문하세요.\n\n• 남향·동향이 좋음. 북향은 하루 종일 햇빛이 거의 안 들어옴\n• 맞은편 건물과의 거리 — 지도보다 실제로 더 좁은 경우 많음\n• 반지하·1층은 채광 매우 부족 → 습기·곰팡이 위험 높음`,
        pts: { excellent: 4, good: 2, poor: 0 }
      },
      {
        id: 'window_count',
        label: '창문 2개 이상 (맞통풍 가능)',
        why: '창문 1개면 환기가 안 돼 여름에 매우 덥고 냄새 쌓임',
        detail: `맞통풍 = 서로 마주보는 창문이 있어 공기가 관통하는 구조예요.\n\n• 창문이 한 방향에만 있으면 공기가 순환되지 않음\n• 화장실에 외부 창문 또는 환풍기 있는지 확인 (없으면 습기 심함)\n• 주방 가스레인지 위 환풍기 있는지도 체크`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
      {
        id: 'ventilation',
        label: '환기 잘 됨 (창문 열어봤을 때)',
        why: '직접 창문을 열고 공기 순환을 느껴봐야 함',
        detail: `방문 시 창문을 실제로 열어서 확인하세요.\n\n• 주변에 식당·공장·쓰레기장 있으면 환기 시 냄새 유입\n• 맞은편 건물 벽이 바로 붙어있어서 환기 안 되는 경우도 있음\n• 방충망(모기망) 상태도 확인 — 여름에 필수`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
    ]
  },
  {
    id: 'heating', title: '난방 / 냉방', emoji: '🌡️',
    items: [
      {
        id: 'heat_type',
        label: '난방 방식 확인 (도시가스 권장)',
        why: '전기 난방은 난방비가 2~3배 비쌀 수 있음',
        detail: `난방 방식은 매달 나가는 고정비용에 직접 영향을 미쳐요.\n\n• 도시가스 온수 난방: 일반적, 비용 적정\n• 전기 히터·전기 온돌: 난방비 폭탄 위험. 피하는 게 좋음\n• 중앙난방: 내 사용량과 무관하게 관리비 부과, 세대별 조절 불가\n• 보일러 연식 확인 — 10년 이상이면 고장 위험`,
        pts: { excellent: 4, good: 2, poor: 0 },
        redFlag: true
      },
      {
        id: 'heat_bill',
        label: '전월 공과금 고지서 확인',
        why: '실제 난방비는 집주인이 보여줘야 정확히 알 수 있음',
        detail: `최근 3개월치 공과금 고지서를 직접 보여달라고 요청하세요.\n\n• 겨울철(12~2월) 고지서가 가장 중요\n• 거절하면 의심할 필요 있음 — 그 자체가 나쁜 신호\n• 전기·가스·수도 각각 별도 확인, 관리비 포함 여부 재확인`,
        pts: { excellent: 4, good: 2, poor: 0 },
        redFlag: true
      },
      {
        id: 'ac',
        label: '에어컨 있음 (또는 설치 가능)',
        why: '한국 여름은 에어컨 없이 생활 거의 불가능',
        detail: `에어컨 유무와 설치 가능 여부를 반드시 확인하세요.\n\n• 에어컨 있으면 연식 확인 — 10년 이상이면 효율 매우 낮음\n• 없는 경우 실외기 설치 가능 공간이 있는지 확인\n• 일부 건물은 구조상 에어컨 설치 자체 불가인 경우 있음\n• 설치 허가 여부를 집주인에게 미리 확인하고 계약서 명시`,
        pts: { excellent: 4, good: 2, poor: 0 }
      },
      {
        id: 'insulation',
        label: '단열 상태 양호',
        why: '단열 불량 = 난방비 폭탄 + 결로',
        detail: `외벽에 직접 손을 대서 확인할 수 있어요.\n\n• 외벽에 손 댔을 때 차갑게 느껴지면 단열재 부족\n• 창문 틈새로 바람이 느껴지면 겨울에 난방비 크게 오름\n• 1층, 꼭대기층, 모서리 호실은 단열이 특히 취약함`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
    ]
  },
  {
    id: 'security', title: '보안', emoji: '🔒',
    items: [
      {
        id: 'door_lock',
        label: '현관 디지털 도어락',
        why: '열쇠는 복사가 쉬워 이전 세입자 접근 위험',
        detail: `자취생 안전의 기본이에요.\n\n• 열쇠만 있으면 이전 세입자가 복사 후 들어올 수 있음\n• 입주 시 비밀번호 반드시 변경\n• 없는 경우 집주인에게 설치 요청 또는 본인 부담 설치 가능한지 확인`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
      {
        id: 'window_lock',
        label: '창문/베란다 잠금 정상 작동',
        why: '1~3층은 창문 잠금 불량이 침입 경로',
        detail: `창문 잠금장치를 직접 열고 닫아보세요.\n\n• 모든 창문 잠금장치가 정상 작동하는지 하나하나 확인\n• 베란다 창문 잠금이 특히 취약한 경우 많음\n• 방범창 또는 창문 보조잠금장치 추가 설치 가능한지 확인`,
        pts: { excellent: 3, good: 2, poor: 0 },
        redFlag: true
      },
      {
        id: 'cctv',
        label: '건물 내 CCTV 있음',
        why: '공용공간 CCTV는 범죄 억제력이 높음',
        detail: `건물 입구, 엘리베이터, 주차장 CCTV를 확인하세요.\n\n• 작동 여부도 확인 (가짜 카메라 있는 건물도 있음)\n• 관리자에게 녹화 보관 기간 문의 (30일 이상 권장)\n• CCTV 없는 건물이라면 개인 도어캠 설치 고려`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
      {
        id: 'entrance',
        label: '공동현관 잠금 있음',
        why: '외부인 출입 통제가 기본 안전의 시작',
        detail: `공동현관 출입 방식을 직접 확인하세요.\n\n• 카드키·비밀번호·인터폰 개폐 방식이 가장 안전\n• 낮에는 잠겨있어도 밤엔 열려있는 경우 있으니 저녁에도 확인\n• 배달·택배 기사도 자유롭게 드나드는지 확인`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
      {
        id: 'floor_loc',
        label: '2층 이상 또는 방범창 있음',
        why: '1층·반지하는 외부 침입 위험이 크게 높아짐',
        detail: `1층·반지하의 경우 추가 보안 장치가 필수예요.\n\n• 1층이라면 방범창 설치 여부 확인\n• 반지하: 침수 위험 + 보안 취약 + 채광 부족 3중 문제\n• 2층 이상이어도 비상계단 창문으로 접근 가능한지 확인`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
    ]
  },
  {
    id: 'amenity', title: '편의시설', emoji: '🧺',
    items: [
      {
        id: 'washer',
        label: '세탁기 설치 가능 (공간+배수구)',
        why: '없으면 코인빨래방을 평생 이용해야 함',
        detail: `세탁기 설치 공간과 배수 환경을 반드시 확인하세요.\n\n• 세탁기 놓을 공간의 가로·세로 치수 측정 (표준: 60×60cm)\n• 배수구 위치가 세탁기 배수 호스 닿는 위치에 있는지 확인\n• 일부 건물은 세탁기 설치를 금지하거나 세탁실만 이용하도록 하는 경우 있음`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
      {
        id: 'elevator',
        label: '엘리베이터 있음 (3층 이상)',
        why: '3층 이상은 이사, 장보기, 일상에서 엘리베이터가 핵심',
        detail: `3층 이상이면 엘리베이터는 선택이 아닌 필수예요.\n\n• 이사 시 없으면 사다리차 또는 인력 추가 비용 발생\n• 장 볼 때, 아플 때, 짐 있을 때 계단은 매우 힘듦\n• 엘리베이터 내부 청결도는 건물 관리 수준을 보여줌`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
      {
        id: 'parcel',
        label: '무인택배함 있음',
        why: '직장인이라면 택배 수령이 매우 불편해질 수 있음',
        detail: `택배 수령 방식을 미리 파악해두세요.\n\n• 무인택배함 없으면 경비실 맡기거나 부재중 반송 반복\n• 편의점 픽업 서비스로 대체 가능한지 주변 편의점 위치 확인`,
        pts: { excellent: 2, good: 1, poor: 0 }
      },
      {
        id: 'trash',
        label: '쓰레기 분리수거 편리',
        why: '규칙 모르면 벌금, 불편하면 쓰레기가 방에 쌓임',
        detail: `입주 전 쓰레기 규칙을 집주인에게 물어보세요.\n\n• 수거 요일·시간·장소 확인 (요일 틀리면 경고 받음)\n• 음식물 쓰레기: 종량제 봉투 vs 공동 수거통\n• 관리인 없는 소형 건물은 쓰레기 관리가 엉망인 경우 많음`,
        pts: { excellent: 2, good: 1, poor: 0 }
      },
    ]
  },
  {
    id: 'location', title: '주변 환경', emoji: '📍',
    items: [
      {
        id: 'transit',
        label: '대중교통 도보 10분 이내',
        why: '지도 거리와 실제 도보 시간은 다를 수 있음',
        detail: `반드시 직접 걸어서 시간을 재보세요. 지도 앱은 거짓말을 해요.\n\n• 지도 앱 도보 시간에 신호등 대기·언덕·날씨는 포함 안 됨\n• 배차 간격도 중요 — 심야·주말 막차 시간 확인\n• 자전거·킥보드 이용 가능 여부 및 보관 장소도 확인`,
        pts: { excellent: 4, good: 2, poor: 0 }
      },
      {
        id: 'store',
        label: '편의점/마트 도보 5분 이내',
        why: '자취 생활에서 마트 접근성은 식비와 시간을 좌우함',
        detail: `자취는 생각보다 마트를 자주 가게 됩니다.\n\n• 편의점도 중요하지만 소형마트 거리도 체크\n• 배달음식 가능 지역인지 확인 (일부 외곽 지역 배달 불가 있음)\n• 세탁소, 병원, 약국 위치도 같이 확인해두면 좋음`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
      {
        id: 'noise',
        label: '소음 적음',
        why: '소음은 적응이 안 되고 이사 전엔 파악하기 가장 어려움',
        detail: `창문 열고 10분 이상 머물러보세요. 이게 가장 중요해요.\n\n• 주간 방문만 하면 야간 소음을 놓칠 수 있음 → 가능하면 밤에도 방문\n• 확인 포인트: 대로변 차량, 철도·지하철, 유흥가, 공사장, 어린이집\n• 위층 발소리 등 층간 소음은 입주 전 파악이 거의 불가능\n• 단열 약한 건물일수록 외부 소음과 층간 소음 모두 심함`,
        pts: { excellent: 4, good: 2, poor: 0 },
        redFlag: true
      },
      {
        id: 'safety',
        label: '야간 치안 양호',
        why: '밤에 직접 방문해보는 게 가장 확실한 방법',
        detail: `낮과 밤의 분위기는 완전히 다를 수 있어요.\n\n• 가능하면 밤 10시 이후 직접 방문해서 분위기 파악\n• 골목길 가로등 유무·밝기 확인\n• 주변에 유흥업소·모텔 밀집 지역인지 확인\n• 여성 1인 가구라면 특히 중요 — 관할 경찰서 범죄 통계도 참고 가능`,
        pts: { excellent: 3, good: 2, poor: 0 }
      },
    ]
  },
]

const MAX_ROOMS = 3
const ROOM_NAMES = ['방 A', '방 B', '방 C']

// contractType에 맞는 항목만 필터링
function getActiveItems(contractType: ContractType): CheckItem[] {
  return CATEGORIES.flatMap(cat =>
    cat.items.filter(it => !it.onlyFor || it.onlyFor === contractType)
  )
}

function getActiveCategories(contractType: ContractType): Category[] {
  return CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(it => !it.onlyFor || it.onlyFor === contractType)
  })).filter(cat => cat.items.length > 0)
}

function calcTotal(ratings: Record<string, Rating>, contractType: ContractType): number {
  return getActiveCategories(contractType).reduce((sum, cat) =>
    sum + cat.items.reduce((s, it) => {
      const r = ratings[it.id]
      return s + (r ? it.pts[r] : 0)
    }, 0), 0)
}

function getMaxScore(contractType: ContractType): number {
  return getActiveCategories(contractType).reduce((sum, cat) =>
    sum + cat.items.reduce((s, it) => s + it.pts.excellent, 0), 0)
}

function getRedFlags(ratings: Record<string, Rating>, contractType: ContractType): string[] {
  return getActiveCategories(contractType).flatMap(cat =>
    cat.items.filter(it => it.redFlag && ratings[it.id] === 'poor').map(it => it.label)
  )
}

function getGrade(score: number, max: number, filled: number) {
  if (filled === 0) return { label: '', color: '#9ca3af', bg: '#f9fafb', rec: '' }
  const pct = (score / max) * 100
  if (pct >= 78) return { label: '계약 추천', color: '#16a34a', bg: '#f0fdf4', rec: '전반적으로 우수한 방이에요. 계약을 긍정적으로 검토하세요.' }
  if (pct >= 55) return { label: '협상 후 계약', color: '#d97706', bg: '#fffbeb', rec: '부족한 항목을 집주인과 협의하거나, 수리 조건을 계약서에 명시하세요.' }
  return { label: '계약 비추천', color: '#dc2626', bg: '#fef2f2', rec: '문제 항목이 많습니다. 다른 방을 더 알아보는 걸 권장해요.' }
}

const ratingConfig = {
  excellent: { label: '양호', bg: '#f0fdf4', border: '#86efac', text: '#15803d', dot: '#22c55e' },
  good:      { label: '보통', bg: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#f59e0b' },
  poor:      { label: '불량', bg: '#fef2f2', border: '#fca5a5', text: '#b91c1c', dot: '#ef4444' },
}

function buildShareText(
  allRatings: Record<string, Rating>[],
  roomCount: number,
  contractType: ContractType
): string {
  const maxScore = getMaxScore(contractType)
  const lines: string[] = []
  const typeLabel = contractType === 'monthly' ? '월세' : '전세'
  lines.push(`🏠 방 구하기 체크리스트 결과 (${typeLabel})`)
  lines.push('━━━━━━━━━━━━━━━━━━')

  for (let i = 0; i < roomCount; i++) {
    const r = allRatings[i]
    const filled = Object.values(r).filter(Boolean).length
    if (filled === 0) continue

    const s = calcTotal(r, contractType)
    const pct = Math.round((s / maxScore) * 100)
    const g = getGrade(s, maxScore, filled)
    const rf = getRedFlags(r, contractType)

    lines.push('')
    lines.push(`📍 ${ROOM_NAMES[i]}  ${pct}점 — ${g.label}`)

    getActiveCategories(contractType).forEach(cat => {
      const catFilled = cat.items.filter(it => r[it.id]).length
      if (catFilled === 0) return
      const catScore = cat.items.reduce((sum, it) => {
        const rating = r[it.id]
        return sum + (rating ? it.pts[rating] : 0)
      }, 0)
      const catMax = cat.items.reduce((sum, it) => sum + it.pts.excellent, 0)
      const bar = catScore >= catMax * 0.8 ? '●●●' : catScore >= catMax * 0.5 ? '●●○' : '●○○'
      lines.push(`  ${cat.emoji} ${cat.title.padEnd(8)}  ${bar}  ${catScore}/${catMax}점`)
    })

    const poorItems = getActiveCategories(contractType).flatMap(cat =>
      cat.items.filter(it => r[it.id] === 'poor').map(it => it.label)
    )
    if (poorItems.length > 0) {
      lines.push('')
      lines.push('  ⚠️ 불량 항목')
      poorItems.forEach(label => lines.push(`  • ${label}`))
    }
    if (rf.length > 0) {
      lines.push('')
      lines.push(`  🚨 레드플래그 ${rf.length}개 — 계약 전 재확인 필수`)
    }
  }

  const filledRooms = Array.from({ length: roomCount }, (_, i) => ({
    name: ROOM_NAMES[i],
    pct: Math.round((calcTotal(allRatings[i], contractType) / maxScore) * 100),
    filled: Object.values(allRatings[i]).filter(Boolean).length,
  })).filter(r => r.filled > 0)

  if (filledRooms.length >= 2) {
    lines.push('')
    lines.push('━━━━━━━━━━━━━━━━━━')
    lines.push('📊 종합 비교')
    const sorted = [...filledRooms].sort((a, b) => b.pct - a.pct)
    sorted.forEach((r, idx) => {
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'
      lines.push(`  ${medal} ${r.name}  ${r.pct}점`)
    })
    lines.push(`  → 추천: ${sorted[0].name}`)
  }

  lines.push('')
  lines.push('━━━━━━━━━━━━━━━━━━')
  lines.push('자취박사로 방 비교하기')
  lines.push('https://smart-jachi-manager.vercel.app')

  return lines.join('\n')
}

export default function RoomChecklistPage() {
  const [contractType, setContractType] = useState<ContractType>('monthly')
  const [activeRoom, setActiveRoom] = useState(0)
  const [roomCount, setRoomCount] = useState(1)
  const [allRatings, setAllRatings] = useState<Record<string, Rating>[]>([{}, {}, {}])
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [showCompare, setShowCompare] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

  const activeCategories = getActiveCategories(contractType)
  const ratings = allRatings[activeRoom]
  const maxScore = getMaxScore(contractType)
  const totalItems = activeCategories.reduce((s, c) => s + c.items.length, 0)

  const setRating = (itemId: string, val: Rating) => {
    setAllRatings(prev => {
      const next = [...prev]
      const current = next[activeRoom][itemId]
      next[activeRoom] = { ...next[activeRoom], [itemId]: current === val ? null : val }
      return next
    })
  }

  // contractType 바뀌면 ratings 초기화
  const handleContractTypeChange = (type: ContractType) => {
    setContractType(type)
    setAllRatings([{}, {}, {}])
    setExpandedItem(null)
  }

  const redFlags = getRedFlags(ratings, contractType)
  const score = calcTotal(ratings, contractType)
  const filled = Object.values(ratings).filter(Boolean).length
  const pct = Math.round((score / maxScore) * 100)
  const grade = getGrade(score, maxScore, filled)
  const filledCount = (r: Record<string, Rating>) => Object.values(r).filter(Boolean).length

  const handleShare = async () => {
    const text = buildShareText(allRatings, roomCount, contractType)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: '🏠 방 구하기 체크리스트 결과', text })
        return
      } catch { /* 취소 시 fallback */ }
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2500)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2500)
    }
  }

  const hasAnyData = allRatings.slice(0, roomCount).some(r => Object.values(r).filter(Boolean).length > 0)

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F7', fontFamily: "'Noto Sans KR', sans-serif" }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '1.5rem 1rem 5rem' }}>

        <Link href="/" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', display: 'inline-block', marginBottom: 12 }}>← 홈으로</Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: 0 }}>🏠 방 구하기 체크리스트</h1>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>현장에서 직접 확인하고 점수를 매겨보세요 ({totalItems}개 항목)</p>
          </div>
          {roomCount < MAX_ROOMS && (
            <button onClick={() => setRoomCount(c => c + 1)} style={{
              fontSize: 12, padding: '6px 12px', borderRadius: 8,
              border: '1px solid #d1d5db', background: 'white', color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap'
            }}>+ 방 추가</button>
          )}
        </div>

        {/* 월세 / 전세 선택 */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10, fontWeight: 500 }}>계약 유형 선택 — 항목이 달라져요</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {([
              { type: 'monthly' as ContractType, label: '🏠 월세', desc: '보증금 적고 매달 월세 납부' },
              { type: 'jeonse' as ContractType, label: '🔑 전세', desc: '큰 보증금 맡기고 월세 없음' },
            ]).map(({ type, label, desc }) => (
              <button
                key={type}
                onClick={() => handleContractTypeChange(type)}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                  border: `2px solid ${contractType === type ? '#FFB800' : '#e5e7eb'}`,
                  background: contractType === type ? '#FFF8E1' : '#f9fafb',
                  textAlign: 'left', transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: contractType === type ? '#92400e' : '#374151', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color: contractType === type ? '#b45309' : '#9ca3af' }}>{desc}</div>
              </button>
            ))}
          </div>
          {contractType === 'jeonse' && (
            <div style={{ marginTop: 10, fontSize: 11, color: '#dc2626', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '6px 10px' }}>
              ⚠️ 전세는 보증금 규모가 크기 때문에 체크리스트 외에 법무사·공인중개사 검토를 강력 권장해요
            </div>
          )}
        </div>

        {/* 방 탭 */}
        {roomCount > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
            {Array.from({ length: roomCount }).map((_, i) => {
              const f = filledCount(allRatings[i])
              const p = Math.round((calcTotal(allRatings[i], contractType) / maxScore) * 100)
              return (
                <button key={i} onClick={() => setActiveRoom(i)} style={{
                  padding: '7px 18px', borderRadius: 10,
                  border: `1.5px solid ${activeRoom === i ? '#FFB800' : '#e5e7eb'}`,
                  background: activeRoom === i ? '#FFF8E1' : 'white',
                  color: activeRoom === i ? '#92400e' : '#6b7280',
                  fontWeight: activeRoom === i ? 700 : 400, fontSize: 13, cursor: 'pointer'
                }}>
                  {ROOM_NAMES[i]}
                  {f > 0 && <span style={{ marginLeft: 6, fontSize: 11 }}>{p}점</span>}
                </button>
              )
            })}
            <button onClick={() => setShowCompare(!showCompare)} style={{
              marginLeft: 'auto', padding: '7px 14px', borderRadius: 10,
              border: `1.5px solid ${showCompare ? '#00C896' : '#e5e7eb'}`,
              background: showCompare ? '#ecfdf5' : 'white',
              color: showCompare ? '#065f46' : '#6b7280',
              fontSize: 12, cursor: 'pointer'
            }}>비교 보기</button>
          </div>
        )}

        {/* 비교 뷰 */}
        {showCompare && roomCount > 1 && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>방 비교</span>
              {hasAnyData && (
                <button onClick={handleShare} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 12, padding: '5px 14px', borderRadius: 8,
                  border: '1.5px solid',
                  borderColor: copyState === 'copied' ? '#86efac' : '#FEE08B',
                  background: copyState === 'copied' ? '#f0fdf4' : '#FFF8E1',
                  color: copyState === 'copied' ? '#15803d' : '#92400e',
                  cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
                }}>
                  {copyState === 'copied' ? '✓ 복사됨!' : '카카오톡 공유'}
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${roomCount}, 1fr)`, gap: 10 }}>
              {Array.from({ length: roomCount }).map((_, i) => {
                const s = calcTotal(allRatings[i], contractType)
                const f = filledCount(allRatings[i])
                const p = Math.round((s / maxScore) * 100)
                const g = getGrade(s, maxScore, f)
                const rf = getRedFlags(allRatings[i], contractType)
                const allScores = Array.from({ length: roomCount }, (_, j) => calcTotal(allRatings[j], contractType))
                const isBest = f > 0 && s === Math.max(...allScores) && allScores.filter(sc => sc === s).length === 1
                return (
                  <div key={i} style={{
                    background: isBest ? '#FFFBEB' : '#f9fafb',
                    borderRadius: 12, padding: '0.75rem',
                    border: `1.5px solid ${isBest ? '#FFB800' : f > 0 ? g.color + '55' : '#e5e7eb'}`,
                    position: 'relative'
                  }}>
                    {isBest && (
                      <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: 11, background: '#FFB800', color: '#92400e', fontWeight: 700, padding: '1px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                        🥇 추천
                      </div>
                    )}
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{ROOM_NAMES[i]}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: g.color }}>{f > 0 ? p : '—'}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 6 }}>점</div>
                    {f > 0 && <div style={{ fontSize: 11, fontWeight: 700, color: g.color, background: g.bg, padding: '2px 8px', borderRadius: 6, display: 'inline-block' }}>{g.label}</div>}
                    {rf.length > 0 && <div style={{ fontSize: 10, color: '#dc2626', marginTop: 6 }}>🚨 레드플래그 {rf.length}개</div>}
                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>{f}/{totalItems} 항목</div>
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {activeCategories.map(cat => {
                        const catScore = cat.items.reduce((sum, it) => {
                          const r = allRatings[i][it.id]
                          return sum + (r ? it.pts[r] : 0)
                        }, 0)
                        const catMax = cat.items.reduce((sum, it) => sum + it.pts.excellent, 0)
                        const catPct = Math.round((catScore / catMax) * 100)
                        const barColor = catPct >= 80 ? '#22c55e' : catPct >= 50 ? '#f59e0b' : catPct === 0 ? '#e5e7eb' : '#ef4444'
                        return (
                          <div key={cat.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9ca3af', marginBottom: 2 }}>
                              <span>{cat.emoji} {cat.title}</span>
                              <span>{catScore}/{catMax}</span>
                            </div>
                            <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${catPct}%`, background: barColor, borderRadius: 2, transition: 'width 0.3s' }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 레드플래그 배너 */}
        {redFlags.length > 0 && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>🚨 레드플래그 {redFlags.length}개 — 계약 전 반드시 재확인</div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {redFlags.map((f, i) => <li key={i} style={{ fontSize: 12, color: '#b91c1c', marginBottom: 2 }}>{f}</li>)}
            </ul>
          </div>
        )}

        {/* 점수 요약 */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', minWidth: 64 }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: filled > 0 ? grade.color : '#e5e7eb', lineHeight: 1 }}>{filled > 0 ? pct : '—'}</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>/ 100점</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: grade.color, marginBottom: 8 }}>
              {grade.label || '항목을 선택해주세요'}
            </div>
            <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${filled > 0 ? pct : 0}%`, background: grade.color, borderRadius: 3, transition: 'width 0.35s ease' }} />
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{filled} / {totalItems}개 완료</div>
          </div>
        </div>

        {/* 카테고리별 체크리스트 */}
        {activeCategories.map(cat => {
          const catFilled = cat.items.filter(it => ratings[it.id]).length
          return (
            <div key={cat.id} style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{cat.emoji} {cat.title}</span>
                <span style={{
                  fontSize: 12,
                  color: catFilled === cat.items.length ? '#16a34a' : '#9ca3af',
                  fontWeight: catFilled === cat.items.length ? 700 : 400
                }}>
                  {catFilled === cat.items.length ? '✓ 완료' : `${catFilled} / ${cat.items.length}`}
                </span>
              </div>

              {cat.items.map((item, idx) => {
                const selected = ratings[item.id]
                const cfg = selected ? ratingConfig[selected] : null
                const isExpanded = expandedItem === item.id
                const isLast = idx === cat.items.length - 1

                return (
                  <div key={item.id} style={{
                    marginBottom: isLast ? 0 : 14,
                    paddingBottom: isLast ? 0 : 14,
                    borderBottom: isLast ? 'none' : '1px solid #f3f4f6'
                  }}>
                    {/* 상단: 선택 배지 + 이름 + 확인방법 버튼 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                          {/* 선택 상태 배지 */}
                          {cfg ? (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              fontSize: 11, fontWeight: 700,
                              background: cfg.bg, border: `1px solid ${cfg.border}`,
                              color: cfg.text, padding: '2px 8px', borderRadius: 20, flexShrink: 0
                            }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                              {cfg.label}
                            </span>
                          ) : (
                            <span style={{ fontSize: 11, color: '#d1d5db', border: '1px dashed #e5e7eb', padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
                              미선택
                            </span>
                          )}
                          <span style={{ fontSize: 13, color: '#1f2937', fontWeight: 500 }}>{item.label}</span>
                          {item.redFlag && (
                            <span style={{ fontSize: 10, background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', padding: '1px 6px', borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>주의</span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: '#9ca3af', paddingLeft: 2 }}>{item.why}</div>
                      </div>
                      <button
                        onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                        style={{
                          fontSize: 11, padding: '3px 10px', borderRadius: 6,
                          border: `1px solid ${isExpanded ? '#FFB800' : '#e5e7eb'}`,
                          background: isExpanded ? '#FFF8E1' : '#f9fafb',
                          color: isExpanded ? '#92400e' : '#9ca3af',
                          cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2
                        }}
                      >{isExpanded ? '닫기' : '확인방법'}</button>
                    </div>

                    {/* 상세 설명 (펼침) */}
                    {isExpanded && (
                      <div style={{
                        fontSize: 12, color: '#374151', lineHeight: 1.85,
                        background: '#fffbeb', border: '1px solid #fde68a',
                        borderRadius: 10, padding: '10px 14px', marginBottom: 8,
                        whiteSpace: 'pre-line'
                      }}>
                        {item.detail}
                      </div>
                    )}

                    {/* 선택 버튼 — 선택 시 확실한 시각적 피드백 */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      {(['excellent', 'good', 'poor'] as NonNullable<Rating>[]).map(val => {
                        const isSelected = ratings[item.id] === val
                        const c = ratingConfig[val]
                        return (
                          <button
                            key={val}
                            onClick={() => setRating(item.id, val)}
                            style={{
                              padding: '7px 18px', fontSize: 12, borderRadius: 8,
                              border: `1.5px solid ${isSelected ? c.border : '#e5e7eb'}`,
                              background: isSelected ? c.bg : 'white',
                              color: isSelected ? c.text : '#9ca3af',
                              fontWeight: isSelected ? 700 : 400,
                              cursor: 'pointer', transition: 'all 0.12s',
                              display: 'flex', alignItems: 'center', gap: 5
                            }}
                          >
                            {isSelected && (
                              <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.dot, display: 'inline-block', flexShrink: 0 }} />
                            )}
                            {c.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}

        {/* 최종 분석 */}
        {filled >= 15 && (
          <div style={{ background: grade.bg, border: `1.5px solid ${grade.color}55`, borderRadius: 16, padding: '1rem 1.25rem', marginTop: '0.5rem' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: grade.color, marginBottom: 8 }}>{grade.label}</div>
            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: '0 0 0' }}>{grade.rec}</p>
            {redFlags.length > 0 && (
              <div style={{ fontSize: 12, color: '#dc2626', marginTop: 10 }}>
                <strong>⚠ 재확인 필요:</strong> {redFlags.join(' · ')}
              </div>
            )}
          </div>
        )}

      </div>

      {/* SEO 콘텐츠 섹션 */}
      <RoomChecklistSeoSection />

      {/* 플로팅 공유 버튼 — 항목 입력하면 나타남 */}
      {hasAnyData && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, display: 'flex', gap: 10
        }}>
          <button
            onClick={handleShare}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 50,
              background: copyState === 'copied' ? '#16a34a' : '#FFE033',
              color: copyState === 'copied' ? 'white' : '#1a1a1a',
              fontSize: 14, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {copyState === 'copied' ? (
              <>✓ 복사 완료! 카카오톡에 붙여넣기</>
            ) : (
              <>
                <span style={{ fontSize: 16 }}>💬</span>
                카카오톡으로 공유하기
              </>
            )}
          </button>
        </div>
      )}

    </div>
  )
}

// ─── SEO 섹션 ────────────────────────────────────────────────

function RoomChecklistSeoSection() {
  return (
    <section style={{ background: '#F0F0F2', padding: '3rem 0 2rem' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: '0 0 6px', letterSpacing: '-0.5px' }}>🏠 자취방 구할 때 절대 놓치면 안 되는 것들</h2>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>처음 자취하는 분들이 가장 많이 후회하는 항목들을 정리했어요</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TipCard emoji="🔍" title="방 보러 가기 전 준비해야 할 것들" color="#2563eb" bg="#eff6ff" border="#bfdbfe">
            <p>방 보러 가기 전에 네이버 부동산, 직방, 다방 등에서 해당 지역 시세를 먼저 파악하세요. 비슷한 조건의 방이 얼마인지 알아야 가격 협상이 가능합니다. 구글 지도 로드뷰로 건물 외관과 골목 분위기를 미리 확인하면 불필요한 방문을 줄일 수 있어요.</p>
            <p>방문 시간은 낮과 밤 두 번 가는 것이 이상적입니다. 낮에는 채광과 주변 상권을 확인하고, 밤에는 치안과 소음을 파악할 수 있어요. 최소한 오전 방문을 추천합니다. 오전에는 채광이 가장 잘 보이고, 빈방의 경우 환경이 있는 그대로 드러납니다.</p>
            <p>자취박사의 방 구하기 체크리스트를 모바일로 열어두고 하나씩 확인하세요. 줄자는 침대, 책상, 세탁기 등 주요 가구가 들어갈 수 있는지 확인하는 데 필요합니다. 현장에서 집주인 앞에서 꼼꼼히 확인하기 어려울 수 있으니 미리 체크 포인트를 숙지해두는 게 좋아요.</p>
          </TipCard>
          <TipCard emoji="⚠️" title="전세사기 예방 — 등기부등본 너머의 위험들" color="#dc2626" bg="#fef2f2" border="#fca5a5">
            <p>많은 분들이 등기부등본만 확인하면 안전하다고 생각하지만, 실제로는 그렇지 않습니다. 등기부등본에 나타나지 않는 위험 요소들이 있어요. 집주인의 세금 체납은 국세나 지방세 체납이 등기에 기록되지 않지만, 집이 경매에 넘어갈 경우 전세보증금보다 먼저 배당됩니다.</p>
            <p>신탁 등기도 주의해야 합니다. 등기부등본 갑구에 '신탁'이라는 단어가 있으면 신탁원부를 별도로 발급받아야 합니다. 신탁된 부동산은 집주인이 임대 권한이 없는 경우도 있어 계약 자체가 무효가 될 수 있어요.</p>
            <p>전입신고 타이밍도 중요합니다. 전입신고는 당일 자정이 지나야 효력이 생기는데, 그 사이 집주인이 근저당을 설정하면 후순위로 밀릴 수 있습니다. 잔금 지급과 전입신고는 같은 날 처리하고, 확정일자도 즉시 받으세요.</p>
          </TipCard>
          <TipCard emoji="💰" title="월세 협상, 이렇게 하면 성공률이 올라간다" color="#059669" bg="#ecfdf5" border="#a7f3d0">
            <p>월세 협상은 많은 사람들이 시도조차 안 하지만, 실제로 협상이 되는 경우가 상당히 많습니다. 특히 공실 기간이 길었던 방, 이사 비성수기(3~5월, 9~11월), 관리 상태가 좋지 않은 방은 집주인이 조건을 낮춰줄 가능성이 높습니다.</p>
            <p>협상의 핵심은 명분 제공입니다. "그냥 낮춰달라"보다 "2년 장기 계약을 원한다", "주변 시세보다 높다"처럼 근거를 제시하면 훨씬 효과적입니다. 협상이 어렵다면 월세 대신 도배·장판 교체, 에어컨 설치 등 현물로 협상하는 방법도 있어요.</p>
            <p>보증금을 높이고 월세를 낮추는 방법도 있습니다. 보증금 100만원을 높이면 월세를 5,000원~1만원 낮출 수 있는 경우가 많아요. 계약 직전에 "이 조건이면 바로 계약하겠습니다"라고 말하면 집주인이 결정하기 쉬워집니다.</p>
          </TipCard>
          <TipCard emoji="📋" title="계약서 서명 전 반드시 확인할 10가지" color="#7c3aed" bg="#f5f3ff" border="#c4b5fd">
            <p>계약서 서명 전에는 반드시 다음을 확인하세요. 첫째, 계약서상 임대인과 등기부등본 소유자가 일치하는지. 둘째, 보증금과 월세 금액이 구두로 합의한 것과 동일한지. 셋째, 계약 기간이 명확히 기재됐는지. 넷째, 관리비 항목이 구체적으로 명시됐는지. 다섯째, 수리 책임 범위가 명확한지.</p>
            <p>여섯째, 퇴실 사전 통보 기간이 적혀 있는지. 일곱째, 반려동물·흡연·인테리어 변경 등 특약 사항. 여덟째, 도배·장판 교체 조건. 아홉째, 잔금 지급 방법과 날짜. 열째, 특약 사항이 별지에 기재됐다면 도장이 찍혀 있는지 확인하세요.</p>
            <p>계약서는 반드시 두 부를 작성해 각각 보관해야 합니다. 계약 당일 확정일자를 받는 것도 잊지 마세요. 주민센터 방문 또는 온라인(주택임대차 정보시스템)으로 600원에 확정일자를 받으면 선순위 권리를 확보할 수 있습니다.</p>
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