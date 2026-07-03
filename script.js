/* ═══════════════════════════════════════════════════════════
   자율이와 미경이의 제주 3박 4일 — script.js
   구조
   1) 데이터 (일정 / 관광지 / 맛집 / 카페 / 가이드 / 예산 / 준비물)
   2) 유틸 (저장소, 지도링크, D-day)
   3) 렌더 (홈 / 일정 / 장소 / 가이드)
   4) 인터랙션 (탭 라우터, 아코디언, 바텀시트, 지도, FAB)
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   1. 데이터
────────────────────────────────────────────── */

/* 일정 (엑셀 ①시트 기반 + 이동/팁 보강) */
const DAYS = [
  {
    id:'d1', date:'7/17', dow:'금', color:'#4E9CAB',
    title:'제주 도착, 함덕의 밤',
    summary:'밤 도착 → 렌터카 → 함덕 체크인. 내일 새벽 등산을 위해 일찍 쉬어요.',
    items:[
      { time:'21:00', title:'제주공항 도착 · 렌터카 수령', sub:'수속 후 렌터카 하우스 이동', type:'move',
        move:'공항 → 함덕 약 30분 (번영로 or 해안도로)',
        point:'렌터카 수령 시 차량 흠집 영상으로 촬영해 두기',
        tip:'도착이 늦으니 저녁은 기내식/공항 간단식으로 해결하는 게 편해요.' },
      { time:'22:00', title:'뭉클펜션 체크인 & 휴식', sub:'등산 대비 일찍 취침', type:'rest',
        move:'숙소 주변 편의점에서 내일 아침·행동식 미리 구매',
        point:'등산 준비물(스틱·물·간식)을 자기 전에 현관에 세팅',
        tip:'알람은 05:00! 관음사 코스는 이른 출발이 생명이에요.', link:'mungkeul' },
    ]
  },
  {
    id:'d2', date:'7/18', dow:'토', color:'#35815F',
    title:'한라산 관음사 원점회귀',
    summary:'이번 여행의 하이라이트. 새벽에 오르고, 오후는 함덕에서 회복해요.',
    items:[
      { time:'06:00', title:'관음사 탐방로로 출발', sub:'간식·물 챙기기', type:'move',
        move:'함덕 → 관음사지구 약 35분',
        point:'탐방 예약 QR과 신분증 확인 필수',
        tip:'주차장이 이른 시간부터 차니 05:30 출발도 좋아요.' },
      { time:'07:00', title:'한라산 등반 (07:00–13:00)', sub:'관음사 코스 왕복 약 17.4km', type:'spot',
        move:'탐라계곡 → 삼각봉대피소 → 백록담',
        point:'삼각봉 대피소 통과 제한 시간이 있으니 페이스 유지',
        tip:'하산 후 무릎 보호를 위해 스틱을 꼭 사용하세요.', link:'hallasan-guide' },
      { time:'13:30', title:'함덕에서 늦은 점심', sub:'흑본오겹 · 함덕고갈치 · 고집돌우럭 중 선택', type:'food',
        move:'관음사 → 함덕 약 35분',
        point:'등산 후엔 단백질! 흑돼지 구이가 최고의 보상',
        tip:'토요일 점심이라 웨이팅 가능 — 이동 중 원격 줄서기 앱 확인.', link:'food' },
      { time:'15:00', title:'숙소 낮잠 & 회복', sub:'무리하지 않기', type:'rest',
        move:'-', point:'다리 마사지, 스트레칭으로 내일 스쿠터 준비',
        tip:'오후 해변 산책은 해가 누그러지는 17시 이후가 좋아요.' },
      { time:'18:30', title:'저녁 & 함덕 해변 산책', sub:'에메랄드 바다의 밤', type:'spot',
        move:'숙소에서 도보', point:'서우봉 방면 산책로 야경',
        tip:'조명이 켜진 함덕 해변은 낮과 완전히 다른 분위기예요.', link:'hamdeok' },
    ]
  },
  {
    id:'d3', date:'7/19', dow:'일', color:'#0FA7A0',
    title:'동부 해안 스쿠터 라이딩',
    summary:'함덕 → 김녕 → 월정리 → 세화 → 비자림 → 함덕. 그리고 서우봉 일몰.',
    items:[
      { time:'09:00', title:'스쿠터 대여', sub:'125cc 이상 추천', type:'move',
        move:'함덕 시내 대여점 (면허증 지참)',
        point:'헬멧 위생 커버, 휴대폰 거치대 유무 확인',
        tip:'2인 1대보다 1인 1대가 라이딩도 사진도 훨씬 좋아요.', link:'scooter-guide' },
      { time:'09:30', title:'해안도로 라이딩 (–15:30)', sub:'김녕 → 월정리 → 세화 → 비자림', type:'spot',
        move:'총 약 41km · 카페 2곳 포함 여유 코스',
        point:'월정리는 오전에, 비자림은 한낮 더위 피난처로',
        tip:'선크림은 2시간마다, 물은 정류 지점마다 보충하세요.', link:'scooter-guide' },
      { time:'16:00', title:'스쿠터 반납 & 숙소 휴식', sub:'샤워하고 재정비', type:'rest',
        move:'-', point:'반납 전 주유 조건 확인(대여점마다 다름)',
        tip:'일몰까지 2시간, 시원한 카페에서 쉬어가도 좋아요.' },
      { time:'18:30', title:'서우봉 일몰 감상', sub:'이번 여행 최고의 포토스팟', type:'spot',
        move:'함덕 해변에서 도보 15분',
        point:'일몰 30분 전 도착해 서쪽 능선 자리 잡기',
        tip:'7월 중순 제주 일몰은 19:50 전후 — 폰 배터리 확인!', link:'seowoobong' },
      { time:'19:30', title:'함덕에서 저녁', sub:'마지막 함덕의 밤', type:'food',
        move:'-', point:'노을 여운이 남은 해변 앞 저녁',
        tip:'내일은 체크아웃 — 짐을 미리 반쯤 싸두면 아침이 편해요.', link:'food' },
    ]
  },
  {
    id:'d4', date:'7/20', dow:'월', color:'#FF7A45',
    title:'남쪽 바다 한 바퀴, 그리고 안녕',
    summary:'태웃개·올레5코스 → 공천포 물회 → 도두봉 → 이호테우 → 동문시장 → 공항.',
    items:[
      { time:'08:30', title:'체크아웃 → 태웃개 · 올레 5코스', sub:'남원으로 이동', type:'spot',
        move:'함덕 → 하례·남원 약 50분 (번영로)',
        point:'태웃개 용천수에 발 담그기, 올레길 바다 구간 산책',
        tip:'월요일 오전이라 한적 — 스노클링 장비 있으면 금상첨화.', link:'taewootgae' },
      { time:'11:30', title:'공천포식당 점심', sub:'한치·전복 물회', type:'food',
        move:'태웃개 → 공천포 약 5분',
        point:'여름 제주 물회의 정석, 브레이크타임(15:30) 전 방문',
        tip:'제주식 된장 육수 물회 — 새콤한 초장파라면 미리 요청!', link:'food' },
      { time:'14:30', title:'도두봉', sub:'키세스존 포토스팟', type:'spot',
        move:'공천포 → 제주시 약 50분',
        point:'정상까지 15분, 비행기 이착륙 뷰',
        tip:'공항이 가까워 비행기가 머리 위로 지나가요 — 영상 필수!', link:'dodubong' },
      { time:'15:30', title:'이호테우해변 & 카페', sub:'목마등대', type:'spot',
        move:'도두봉 → 이호테우 약 10분',
        point:'빨강·하양 조랑말 등대 앞 인생샷',
        tip:'해질녘이 아니어도 등대 배경 사진은 오후 역광이 예뻐요.', link:'iho' },
      { time:'17:30', title:'제주시에서 이른 저녁', sub:'고기국수 or 해장국', type:'food',
        move:'이호테우 → 시내 약 15분',
        point:'자매국수·우진해장국 등 제주시 노포',
        tip:'비행 전 든든하게 — 웨이팅 감안해 조금 서두르세요.', link:'food' },
      { time:'18:20', title:'동문시장 기념품 쇼핑', sub:'오메기떡 · 감귤초콜릿', type:'spot',
        move:'시내 도보/주차장 이용',
        point:'8번 게이트 야시장 구경은 짧게!',
        tip:'오메기떡은 아이스팩 포장 요청 — 기내 반입 OK.', link:'dongmun' },
      { time:'19:40', title:'렌터카 반납 → 20:40 출발', sub:'셔틀로 공항 이동', type:'move',
        move:'동문시장 → 렌터카 하우스 약 15분',
        point:'주유소에서 가득 채운 뒤 반납(조건 확인)',
        tip:'셔틀 대기 포함 60분 여유가 안전해요. 안녕, 제주!' },
    ]
  },
];

