/* 홈 "검증된 기술력" 섹션 데이터.
   ip     : 지식재산권 목록. type은 'patent'(등록 특허) | 'pending'(출원 중) | 'trademark'(등록 상표) | 'copyright'(등록 저작권).
            앞 4건은 항상 보이고 나머지는 "더보기"로 펼칩니다. 큰 숫자와 부제(특허 n · 출원 n · 상표 n · 저작권 n)는 목록에서 자동 계산됩니다.
            등록 번호는 2026.08 취합한 특허증 · 상표등록증 · 저작권등록증과 회사소개서(2026.07) 지재권 발췌 기준입니다.
   grants : 2025 수주 과제 목록. tag는 시작 연도, ref는 기관 · 역할 · 기간.
   allies : 협력 기관. logo에 이미지 경로를 넣으면 로고로, 비우면 기관명 텍스트로 표시됩니다.
   ※ 협력 기관 로고는 비어 있으면 기관명 텍스트로 표시됩니다. */
window.HC_PROOF = {
  ip: [
    /* 순서: 출원 → 등록 특허 → 등록 상표 → 등록 저작권, 각 묶음 안은 최신순.
       10-2988646(2026.07 등록)은 회사소개서에만 특허증이 있고, 10-2958760(2026.04 등록)은 KIPRIS 조회로 확인했습니다. */
    { type: 'pending', tag: '출원', name: '광역 참조 이미지를 이용한 시계열 분석 재현성 확보 및 생체-생활습관 데이터 통합에 기반한 개인 맞춤형 웰니스 관리 시스템 및 이를 위한 동작 방법', ref: '10-2025-0144100' },
    { type: 'pending', tag: '출원', name: '인공지능 기반 피부 진단 시스템 및 이를 이용한 동작 방법', ref: '10-2024-0148919' },
    { type: 'patent', tag: '특허', name: '시니어케어 맞춤형 신체 및 인지훈련 비대면 제공 시스템', ref: '10-2988646' },
    { type: 'patent', tag: '특허', name: '주야간 보호시설용 관리 시스템', ref: '10-2958760' },
    { type: 'patent', tag: '특허', name: '시니어케어 맞춤형 프로그램 전문강사 매칭을 기반으로 하는 서비스 운영 시스템', ref: '10-2854344' },
    { type: 'patent', tag: '특허', name: '방문 목욕 매칭을 기반으로 하는 서비스 운영 시스템', ref: '10-2834779' },
    { type: 'patent', tag: '특허', name: '반려동물 방문 이미용 매칭 및 운영 서비스 시스템', ref: '10-2769583' },
    { type: 'patent', tag: '특허', name: '시니어케어 센터 장기요양수급자의 욕구사정 및 돌봄 서비스 운영 시스템', ref: '10-2657197' },
    { type: 'patent', tag: '특허', name: '장기요양 기관의 시니어 케어 맞춤형 동영상 콘텐츠를 기반으로 하는 프로그램 서비스운영 시스템', ref: '10-2369182' },
    { type: 'trademark', tag: '상표', name: 'Health Cloud 로고 · 제09류 (스마트폰용 애플리케이션 소프트웨어 등 13건)', ref: '40-1827373' },
    { type: 'trademark', tag: '상표', name: 'Health Cloud 로고 · 제38류 (인터넷 및 모바일인터넷상의 플랫폼 접속제공업 등 8건)', ref: '40-1827374' },
    { type: 'trademark', tag: '상표', name: 'Health Cloud 로고 · 제44류 (건강관리업 등 8건)', ref: '40-1827377' },
    { type: 'trademark', tag: '상표', name: '웰나우 WELLNOW 로고 · 제44류 (노인간호업 등 13건)', ref: '40-1883920' },
    { type: 'trademark', tag: '상표', name: '웰나우 WELLNOW 로고 · 제45류 (노인돌봄서비스업 등 4건)', ref: '40-1883921' },
    { type: 'copyright', tag: '저작권', name: '헬스클라우드 Bellus(벨루스) 피부/두피/피부톤 AI 진단 분석 및 앱 서비스', ref: 'C-2025-032370' },
    { type: 'copyright', tag: '저작권', name: '헬스클라우드 두피 및 모발 AI 분석 서비스', ref: 'C-2025-032246' },
    { type: 'copyright', tag: '저작권', name: '헬스클라우드 생성형 AI 이미지 기반 웹 프롬프트 솔루션', ref: 'C-2024-019757' },
    { type: 'copyright', tag: '저작권', name: '웰나우 장기요양기관 시니어케어 특화 동영상 컨텐츠 기반 신체/인지/여가 프로그램 운영 서비스 솔루션', ref: 'C-2021-031540' },
    { type: 'copyright', tag: '저작권', name: '웰나우 장기요양수급자 욕구사정 및 돌봄 서비스 솔루션', ref: 'C-2021-031539' },
    { type: 'copyright', tag: '저작권', name: '웰나우 스마트폰 카메라 기반 AI 두피 이미지 분석 앱 서비스 솔루션', ref: 'C-2021-031538' },
    { type: 'copyright', tag: '저작권', name: '웰나우 방문간호 지원 서비스 솔루션', ref: 'C-2021-031537' }
  ],
  grants: [
    /* 2025년 수주 과제만 표시합니다(2026년 과제 리스트의 2026 항목은 제외). tag는 시작 연도, ref는 발주 기관 · 역할 · 기간. */
    { type: 'grant', tag: '2025', name: 'AI 기반 환경 인지 및 안전 지원 기술을 탑재한 모듈형 수동식 보행 테이블 ‘모빌라이트 (MobiliLite)’ 개발', ref: '보건복지부 · 참여기관(AI/SW) · 2025~2028' },
    { type: 'grant', tag: '2025', name: 'H-PPG 혈류 측정 및 인공지능 기반 영상 분석을 융합한 당뇨병성 족부질환 홈케어 기기 및 시스템 실증', ref: '강원정보문화산업진흥원 · 참여기관(AI/SW) · 2025~2027' }
  ],
  allies: [
    /* 병원 → 기관 → 기업 순. 특구 · 인증 · 사업명은 넣지 않습니다. 원주의료기기테크노밸리는 2025년 원주의료기기산업진흥원으로 명칭이 바뀌었습니다.
       로고는 각 기관 공식 홈페이지 헤더 이미지(2026.10 기준). 강원창조경제혁신센터는 흰색 버전만 있어 글자를 네이비 단색으로 바꾼 파일입니다. */
    { name: '한양대학교 류마티스병원', logo: 'assets/img/allies/hyumc-rheumatism.png' },
    { name: '원주의료기기산업진흥원', logo: 'assets/img/allies/wmit.png' },
    { name: '강원창조경제혁신센터', logo: 'assets/img/allies/ccei-gangwon.png' },
    { name: '강원산학융합원', logo: 'assets/img/allies/gwgic.png' },
    /* 협력 기업 (업무협약 · 공동 사업). 로고가 비어 있으면 회사명 텍스트로 표시됩니다.
       지오디아는 홈페이지 푸터 로고, 미라클헬스케어와 페이스블룸은 흰색 헤더 로고의 글자를 네이비로 바꾼 파일입니다. */
    { name: '지오디아', logo: 'assets/img/allies/ziodia.png' },
    { name: '지니테크', logo: 'assets/img/allies/genie-tech.png' },
    { name: '미라클헬스케어', logo: 'assets/img/allies/miracle-healthcare.png' },
    { name: 'HMB', logo: 'assets/img/allies/hmb.png' },
    { name: '페이스블룸', logo: 'assets/img/allies/facebloom.png' }
  ]
};