/* 관광지 (12곳) — grad: 카드 배경, 사진을 넣고 싶다면 photo:'이미지URL' 추가 */
const SPOTS = [
  { id:'hamdeok', name:'함덕해수욕장', emoji:'🏖️', region:'함덕', days:['d1','d2','d3'],
    lat:33.5434, lng:126.6694, grad:'linear-gradient(150deg,#43C6BE,#0B6E69)',
    desc:'제주에서 가장 맑은 에메랄드빛으로 꼽히는 해변. 수심이 얕고 잔잔해 물놀이와 산책 모두 좋아요. 이번 여행의 베이스캠프!',
    stay:'1시간~', photospot:'서우봉 방면 백사장, 해상 구름다리 위',
    fee:'무료', parking:'공영주차장 (성수기 혼잡)', toilet:'있음 (샤워장 포함)',
    crowd:'성수기 낮 혼잡', besttime:'이른 오전 · 저녁 산책',
    tips:['7월 낮 백사장은 뜨거우니 아쿠아슈즈 추천','밤에는 조명이 켜져 야간 산책 코스로도 최고'] },
  { id:'seowoobong', name:'서우봉', emoji:'🌅', region:'함덕', days:['d3'],
    lat:33.5450, lng:126.6786, grad:'linear-gradient(150deg,#FF9159,#E85E2B)',
    desc:'함덕해변 동쪽에 봉긋 솟은 오름. 완만한 둘레길을 따라 오르면 함덕 바다가 한눈에 — 제주 동부 최고의 일몰 명소예요.',
    stay:'40분~1시간', photospot:'서쪽 능선 벤치(일몰), 함덕 바다 내려다보는 산책로',
    fee:'무료', parking:'함덕해변 주차장 이용', toilet:'해변 시설 이용',
    crowd:'일몰 시간대 보통', besttime:'일몰 30분 전 도착 (7월 일몰 약 19:50)',
    tips:['오르는 길이 흙길이라 운동화 필수','일몰 후 내려오는 길은 어두우니 폰 라이트 준비'] },
  { id:'gimnyeong', name:'김녕해수욕장', emoji:'🐚', region:'김녕', days:['d3'],
    lat:33.5578, lng:126.7595, grad:'linear-gradient(150deg,#5BC6D0,#2C6470)',
    desc:'하얀 모래와 유리처럼 투명한 물빛. 월정리보다 한적해서 조용히 바다를 즐기기 좋은 숨은 보석 같은 해변이에요.',
    stay:'30분~1시간', photospot:'성세기해변 표지석, 풍력발전기 배경 해안도로',
    fee:'무료', parking:'무료 주차장', toilet:'있음',
    crowd:'비교적 한적', besttime:'오전 (물빛이 가장 맑은 시간)',
    tips:['스쿠터 첫 정차 포인트로 딱 좋은 위치','바람이 강한 날엔 모래바람 주의'] },
  { id:'woljeongri', name:'월정리해변', emoji:'🥥', region:'월정리', days:['d3'],
    lat:33.5563, lng:126.7959, grad:'linear-gradient(150deg,#33B8B0,#0FA7A0)',
    desc:'"달이 머문다"는 이름의 제주 동부 대표 해변. 카페거리와 에메랄드 바다가 어우러져 언제 찍어도 그림이 됩니다.',
    stay:'1시간', photospot:'해변 앞 컬러 의자, 카페 루프탑',
    fee:'무료', parking:'공영주차장 (낮 혼잡)', toilet:'있음',
    crowd:'주말 낮 매우 혼잡', besttime:'오전 10시 이전',
    tips:['일요일이니 사람이 몰리기 전 오전에 도착하는 동선으로!','카페는 오션뷰 창가석 경쟁이 치열 — 오픈 직후 노려보기'] },
  { id:'sehwa', name:'세화해변', emoji:'🫧', region:'세화', days:['d3'],
    lat:33.5253, lng:126.8607, grad:'linear-gradient(150deg,#7FD6C2,#35815F)',
    desc:'민트빛 얕은 바다와 낮은 방파제가 예쁜 동네 해변. 월정리의 붐빔이 부담스러울 때 세화의 잔잔함이 답이에요.',
    stay:'30분~1시간', photospot:'방파제 위, 해변 앞 스윙체어',
    fee:'무료', parking:'갓길·공영 주차', toilet:'있음',
    crowd:'한적~보통', besttime:'낮~이른 오후',
    tips:['주말엔 벨롱장(플리마켓)이 열리기도 — 열리면 구경 필수','근처 명진전복에서 점심 코스로 연결하기 좋아요'] },
  { id:'bijarim', name:'비자림', emoji:'🌳', region:'구좌', days:['d3'],
    lat:33.4890, lng:126.8095, grad:'linear-gradient(150deg,#4E9A6F,#20573F)',
    desc:'수백 년 된 비자나무 2,800여 그루가 이룬 천년의 숲. 붉은 화산송이 길을 걸으면 숲 향기에 더위가 씻겨 내려가요.',
    stay:'40분~1시간', photospot:'연리목(사랑나무), 새천년 비자나무',
    fee:'성인 3,000원', parking:'무료', toilet:'있음 (입구)',
    crowd:'보통', besttime:'한낮 (더위 피난처로 최적)',
    tips:['스쿠터 코스 중 유일한 그늘 — 한낮에 배치한 이유!','짧은 코스(약 40분)만 돌아도 충분히 좋아요'] },
  { id:'taewootgae', name:'태웃개', emoji:'💧', region:'남원·하례', days:['d4'],
    lat:33.2740, lng:126.6120, grad:'linear-gradient(150deg,#3FB6C9,#1B7A8C)',
    desc:'차가운 용천수가 솟는 작은 포구. 여름이면 천연 노천탕이자 스노클링 포인트가 되는 현지인의 피서지예요.',
    stay:'40분~1시간', photospot:'포구 방파제에서 바라보는 투명한 물빛',
    fee:'무료', parking:'협소 (갓길 주차)', toilet:'간이시설',
    crowd:'평일 오전 한적', besttime:'오전',
    tips:['용천수는 한여름에도 얼음장 — 심장부터 천천히!','수건과 갈아입을 옷을 차에 준비해 두세요'] },
  { id:'olle5', name:'제주올레 5코스', emoji:'🚶', region:'남원', days:['d4'],
    lat:33.2760, lng:126.6260, grad:'linear-gradient(150deg,#68B287,#2E7D5B)',
    desc:'남원포구에서 쇠소깍까지 이어지는 바당올레(13.4km). 전 구간이 아니어도, 태웃개 부근 바다 구간만 걸어도 충분히 아름다워요.',
    stay:'1시간 (일부 구간)', photospot:'해안 산책로의 검은 현무암 + 파란 바다 대비',
    fee:'무료', parking:'구간 진입로 근처', toilet:'포구 주변',
    crowd:'한적', besttime:'오전 (더워지기 전)',
    tips:['간세(조랑말 표식)와 파란·주황 리본을 따라가면 길 잃을 걱정 없음','물 한 병은 꼭 들고 걷기 — 그늘이 적은 구간이 있어요'] },
  { id:'gongcheonpo', name:'공천포', emoji:'🌊', region:'남원', days:['d4'],
    lat:33.2750, lng:126.6280, grad:'linear-gradient(150deg,#4A8FA8,#2C5F73)',
    desc:'검은 몽돌 해안이 펼쳐진 조용한 바닷마을. 파도가 몽돌을 굴리는 소리를 들으며 점심 전후로 잠시 쉬어가기 좋아요.',
    stay:'30분', photospot:'몽돌 해안과 지귀도 배경',
    fee:'무료', parking:'식당 앞 · 갓길', toilet:'마을 공용',
    crowd:'한적', besttime:'점심 전후',
    tips:['몽돌은 미끄러우니 걸을 때 조심','물회 먹고 소화시키며 해안 한 바퀴가 정석 코스'] },
  { id:'dodubong', name:'도두봉', emoji:'✈️', region:'제주시', days:['d4'],
    lat:33.5090, lng:126.4672, grad:'linear-gradient(150deg,#F2A54A,#D97B2B)',
    desc:'공항 옆 야트막한 오름. 15분이면 정상 — 유명한 키세스존 포토스팟과 머리 위를 스치는 비행기 뷰가 기다려요.',
    stay:'30분~40분', photospot:'키세스존(나무 터널), 정상 비행기 이착륙 뷰',
    fee:'무료', parking:'도두항 방면 주차장', toilet:'입구 주변',
    crowd:'키세스존 포토 줄 있음', besttime:'오후 (역광 실루엣 샷)',
    tips:['키세스존은 줄 서서 찍는 곳 — 서로 찍어주기 품앗이 문화','비행기 시간표 앱을 켜두면 이착륙 타이밍을 잡기 쉬워요'] },
  { id:'iho', name:'이호테우해변', emoji:'🐴', region:'제주시', days:['d4'],
    lat:33.4980, lng:126.4530, grad:'linear-gradient(150deg,#FF8B65,#E85E2B)',
    desc:'빨간·하얀 조랑말 등대가 서 있는 제주시의 노을 명소. 공항에서 5분 거리라 여행의 마지막 장면으로 완벽해요.',
    stay:'40분~1시간', photospot:'목마등대 정면 방파제, 해변 카페 창가',
    fee:'무료', parking:'해변 주차장', toilet:'있음',
    crowd:'저녁 노을 시간대 붐빔', besttime:'해질녘 (우리는 오후 방문 — 역광 샷 추천)',
    tips:['등대까지 방파제 걷는 길, 바람 강하니 모자 조심','비행기 소음마저 낭만이 되는 신기한 곳'] },
  { id:'dongmun', name:'동문시장', emoji:'🍊', region:'제주시', days:['d4'],
    lat:33.5121, lng:126.5277, grad:'linear-gradient(150deg,#F2B04A,#D9822B)',
    desc:'1945년부터 이어진 제주 최대 재래시장. 오메기떡, 감귤 초콜릿, 흑돼지 육포까지 — 기념품 쇼핑의 성지입니다.',
    stay:'40분~1시간', photospot:'8번 게이트 야시장 입구, 청과 골목 감귤 매대',
    fee:'무료', parking:'공영주차장 (시장 이용 시 할인)', toilet:'시장 내 있음',
    crowd:'저녁 붐빔', besttime:'저녁 (야시장 분위기)',
    tips:['가격 비교는 두세 집 — 같은 오메기떡도 집마다 달라요','비행기 시간이 있으니 쇼핑 리스트를 미리 정해 속전속결!'] },
];

/* 맛집 — 엑셀 ②시트 + 지역별 추가 (영업시간·가격은 변동 가능, 방문 전 확인 권장) */
const FOODS = [
  { name:'흑본오겹', region:'함덕', menu:'흑돼지 오겹살', emoji:'🥓', color:'#FFE4D6',
    hours:'11:30–22:00', brk:'없음', price:'2인 6~8만원', rate:'등산 뒤 보상 1순위',
    why:'두툼한 흑돼지를 직원이 구워주는 함덕 대표 고깃집. 등산 후 단백질 충전 코스.',
    wait:'식사시간 웨이팅', rsv:'전화 예약 가능', tags:['엑셀 PICK','등산 후 추천'] },
  { name:'함덕고갈치', region:'함덕', menu:'갈치조림 · 갈치구이', emoji:'🐟', color:'#E3F4F1',
    hours:'09:00–21:00', brk:'없음', price:'2인 5~7만원', rate:'밥도둑 갈치조림',
    why:'양념이 진한 갈치조림 정식. 아침부터 열어 첫날·마지막날 어느 끼니에도 좋아요.',
    wait:'보통', rsv:'가능', tags:['엑셀 PICK'] },
  { name:'고집돌우럭 함덕점', region:'함덕', menu:'우럭조림 정식', emoji:'🍲', color:'#EAF4EE',
    hours:'10:00–21:00', brk:'브레이크 있음(확인)', price:'1인 2만원대', rate:'한상차림 정갈',
    why:'우럭조림에 옥돔구이·전복솥밥이 함께 나오는 코스형 정식. 부모님 취향까지 저격.',
    wait:'예약 권장', rsv:'네이버 예약', tags:['엑셀 PICK','한상차림'] },
  { name:'춘심이네 함덕점', region:'함덕', menu:'고등어쌈밥', emoji:'🐟', color:'#FFE4D6',
    hours:'10:30–21:00(확인)', brk:'브레이크 있음(확인)', price:'1인 1.5만원대', rate:'제주 대표 고등어쌈밥',
    why:'두툼한 고등어조림을 쌈에 싸먹는 제주 대표 맛집. 뭉클펜션에서 도보권이라 부담 없이 다녀오기 좋아요.',
    wait:'식사시간 웨이팅', rsv:'네이버 예약', tags:['함덕 인근','숙소 도보권'] },
  { name:'함덕 바다국수', region:'함덕', menu:'고기국수 · 물냉면', emoji:'🍜', color:'#E3F4F1',
    hours:'10:00–20:00(확인)', brk:'재료 소진 시 마감', price:'1인 1만원 내외', rate:'가볍게 한 끼',
    why:'해변 바로 앞 로컬 국수집. 부담 없는 가격대라 이동 중 가볍게 들르기 좋아요.',
    wait:'보통', rsv:'불가(현장)', tags:['함덕 인근','가성비'] },
  { name:'함덕 큰물횟집', region:'함덕', menu:'모둠회 · 매운탕', emoji:'🐟', color:'#E3F4F1',
    hours:'11:00–22:00(확인)', brk:'없음', price:'2인 8~10만원', rate:'해변 앞 오션뷰 횟집',
    why:'함덕해수욕장을 바라보며 즐기는 제철 회 한 상. 매운탕까지 든든하게 마무리하기 좋아요.',
    wait:'저녁 웨이팅', rsv:'전화 권장', tags:['함덕 인근','오션뷰','횟집'] },
  { name:'함덕 근고기명가', region:'함덕', menu:'흑돼지 근고기', emoji:'🥩', color:'#FFE4D6',
    hours:'12:00–23:00(확인)', brk:'브레이크 있음(확인)', price:'2인 6~8만원', rate:'숙소 근처 저녁 고기집',
    why:'뭉클펜션에서 도보로 이동 가능한 흑돼지 근고기 전문점. 흑본오겹이 붐빌 때 대안으로 좋아요.',
    wait:'저녁 웨이팅', rsv:'전화 예약 가능', tags:['함덕 인근','숙소 도보권','고기'] },
  { name:'함덕 어부의딸', region:'함덕', menu:'전복해물뚝배기 · 회덮밥', emoji:'🦐', color:'#EAF4EE',
    hours:'10:30–21:00(확인)', brk:'브레이크 있음(확인)', price:'1인 1.5~2만원', rate:'가볍게 즐기는 해산물',
    why:'회 한 접시가 부담스러운 날엔 해물뚝배기나 회덮밥으로 가볍게. 가족 단위로도 무난해요.',
    wait:'보통', rsv:'불가(현장)', tags:['함덕 인근','해산물'] },
  { name:'곰막식당', region:'김녕', menu:'회국수 · 성게국수', emoji:'🍜', color:'#E3F4F1',
    hours:'낮 영업 (방문 전 확인)', brk:'재료 소진 시 마감', price:'1인 1만원대', rate:'스쿠터 코스 별미',
    why:'김녕–동복 해안도로의 회국수 맛집. 라이딩 중 시원한 국수 한 그릇으로 완벽한 중간 보급.',
    wait:'주말 웨이팅', rsv:'불가(현장)', tags:['스쿠터 코스'] },
  { name:'월정리갈비밥', region:'월정리', menu:'갈비밥', emoji:'🍖', color:'#FFE4D6',
    hours:'낮 영업 (방문 전 확인)', brk:'재료 소진 시 마감', price:'1인 1.5만원 내외', rate:'월정리 대표 한 끼',
    why:'불향 입힌 갈비를 밥 위에 얹어주는 월정리 인기 메뉴. 바다 보고 배 채우는 코스.',
    wait:'피크 웨이팅 김', rsv:'원격 줄서기 확인', tags:['스쿠터 코스','인기'] },
  { name:'명진전복', region:'세화', menu:'전복돌솥밥', emoji:'🐚', color:'#EAF4EE',
    hours:'09:30–21:00', brk:'확인 권장', price:'1인 1.5~2만원', rate:'줄 서는 이유가 있다',
    why:'버터 향 고소한 전복돌솥밥의 원조격. 세화·평대 해안도로 스쿠터 코스와 딱 맞아요.',
    wait:'웨이팅 김(원격 줄서기)', rsv:'불가', tags:['엑셀 PICK','스쿠터 코스'] },
  { name:'공천포식당', region:'남원', menu:'한치물회 · 전복물회', emoji:'🥣', color:'#E3F4F1',
    hours:'10:00–15:30', brk:'15:30 마감 주의', price:'1인 1.3~1.8만원', rate:'여름 물회의 정석',
    why:'제주식 된장 베이스 물회를 지키는 노포. 마지막 날 점심으로 예약된 우리의 메인 코스!',
    wait:'점심 피크 웨이팅', rsv:'전화 확인', tags:['엑셀 PICK','7/20 점심'] },
  { name:'우진해장국', region:'제주시', menu:'고사리육개장', emoji:'🍚', color:'#FFE4D6',
    hours:'06:00–22:00 (확인)', brk:'없음', price:'1인 1만원대', rate:'제주 해장국 원탑급',
    why:'고사리를 갈아 넣어 걸쭉한 제주식 육개장. 아침 일찍 열어 출발 전·비행 전 든든한 한 그릇.',
    wait:'상시 웨이팅', rsv:'불가', tags:['제주시 노포','인기'] },
  { name:'자매국수', region:'제주시', menu:'고기국수 · 비빔국수', emoji:'🍝', color:'#E3F4F1',
    hours:'09:00–20:00대 (확인)', brk:'브레이크 있음(확인)', price:'1인 1만원 내외', rate:'고기국수 대표주자',
    why:'진한 돼지 육수에 수육 듬뿍. 마지막 날 이른 저녁 후보 1순위예요.',
    wait:'웨이팅 김', rsv:'불가', tags:['7/20 저녁 후보'] },
  { name:'도두해녀의집', region:'공항 근처', menu:'전복죽 · 회 모둠', emoji:'🦑', color:'#EAF4EE',
    hours:'낮~저녁 (확인)', brk:'확인 권장', price:'1인 1.5만원~', rate:'해녀가 잡은 그대로',
    why:'도두항의 해녀 직영 식당. 도두봉·이호테우 동선과 이어져 마지막 날 점심·저녁 대안으로 좋아요.',
    wait:'보통', rsv:'전화 확인', tags:['도두봉 근처'] },
];

/* 카페 — 무드별 (영업 정보는 변동 가능) */
const CAFES = [
  { name:'델문도', region:'함덕', mood:['오션뷰','감성'], emoji:'🌊', color:'#E3F4F1',
    desc:'함덕 바다 위에 떠 있는 듯한 카페. 창밖이 전부 에메랄드빛 — 아침 커피 명당.',
    pick:'함덕 아침 산책 후 모닝커피' },
  { name:'카페공작소', region:'월정리', mood:['오션뷰','감성'], emoji:'🪑', color:'#FFF3E8',
    desc:'월정리 해변 바로 앞, 통창 너머 바다가 액자처럼 걸리는 곳. 스쿠터 코스 공식 휴식 포인트.',
    pick:'스쿠터 코스 첫 카페 스탑' },
  { name:'공백', region:'세화·구좌', mood:['감성','디저트'], emoji:'🏛️', color:'#EEF0EF',
    desc:'옛 공장을 개조한 압도적 스케일의 미니멀 카페. 공간 자체가 목적지가 되는 곳.',
    pick:'세화 구간에서 더위 식히기' },
  { name:'말로', region:'함덕', mood:['감성','디저트'], emoji:'🥐', color:'#FFF3E8',
    desc:'함덕의 브런치 & 베이커리 카페. 등산 다음 날 늦은 아침으로도 잘 어울려요.',
    pick:'느긋한 아침이 필요할 때' },
  { name:'카페 바다다', region:'이호테우', mood:['노을','오션뷰'], emoji:'🌅', color:'#FFE4D6',
    desc:'이호테우 해변 앞, 노을 시간이면 창가석이 금세 차는 선셋 카페.',
    pick:'7/20 오후 마지막 카페 타임' },
  { name:'비자림 근처 숲 카페', region:'구좌', mood:['감성'], emoji:'🌿', color:'#EAF4EE',
    desc:'비자림 인근엔 숲 뷰 카페가 여럿 — 라이딩 중 지도를 보고 끌리는 곳으로! (당일 영업 확인)',
    pick:'비자림 산책 후 쿨다운' },
];
const CAFE_MOODS = ['전체','오션뷰','노을','감성','디저트'];

/* 스쿠터 루트 */
const SCOOTER = {
  stats:[ {b:'약 41km', s:'총 거리'}, {b:'약 1시간 20분', s:'순수 주행'}, {b:'약 6시간', s:'체류 포함'} ],
  stops:[
    { name:'함덕 (출발)', sub:'09:30 출발 · 대여점에서 브리핑', tip:'출발 전 타이어 공기압·브레이크·연료 게이지 확인', leg:null },
    { name:'김녕해수욕장', sub:'투명한 물빛에서 첫 휴식', tip:'풍력발전기 해안도로 구간이 이 코스의 백미', leg:'약 8km · 15분' },
    { name:'월정리해변', sub:'카페 스탑 ① 카페공작소', tip:'주차는 카페 뒤편 공영주차장이 편해요', leg:'약 5km · 10분' },
    { name:'세화해변', sub:'점심 — 명진전복 or 세화 시장', tip:'식후 방파제 산책으로 소화 타임', leg:'약 6km · 12분' },
    { name:'비자림', sub:'한낮 더위를 피하는 천년의 숲', tip:'헬멧은 들고 입장(도난 예방), 짧은 코스 40분 추천', leg:'약 7km · 15분' },
    { name:'함덕 (도착)', sub:'16:00 반납 목표', tip:'반납 전 주유 조건 확인 — 대여점마다 달라요', leg:'약 15km · 25분' },
  ],
  fuel:['125cc 기준 이 코스는 무급유로 충분하지만, 게이지 절반 이하면 김녕·세화 읍내 주유소 이용','반납 시 연료 조건(가득/현상태)을 대여 시 사진으로 남겨두기'],
  cautions:['해안도로 모래·염분 구간에서 급제동 금지','헬멧 필수 + 긴팔 얇은 겉옷(햇빛·찰과상 대비)','2인 탑승 시 반드시 125cc 이상 & 동승자 헬멧','일요일 오후 월정리 구간은 보행자 급증 — 서행'],
};

/* 숙소 — 함덕 베이스캠프 */
const STAY = {
  id:'mungkeul', name:'뭉클펜션', emoji:'🏡', region:'함덕',
  lat:33.5418, lng:126.6702, grad:'linear-gradient(150deg,#FFC7A6,#FF7A45)',
  desc:'함덕해수욕장 도보 권역의 아늑한 감성 펜션. 3박 내내 머무는 우리의 베이스캠프예요.',
  checkin:'15:00', checkout:'11:00',
  address:'제주 조천읍 함덕리 일대 (예약 시 상세주소 확인)',
  amenities:['주차 가능','개별 욕실·샤워시설','에어컨·취사 가능(옵션)','바다까지 도보 5~10분'],
  tips:['조식 제공 여부는 예약 시 확인하기','늦은 체크인(21시 이후) 시 사전 연락 권장','한라산 등반 전날이니 침구·알람 미리 세팅해두기'],
};

/* 한라산 */
const HALLASAN = {
  stats:[ {b:'17.4km', s:'왕복 거리'}, {b:'8–9시간', s:'예상 소요'}, {b:'상급', s:'난이도'} ],
  course:'관음사탐방로 → 탐라계곡 → 삼각봉대피소 → 백록담 (원점회귀)',
  must:['한라산 탐방예약시스템 사전 예약 필수 (QR + 신분증)','하절기 입산 시작 05:00 — 06시 전후 출발 추천','삼각봉대피소 통과 제한 시각 있음(계절별 상이, 예약 시 확인)','주차: 관음사지구 야영장 주차장 (소형 유료)'],
  gear:['등산화(필수— 운동화 비추천)','등산스틱 (하산 무릎 보호)','물 1인 1.5L 이상 + 행동식(초콜릿·에너지바·주먹밥)','우비 & 얇은 바람막이 (정상은 한여름에도 쌀쌀)','보조배터리 · 모자 · 선크림'],
  plan:[ {t:'06:00', d:'관음사 입구 출발 — 초반 완만한 숲길'}, {t:'08:30', d:'삼각봉대피소 — 간식 & 화장실 (마지막 시설)'}, {t:'10:30', d:'백록담 정상! 인증샷 & 30분 휴식'}, {t:'13:00', d:'하산 완료 목표 — 스틱으로 무릎 아끼기'} ],
  note:'기상 악화 시 통제가 잦아요. 전날 밤 한라산국립공원 공지와 날씨를 꼭 확인하고, 무리다 싶으면 삼각봉까지만 다녀와도 충분히 멋진 코스입니다.',
};

/* 서우봉 일몰 */
const SUNSET = {
  stats:[ {b:'19:50 전후', s:'7월 중순 일몰'}, {b:'도보 15분', s:'함덕에서'}, {b:'40분', s:'추천 체류'} ],
  spots:['서쪽 능선 벤치 — 함덕 바다로 떨어지는 해를 정면으로','둘레길 중턱 억새 구간 — 역광 실루엣 인물샷','정상부 — 함덕 마을 야경까지 담는 와이드샷'],
  shot:['일몰 30분 전 도착해 자리 선점 (19:20 목표)','인물은 해를 등지고 실루엣으로 — 노출은 하늘에 맞추기','일몰 직후 20분 매직아워가 진짜 — 바로 내려가지 마세요'],
  note:'내려오는 길이 어두워지니 폰 라이트를 준비하고, 벌레 기피제가 있으면 여름 저녁이 한결 쾌적해요.',
};

/* 동문시장 쇼핑 */
const MARKET = {
  items:[
    { name:'오메기떡', price:'10개 1만원 안팎', keep:'당일 냉장 · 아이스팩 포장 요청, 장기 보관은 냉동', emoji:'🍡' },
    { name:'감귤 초콜릿·젤리', price:'3+1 묶음 1만원대', keep:'실온 OK — 캐리어에 넣기 가장 무난', emoji:'🍫' },
    { name:'한라봉·천혜향 (계절 청과)', price:'시세 변동', keep:'택배 발송 가능 — 무겁게 들지 말기', emoji:'🍊' },
    { name:'흑돼지 육포', price:'1봉 1만원 내외', keep:'실온 보관, 기내 반입 가능', emoji:'🥩' },
    { name:'제주 땅콩·보리빵', price:'5천원~', keep:'빵류는 1–2일 내 섭취', emoji:'🥜' },
  ],
  tips:['같은 품목도 가게마다 가격이 달라요 — 두세 집 비교는 기본','시장 공영주차장은 구매 영수증으로 할인','8번 게이트 야시장 먹거리는 구경만 해도 재미 — 단, 비행기 시간 엄수!'],
};

/* 예산 (2인 기준 예상치 — 조정 가능) */
const BUDGET = [
  { name:'숙소 (함덕 3박)', amount:360000, icon:'bed-double', note:'1박 12만원 기준' },
  { name:'렌터카 (4일)', amount:200000, icon:'car', note:'보험 포함, 유류비 별도' },
  { name:'유류비', amount:50000, icon:'fuel', note:'총 주행 약 250km 예상' },
  { name:'스쿠터 대여 (1일 2대)', amount:100000, icon:'bike', note:'125cc 종일 기준' },
  { name:'식비 (2인 × 4일)', amount:400000, icon:'utensils', note:'한 끼 2인 5만원 기준' },
  { name:'카페 · 간식', amount:100000, icon:'coffee', note:'하루 2~3회' },
  { name:'기념품 · 쇼핑', amount:100000, icon:'shopping-bag', note:'동문시장 + α' },
  { name:'입장료 · 기타', amount:30000, icon:'ticket', note:'비자림 등' },
];

/* 준비물 (엑셀 ④시트 + 보강) */
const PACK = [
  { group:'여행 필수품', items:[
    { id:'idcard', name:'신분증 (주민등록증·운전면허증)', note:'탑승수속·렌터카·탐방예약 공용 필수' },
    { id:'ticket', name:'항공권 · 예약 확인증', note:'전자티켓 캡처 또는 출력' },
    { id:'charger', name:'휴대폰 충전기 · 보조배터리', note:'멀티탭 있으면 편해요' },
    { id:'cash', name:'현금 · 카드', note:'전통시장·소규모 식당 대비' },
    { id:'toiletry', name:'개인 세면도구 · 상비약', note:'두통약·소화제·밴드' },
    { id:'clothes', name:'여벌 옷 · 속옷', note:'땀·물놀이 대비 넉넉히' },
  ]},
  { group:'한라산 등산 (필수)', items:[
    { id:'boots', name:'등산화', note:'필수 — 운동화 비추천' },
    { id:'stick', name:'등산스틱', note:'하산 무릎 보호' },
    { id:'water', name:'물 1.5L 이상', note:'등반 중 수분 보충 필수' },
    { id:'snack', name:'행동식 (초콜릿·에너지바·주먹밥)', note:'등반 중 보급' },
    { id:'rain', name:'우비 · 바람막이', note:'산 날씨 대비 필수' },
    { id:'cap', name:'모자 · 선크림', note:'정상부 강한 자외선' },
    { id:'reservation', name:'탐방예약 확인 QR', note:'입산 시 신분증과 함께 확인' },
  ]},
  { group:'스쿠터 라이딩', items:[
    { id:'license', name:'운전면허증', note:'렌터카+스쿠터 공용' },
    { id:'gloves', name:'스쿠터 장갑', note:'햇빛·찰과상 대비' },
    { id:'outer', name:'얇은 긴팔 겉옷', note:'라이딩 · 한라산 겸용' },
  ]},
  { group:'공통', items:[
    { id:'battery', name:'보조배터리', note:'사진 많이 찍는 날 필수' },
    { id:'suncream', name:'선크림', note:'2시간마다 덧바르기' },
    { id:'swim', name:'수영복 (선택)', note:'태웃개 · 함덕' },
    { id:'towel', name:'스포츠 타월', note:'태웃개 물놀이 대비' },
    { id:'medicine', name:'상비약 (진통제·밴드)', note:'등산 후 근육통 대비' },
  ]},
];

/* ─────────────────────────────────────────────
   2. 유틸
────────────────────────────────────────────── */

/* localStorage 안전 래퍼 (사용 불가 환경에선 메모리로 대체) */
const store = {
  _mem:{},
  get(k){ try{ return localStorage.getItem(k); }catch(e){ return this._mem[k] ?? null; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch(e){ this._mem[k]=v; } },
  del(k){ try{ localStorage.removeItem(k); }catch(e){ delete this._mem[k]; } },
};

const gmap = q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('제주 '+q)}`;
const nmap = q => `https://map.naver.com/p/search/${encodeURIComponent('제주 '+q)}`;
const won  = n => n.toLocaleString('ko-KR') + '원';
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* D-day (여행 시작 2026-07-17) */
function ddayText(){
  const start = new Date(2026,6,17), end = new Date(2026,6,20);
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((start - today) / 86400000);
  if (diff > 0)  return { chip:`D-${diff}`,  hero:`제주까지 <b>D-${diff}</b>` };
  if (today <= end) return { chip:'여행 중', hero:`지금은 <b>제주</b> 여행 중! 🍊` };
  return { chip:'다녀옴', hero:`벌써 그리운 <b>제주</b>` };
}

/* 아이콘 재렌더 (동적 DOM 추가 후 호출) */
const icons = () => window.lucide && lucide.createIcons();

/* ─────────────────────────────────────────────
   3. 렌더
────────────────────────────────────────────── */

/* 홈: 하루 미리보기 */
function renderDayPreview(){
  $('#day-preview').innerHTML = DAYS.map((d,i)=>`
    <button class="day-preview reveal" data-goto="plan" data-day="${d.id}">
      <span class="dp-badge" style="background:${d.color}"><small>DAY</small><b>${i+1}</b></span>
      <span class="dp-info">
        <strong>${d.date} (${d.dow}) · ${d.title}</strong>
        <span>${d.summary}</span>
      </span>
      <i data-lucide="chevron-right"></i>
    </button>`).join('');
}

/* 일정: 데이 탭 + 타임라인 */
let currentDay = 'd1';
function renderDayTabs(){
  $('#day-tabs').innerHTML = DAYS.map((d,i)=>`
    <button class="day-tab ${d.id===currentDay?'active':''}" data-day="${d.id}" role="tab">
      <small>DAY ${i+1}</small><b>${d.date}</b>
    </button>`).join('');
}
function renderTimeline(){
  const day = DAYS.find(d=>d.id===currentDay);
  $('#day-summary').innerHTML = `<strong>${day.date} (${day.dow}) · ${day.title}</strong><span>${day.summary}</span>`;
  $('#timeline').innerHTML = day.items.map((it,idx)=>`
    <div class="t-item t-${it.type}" data-idx="${idx}">
      <div class="t-card">
        <button class="t-head" aria-expanded="false">
          <span class="t-time">${it.time}</span>
          <span class="t-head-main"><strong>${it.title}</strong><span>${it.sub}</span></span>
          <i data-lucide="chevron-down" class="t-chevron"></i>
        </button>
        <div class="t-body">
          <div class="t-body-inner">
            ${it.move && it.move!=='-' ? `<div class="t-detail"><i data-lucide="route"></i><p><b>이동 · </b>${it.move}</p></div>`:''}
            <div class="t-detail"><i data-lucide="sparkles"></i><p><b>포인트 · </b>${it.point}</p></div>
            <div class="t-detail tip"><i data-lucide="lightbulb"></i><p><b>여행 팁 · </b>${it.tip}</p></div>
            ${linkBtn(it.link)}
          </div>
        </div>
      </div>
    </div>`).join('');
  icons();
}
function linkBtn(link){
  if(!link) return '';
  if(link==='food') return `<button class="t-link" data-goto="place" data-sub="food"><i data-lucide="utensils"></i>맛집 리스트 보기</button>`;
  if(link==='scooter-guide') return `<button class="t-link" data-goto="guide" data-sub="scooter"><i data-lucide="bike"></i>스쿠터 가이드 보기</button>`;
  if(link==='hallasan-guide') return `<button class="t-link" data-goto="guide" data-sub="hallasan"><i data-lucide="mountain"></i>한라산 가이드 보기</button>`;
  return `<button class="t-link" data-detail="${link}"><i data-lucide="map-pin"></i>장소 자세히 보기</button>`;
}

/* 장소: 관광지 카드 */
function renderSpots(){
  $('#spot-grid').innerHTML = SPOTS.map(s=>`
    <button class="spot-card reveal" data-detail="${s.id}">
      <div class="spot-photo" style="background:${s.grad}">
        <span class="s-emoji">${s.emoji}</span>
        <span class="badge">${s.region}</span>
      </div>
      <div class="spot-info">
        <strong>${s.name}</strong>
        <span><i data-lucide="clock"></i>${s.stay} · ${s.besttime.split('(')[0].trim()}</span>
      </div>
    </button>`).join('');
}

/* 장소: 맛집 */
let foodRegion = '전체';
function renderFoodRegions(){
  const regions = ['전체', ...new Set(FOODS.map(f=>f.region))];
  $('#food-regions').innerHTML = regions.map(r=>
    `<button class="chip ${r===foodRegion?'active':''}" data-fregion="${r}">${r}</button>`).join('');
}
function renderFoods(){
  const list = FOODS.filter(f=>foodRegion==='전체'||f.region===foodRegion);
  $('#food-list').innerHTML = list.map(f=>`
    <div class="food-card reveal">
      <div class="food-main">
        <div class="food-thumb" style="background:${f.color}">${f.emoji}</div>
        <div class="food-info">
          <div class="f-top"><strong>${f.name}</strong><span class="f-region">${f.region}</span></div>
          <div class="f-menu">${f.menu}</div>
          <div class="f-desc">${f.why}</div>
        </div>
      </div>
      <div class="food-meta">
        <span><i data-lucide="clock"></i>${f.hours}</span>
        <span><i data-lucide="coffee"></i>브레이크 ${f.brk}</span>
        <span><i data-lucide="banknote"></i>${f.price}</span>
      </div>
      <div class="food-meta">
        <span><i data-lucide="star"></i>${f.rate}</span>
        <span><i data-lucide="users"></i>${f.wait}</span>
        <span><i data-lucide="calendar-check"></i>예약 ${f.rsv}</span>
      </div>
      <div class="food-tags">${f.tags.map(t=>`<span class="f-tag ${t.includes('PICK')||t.includes('인기')?'hot':''}">${t}</span>`).join('')}</div>
      <div class="food-actions">
        <a class="a-google" href="${gmap(f.name)}" target="_blank" rel="noopener"><i data-lucide="map"></i>Google Maps</a>
        <a class="a-naver" href="${nmap(f.name)}" target="_blank" rel="noopener"><i data-lucide="map-pin"></i>네이버지도</a>
      </div>
    </div>`).join('');
  icons(); observeReveals();
}

/* 장소: 카페 */
let cafeMood = '전체';
function renderCafeMoods(){
  $('#cafe-moods').innerHTML = CAFE_MOODS.map(m=>
    `<button class="chip ${m===cafeMood?'active':''}" data-cmood="${m}">${m}</button>`).join('');
}
function renderCafes(){
  const list = CAFES.filter(c=>cafeMood==='전체'||c.mood.includes(cafeMood));
  $('#cafe-list').innerHTML = list.map(c=>`
    <div class="food-card reveal">
      <div class="food-main">
        <div class="food-thumb" style="background:${c.color}">${c.emoji}</div>
        <div class="food-info">
          <div class="f-top"><strong>${c.name}</strong><span class="f-region">${c.region}</span></div>
          <div class="f-menu">${c.mood.map(m=>'#'+m).join(' ')}</div>
          <div class="f-desc">${c.desc}</div>
        </div>
      </div>
      <div class="food-meta"><span><i data-lucide="sparkles"></i>${c.pick}</span></div>
      <div class="food-actions">
        <a class="a-google" href="${gmap(c.name)}" target="_blank" rel="noopener"><i data-lucide="map"></i>Google Maps</a>
        <a class="a-naver" href="${nmap(c.name)}" target="_blank" rel="noopener"><i data-lucide="map-pin"></i>네이버지도</a>
      </div>
    </div>`).join('');
  icons(); observeReveals();
}

/* 가이드: 스쿠터 */
function renderScooter(){
  $('#gtab-scooter').innerHTML = `
    <div class="route-hero reveal">
      <h3>🛵 동부 해안 한 바퀴</h3>
      <p>함덕에서 출발해 김녕·월정리·세화·비자림을 돌아오는 7/19(일) 코스</p>
      <div class="route-stats">${SCOOTER.stats.map(s=>`<div><b>${s.b}</b><small>${s.s}</small></div>`).join('')}</div>
    </div>
    <div class="route-line">
      ${SCOOTER.stops.map(s=>`
        ${s.leg?`<span class="route-leg"><i data-lucide="move-down"></i>${s.leg}</span>`:''}
        <div class="route-stop"><div class="rs-card reveal">
          <strong>${s.name}</strong>
          <div class="rs-sub">${s.sub}</div>
          <div class="rs-tip"><i data-lucide="lightbulb"></i><span>${s.tip}</span></div>
        </div></div>`).join('')}
    </div>
    <div class="g-card reveal"><h4><i data-lucide="fuel"></i>주유 팁</h4><ul>${SCOOTER.fuel.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    <div class="g-card reveal"><h4><i data-lucide="alert-triangle"></i>주의사항</h4><ul>${SCOOTER.cautions.map(t=>`<li>${t}</li>`).join('')}
      </ul>
      <div class="g-note"><i data-lucide="shield-check"></i>대여 시 종합보험 포함 여부를 꼭 확인하세요. 헬멧 착용은 선택이 아니라 필수!</div>
    </div>
    <div style="height:30px"></div>`;
}

/* 가이드: 한라산 */
function renderHallasan(){
  $('#gtab-hallasan').innerHTML = `
    <div class="stat-row reveal">${HALLASAN.stats.map(s=>`<div class="stat-box"><b>${s.b}</b><small>${s.s}</small></div>`).join('')}</div>
    <div class="g-card reveal"><h4><i data-lucide="mountain"></i>코스</h4><p style="font-size:13.5px">${HALLASAN.course}</p></div>
    <div class="g-card reveal"><h4><i data-lucide="alarm-clock"></i>시간 계획 (7/18 토)</h4>
      <ul>${HALLASAN.plan.map(p=>`<li><b style="color:var(--sea-deep);font-family:var(--font-disp)">${p.t}</b>&nbsp;${p.d}</li>`).join('')}</ul>
    </div>
    <div class="g-card reveal"><h4><i data-lucide="clipboard-check"></i>꼭 확인하기</h4><ul>${HALLASAN.must.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    <div class="g-card reveal"><h4><i data-lucide="backpack"></i>준비물 체크리스트</h4><ul>${HALLASAN.gear.map(t=>`<li>${t}</li>`).join('')}</ul>
      <div class="g-note"><i data-lucide="cloud-rain"></i>${HALLASAN.note}</div>
    </div>
    <div style="height:30px"></div>`;
}

/* 가이드: 서우봉 */
function renderSunset(){
  $('#gtab-sunset').innerHTML = `
    <div class="stat-row reveal">${SUNSET.stats.map(s=>`<div class="stat-box"><b>${s.b}</b><small>${s.s}</small></div>`).join('')}</div>
    <div class="g-card reveal"><h4><i data-lucide="camera"></i>포토스팟</h4><ul>${SUNSET.spots.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    <div class="g-card reveal"><h4><i data-lucide="aperture"></i>추천 촬영법</h4><ul>${SUNSET.shot.map(t=>`<li>${t}</li>`).join('')}</ul>
      <div class="g-note"><i data-lucide="flashlight"></i>${SUNSET.note}</div>
    </div>
    <button class="t-link reveal" data-detail="seowoobong" style="margin-bottom:40px"><i data-lucide="map-pin"></i>서우봉 장소 정보 보기</button>`;
}

/* 가이드: 동문시장 */
function renderMarket(){
  $('#gtab-market').innerHTML = `
    <div class="g-card reveal"><h4><i data-lucide="gift"></i>추천 기념품 & 보관법</h4>
      <ul>${MARKET.items.map(m=>`<li><span><b>${m.emoji} ${m.name}</b> — ${m.price}<br><small style="color:var(--ink-soft)">${m.keep}</small></span></li>`).join('')}</ul>
    </div>
    <div class="g-card reveal"><h4><i data-lucide="lightbulb"></i>쇼핑 팁</h4><ul>${MARKET.tips.map(t=>`<li>${t}</li>`).join('')}</ul>
      <div class="g-note"><i data-lucide="plane"></i>20:40 비행기 — 19:40 렌터카 반납까지 시장 체류는 최대 1시간으로!</div>
    </div>
    <button class="t-link reveal" data-detail="dongmun" style="margin-bottom:40px"><i data-lucide="map-pin"></i>동문시장 장소 정보 보기</button>`;
}

/* 가이드: 예산 */
function renderBudget(){
  const total = BUDGET.reduce((a,b)=>a+b.amount,0);
  const max = Math.max(...BUDGET.map(b=>b.amount));
  $('#gtab-budget').innerHTML = `
    <div class="budget-list">
      ${BUDGET.map(b=>`
        <div class="budget-item reveal">
          <div class="b-top"><i data-lucide="${b.icon}"></i><strong>${b.name}</strong><b>${won(b.amount)}</b></div>
          <div class="b-bar"><i data-w="${Math.round(b.amount/max*100)}"></i></div>
          <div class="b-note">${b.note}</div>
        </div>`).join('')}
    </div>
    <div class="budget-total reveal">
      <div><strong>총 예상 비용 (2인)</strong><small>항공권 제외 · 상황에 따라 조정 가능</small></div>
      <b>${won(total)}</b>
    </div>
    <div style="height:40px"></div>`;
  /* 막대 그래프 애니메이션 */
  setTimeout(()=>$$('#gtab-budget .b-bar i').forEach(el=>el.style.width=el.dataset.w+'%'),150);
}

/* 가이드: 준비물 체크리스트 (localStorage 저장) */
function renderPack(){
  const saved = JSON.parse(store.get('jeju-pack') || '{}');
  const all = PACK.flatMap(g=>g.items);
  const doneCnt = all.filter(i=>saved[i.id]).length;
  $('#gtab-pack').innerHTML = `
    <div class="pack-progress reveal">
      <div class="pp-top"><span>짐싸기 진행률</span><b>${doneCnt} / ${all.length}</b></div>
      <div class="pp-bar"><i style="width:${Math.round(doneCnt/all.length*100)}%"></i></div>
    </div>
    ${PACK.map(g=>`
      <div class="pack-group">
        <h4>${g.group}</h4>
        ${g.items.map(it=>`
          <button class="pack-item ${saved[it.id]?'done':''}" data-pack="${it.id}">
            <span class="pk-box"><i data-lucide="check"></i></span>
            <span>${it.name}</span><small>${it.note}</small>
          </button>`).join('')}
      </div>`).join('')}
    <button class="pack-reset" id="pack-reset">체크 전체 초기화</button>`;
  icons(); observeReveals();
}

/* ─────────────────────────────────────────────
   4. 바텀시트 (장소 상세)
────────────────────────────────────────────── */
function openSheet(id){
  if(id === STAY.id) return openStaySheet();
  const s = SPOTS.find(x=>x.id===id);
  if(!s) return;
  $('#sheet-body').innerHTML = `
    <div class="sh-photo" style="background:${s.grad}">
      <span class="badge">${s.region} · ${s.stay}</span><span class="s-emoji">${s.emoji}</span>
    </div>
    <h3 class="sh-title">${s.name}</h3>
    <p class="sh-sub">${s.desc}</p>
    <div class="sh-facts">
      <div class="sh-fact"><i data-lucide="ticket"></i><div><small>입장료</small><b>${s.fee}</b></div></div>
      <div class="sh-fact"><i data-lucide="car"></i><div><small>주차</small><b>${s.parking}</b></div></div>
      <div class="sh-fact"><i data-lucide="door-open"></i><div><small>화장실</small><b>${s.toilet}</b></div></div>
      <div class="sh-fact"><i data-lucide="users"></i><div><small>혼잡도</small><b>${s.crowd}</b></div></div>
      <div class="sh-fact"><i data-lucide="clock"></i><div><small>추천 체류</small><b>${s.stay}</b></div></div>
      <div class="sh-fact"><i data-lucide="sun"></i><div><small>추천 시간</small><b>${s.besttime}</b></div></div>
    </div>
    <div class="sh-block"><h4><i data-lucide="camera"></i>포토스팟</h4><p>${s.photospot}</p></div>
    <div class="sh-block"><h4><i data-lucide="lightbulb"></i>여행 팁</h4><ul>${s.tips.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    <div class="sh-actions">
      <a class="a-g" href="${gmap(s.name)}" target="_blank" rel="noopener"><i data-lucide="map"></i>Google Maps</a>
      <a class="a-n" href="${nmap(s.name)}" target="_blank" rel="noopener"><i data-lucide="map-pin"></i>네이버지도</a>
    </div>`;
  icons();
  $('#sheet-backdrop').hidden = false;
  $('#sheet').hidden = false;
  requestAnimationFrame(()=>{ $('#sheet-backdrop').classList.add('show'); $('#sheet').classList.add('show'); });
  document.body.style.overflow = 'hidden';
}
/* 숙소(뭉클펜션) 전용 바텀시트 */
function openStaySheet(){
  const s = STAY;
  $('#sheet-body').innerHTML = `
    <div class="sh-photo" style="background:${s.grad}">
      <span class="badge">${s.region} · 베이스캠프</span><span class="s-emoji">${s.emoji}</span>
    </div>
    <h3 class="sh-title">${s.name}</h3>
    <p class="sh-sub">${s.desc}</p>
    <div class="sh-facts">
      <div class="sh-fact"><i data-lucide="log-in"></i><div><small>체크인</small><b>${s.checkin}</b></div></div>
      <div class="sh-fact"><i data-lucide="log-out"></i><div><small>체크아웃</small><b>${s.checkout}</b></div></div>
      <div class="sh-fact"><i data-lucide="map-pin"></i><div><small>위치</small><b>${s.address}</b></div></div>
      <div class="sh-fact"><i data-lucide="moon"></i><div><small>숙박</small><b>3박 (7/17~7/20)</b></div></div>
    </div>
    <div class="sh-block"><h4><i data-lucide="sparkles"></i>편의시설</h4><ul>${s.amenities.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    <div class="sh-block"><h4><i data-lucide="lightbulb"></i>여행 팁</h4><ul>${s.tips.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    <div class="sh-actions">
      <a class="a-g" href="${gmap(s.name)}" target="_blank" rel="noopener"><i data-lucide="map"></i>Google Maps</a>
      <a class="a-n" href="${nmap(s.name)}" target="_blank" rel="noopener"><i data-lucide="map-pin"></i>네이버지도</a>
    </div>`;
  icons();
  $('#sheet-backdrop').hidden = false;
  $('#sheet').hidden = false;
  requestAnimationFrame(()=>{ $('#sheet-backdrop').classList.add('show'); $('#sheet').classList.add('show'); });
  document.body.style.overflow = 'hidden';
}
function closeSheet(){
  $('#sheet-backdrop').classList.remove('show');
  $('#sheet').classList.remove('show');
  document.body.style.overflow = '';
  setTimeout(()=>{ $('#sheet-backdrop').hidden = true; $('#sheet').hidden = true; }, 400);
}
/* 시트 아래로 스와이프해서 닫기 */
(function(){
  let startY = null;
  const sheet = document.getElementById('sheet');
  sheet.addEventListener('touchstart', e=>{
    if($('#sheet-body').scrollTop <= 0 || e.target.closest('.sheet-grip')) startY = e.touches[0].clientY;
  }, {passive:true});
  sheet.addEventListener('touchmove', e=>{
    if(startY===null) return;
    const dy = e.touches[0].clientY - startY;
    if(dy > 0) sheet.style.transform = `translateY(${dy}px)`;
  }, {passive:true});
  sheet.addEventListener('touchend', e=>{
    if(startY===null) return;
    const dy = e.changedTouches[0].clientY - startY;
    sheet.style.transform = '';
    if(dy > 90) closeSheet();
    startY = null;
  });
})();

/* ─────────────────────────────────────────────
   5. 지도 (Leaflet — 지도 탭 첫 진입 시 초기화)
────────────────────────────────────────────── */
let map = null, markerLayer = null, routeLayer = null;
const SCOOTER_PATH = ['hamdeok','gimnyeong','woljeongri','sehwa','bijarim','hamdeok'];
const EXTRA_PINS = [
  { id:'hallasan-gwaneum', name:'한라산 관음사탐방로', lat:33.4189, lng:126.5560, days:['d2'], type:'spot', sub:'7/18 등반 출발점', emoji:'⛰️' },
  { id:'airport', name:'제주국제공항', lat:33.5067, lng:126.4927, days:['d1','d4'], type:'spot', sub:'IN 7/17 21:00 · OUT 7/20 20:40', emoji:'✈️' },
  { id:'gongcheonpo-restaurant', name:'공천포식당', lat:33.2750, lng:126.6283, days:['d4'], type:'food', sub:'7/20 점심 · 물회', emoji:'🥣' },
  { id:'myeongjin', name:'명진전복', lat:33.5340, lng:126.8430, days:['d3'], type:'food', sub:'스쿠터 코스 점심 후보', emoji:'🐚' },
  { id:'mungkeul', name:'뭉클펜션', lat:STAY.lat, lng:STAY.lng, days:['d1','d2','d3'], type:'stay', sub:'3박 베이스캠프 · 체크인 15:00', emoji:'🏡', detail:'mungkeul' },
];

function pinIcon(type, emoji){
  return L.divIcon({
    className:'pin' + (type==='food'?' food':'') + (type==='stay'?' stay':''),
    html:`<span>${emoji ? `<b style="transform:rotate(45deg);font-size:13px">${emoji}</b>` : ''}</span>`,
    iconSize:[30,30], iconAnchor:[15,30], popupAnchor:[0,-30],
  });
}
function initMap(){
  if(map) return;
  map = L.map('map', { zoomControl:true, attributionControl:true }).setView([33.45, 126.65], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; OpenStreetMap', maxZoom:18,
  }).addTo(map);
  markerLayer = L.layerGroup().addTo(map);
  routeLayer  = L.layerGroup().addTo(map);
  drawMarkers('all');
}
function drawMarkers(filter){
  markerLayer.clearLayers(); routeLayer.clearLayers();

  /* 스쿠터 동선 (7/19) */
  if(filter==='scooter' || filter==='all' || filter==='d3'){
    const pts = SCOOTER_PATH.map(id=>{ const s=SPOTS.find(x=>x.id===id); return [s.lat,s.lng]; });
    L.polyline(pts, { color:'#35815F', weight:4, dashArray:'8 8', opacity:.8 }).addTo(routeLayer);
  }
  /* 한라산 등반 동선 (7/18) — 함덕 숙소 ↔ 관음사탐방로 왕복 */
  if(filter==='all' || filter==='d2'){
    const hamdeok = SPOTS.find(x=>x.id==='hamdeok');
    const gwaneum = EXTRA_PINS.find(p=>p.id==='hallasan-gwaneum');
    if(hamdeok && gwaneum){
      L.polyline([[hamdeok.lat,hamdeok.lng],[gwaneum.lat,gwaneum.lng]],
        { color:'#FF7A45', weight:4, dashArray:'8 8', opacity:.85 }).addTo(routeLayer);
    }
  }
  const show = (days)=> filter==='all' || filter==='scooter' || days.includes(filter);

  SPOTS.forEach(s=>{
    if(filter==='scooter' && !SCOOTER_PATH.includes(s.id)) return;
    if(filter!=='scooter' && !show(s.days)) return;
    L.marker([s.lat,s.lng], { icon:pinIcon('spot', s.emoji) })
      .addTo(markerLayer)
      .bindPopup(`<div class="pop"><strong>${s.name}</strong><span>${s.stay} · ${s.besttime}</span><button onclick="openSheet('${s.id}')">자세히 보기</button></div>`);
  });
  if(filter!=='scooter'){
    EXTRA_PINS.forEach(p=>{
      if(!show(p.days)) return;
      const detailBtn = p.detail ? `<button onclick="openSheet('${p.detail}')">자세히 보기</button>` : '';
      L.marker([p.lat,p.lng], { icon:pinIcon(p.type, p.emoji) })
        .addTo(markerLayer)
        .bindPopup(`<div class="pop"><strong>${p.name}</strong><span>${p.sub}</span>${detailBtn}</div>`);
    });
  }
  /* 필터에 맞춰 화면 맞춤 */
  const all = [...markerLayer.getLayers()].map(m=>m.getLatLng());
  if(all.length) map.fitBounds(L.latLngBounds(all).pad(0.2));
}

/* ─────────────────────────────────────────────
   6. 라우터 & 이벤트
────────────────────────────────────────────── */
let pageHistory = [];               // 뒤로가기 스택 (드릴다운 이동만 기록)
let currentPageState = { page:'home', opt:{} };

function goto(page, opt={}){
  $$('.page').forEach(p=>p.classList.toggle('active', p.id==='page-'+page));
  $$('#bottom-nav .nav-item').forEach(n=>n.classList.toggle('active', n.dataset.goto===page));
  window.scrollTo({ top:0, behavior:'auto' });

  const labels = { home:'제주 3박 4일', plan:'여행 일정', map:'여행 지도', place:'장소', guide:'여행 가이드' };
  $('#topbar-label').textContent = labels[page] || '제주 3박 4일';

  if(page==='map') setTimeout(()=>{ initMap(); map.invalidateSize(); }, 60);
  if(page==='plan' && opt.day){ currentDay = opt.day; renderDayTabs(); renderTimeline(); observeReveals(); }
  if(page==='place' && opt.sub) switchPTab(opt.sub);
  if(page==='guide' && opt.sub) switchGTab(opt.sub);
  observeReveals();
}
function updateBackButton(){
  $('#btn-back').classList.toggle('show', pageHistory.length > 0);
}
function goBack(){
  const prev = pageHistory.pop();
  if(!prev) return;
  goto(prev.page, prev.opt);
  currentPageState = prev;
  updateBackButton();
}
function switchPTab(tab){
  $$('.sub-tab[data-ptab]').forEach(b=>b.classList.toggle('active', b.dataset.ptab===tab));
  $$('.ptab-panel').forEach(p=>p.classList.toggle('active', p.id==='ptab-'+tab));
  observeReveals();
}
function switchGTab(tab){
  $$('.sub-tab[data-gtab]').forEach(b=>b.classList.toggle('active', b.dataset.gtab===tab));
  $$('.gtab-panel').forEach(p=>p.classList.toggle('active', p.id==='gtab-'+tab));
  if(tab==='budget') renderBudget(), icons();
  observeReveals();
}

/* 전역 클릭 위임 */
document.addEventListener('click', e=>{
  const t = e.target;

  /* 페이지 이동 버튼 */
  const go = t.closest('[data-goto]');
  if(go){
    const isPrimaryNav = !!go.closest('#bottom-nav');
    const nextOpt = { day:go.dataset.day, sub:go.dataset.sub };
    if(isPrimaryNav){
      pageHistory = [];   // 하단 탭 이동은 새로운 최상위 이동 — 뒤로가기 스택 초기화
    } else if(currentPageState.page !== go.dataset.goto || JSON.stringify(currentPageState.opt) !== JSON.stringify(nextOpt)){
      pageHistory.push(currentPageState); // 콘텐츠에서 드릴다운한 이동만 기록
    }
    goto(go.dataset.goto, nextOpt);
    currentPageState = { page: go.dataset.goto, opt: nextOpt };
    updateBackButton();
    if(go.dataset.detail) setTimeout(()=>openSheet(go.dataset.detail), 350);
    return;
  }
  /* 장소 상세 */
  const det = t.closest('[data-detail]');
  if(det){ openSheet(det.dataset.detail); return; }

  /* 데이 탭 */
  const dt = t.closest('.day-tab');
  if(dt){ currentDay = dt.dataset.day; renderDayTabs(); renderTimeline(); observeReveals(); return; }

  /* 타임라인 아코디언 */
  const th = t.closest('.t-head');
  if(th){
    const item = th.closest('.t-item');
    const body = item.querySelector('.t-body');
    const open = item.classList.toggle('open');
    th.setAttribute('aria-expanded', open);
    body.style.maxHeight = open ? body.scrollHeight + 'px' : 0;
    return;
  }
  /* 장소 서브탭 / 가이드 서브탭 */
  const pt = t.closest('[data-ptab]'); if(pt){ switchPTab(pt.dataset.ptab); return; }
  const gt = t.closest('[data-gtab]'); if(gt){ switchGTab(gt.dataset.gtab); return; }

  /* 맛집 지역 / 카페 무드 필터 */
  const fr = t.closest('[data-fregion]');
  if(fr){ foodRegion = fr.dataset.fregion; renderFoodRegions(); renderFoods(); return; }
  const cm = t.closest('[data-cmood]');
  if(cm){ cafeMood = cm.dataset.cmood; renderCafeMoods(); renderCafes(); return; }

  /* 지도 필터 */
  const mf = t.closest('[data-mfilter]');
  if(mf){
    $$('#map-filters .chip').forEach(c=>c.classList.remove('active'));
    mf.classList.add('active');
    drawMarkers(mf.dataset.mfilter);
    return;
  }
  /* 준비물 체크 */
  const pk = t.closest('[data-pack]');
  if(pk){
    const saved = JSON.parse(store.get('jeju-pack') || '{}');
    saved[pk.dataset.pack] = !saved[pk.dataset.pack];
    store.set('jeju-pack', JSON.stringify(saved));
    renderPack();
    return;
  }
  if(t.closest('#pack-reset')){ store.del('jeju-pack'); renderPack(); return; }

  /* 바텀시트 닫기 */
  if(t.closest('#sheet-backdrop')) closeSheet();
});

/* FAB & 스티키 헤더 */
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  $('#fab').classList.toggle('show', y > 500);
  $('#topbar').classList.toggle('show', y > 220 || !$('#page-home').classList.contains('active'));
}, { passive:true });
$('#fab').addEventListener('click', ()=>window.scrollTo({ top:0, behavior:'smooth' }));

/* 스크롤 리빌 */
let revealObserver = null;
function observeReveals(){
  if(!revealObserver){
    revealObserver = new IntersectionObserver(entries=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); revealObserver.unobserve(en.target); } });
    }, { threshold:.08 });
  }
  $$('.reveal:not(.in)').forEach(el=>revealObserver.observe(el));
}

/* ─────────────────────────────────────────────
   7. 초기화
────────────────────────────────────────────── */
function init(){
  const dd = ddayText();
  $('#hero-dday').innerHTML = dd.hero;
  $('#dday-chip').textContent = dd.chip;

  renderDayPreview();
  renderDayTabs();
  renderTimeline();
  renderSpots();
  renderFoodRegions(); renderFoods();
  renderCafeMoods();   renderCafes();
  renderScooter(); renderHallasan(); renderSunset(); renderMarket(); renderBudget(); renderPack();

  icons();
  observeReveals();

  /* 뒤로가기 버튼 */
  $('#btn-back').addEventListener('click', goBack);
  updateBackButton();

  /* 스티키 헤더 초기 상태 (홈이 아닐 때 항상 표시) */
  window.dispatchEvent(new Event('scroll'));

  /* 로딩 화면 종료 */
  setTimeout(()=>$('#loader').classList.add('hide'), 700);
}
document.addEventListener('DOMContentLoaded', init);
