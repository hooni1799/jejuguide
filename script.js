/* ==========================================================================
   자율 & 미경의 제주 3박4일 — script.js
   구성: ① 데이터  ② 렌더 함수  ③ 인터랙션(아코디언/캐러셀/지도/체크리스트 등)
   ========================================================================== */

/* --------------------------------------------------------------------------
   ① 데이터
   -------------------------------------------------------------------------- */

// 카드 배경에 사용할 그라디언트 팔레트 (에메랄드 바다 / 숲 / 노을 톤 로테이션)
const PALETTE = [
  'linear-gradient(135deg,#0B6E58,#149C82)',
  'linear-gradient(135deg,#1F4D3C,#3E8067)',
  'linear-gradient(135deg,#FF7A47,#FFB07A)',
  'linear-gradient(135deg,#0E7C9B,#38B2C9)',
  'linear-gradient(135deg,#B8501E,#FF7A47)',
  'linear-gradient(135deg,#149C82,#7FD9BE)'
];
const paletteAt = i => PALETTE[i % PALETTE.length];

// ---- 일정 데이터 ----
const itinerary = [
  {
    date:'7/17', label:'DAY 1', full:'7월 17일 (금) · 도착', anchor:'d1',
    items:[
      { time:'21:00', place:'제주공항', title:'도착 · 렌터카 수령',
        transit:'함덕 숙소까지 약 40분 이동', point:'도착 직후 렌터카 서류·보험 꼼꼼히 확인하기',
        tip:'공항이 붐빌 수 있으니 렌터카 셔틀 위치를 미리 확인해두세요.' },
      { time:'22:00', place:'함덕 · 뭉클 펜션', title:'체크인 및 휴식',
        transit:'숙소 도착 후 도보 이동 없음', point:'다음날 새벽 한라산 등반 대비 일찍 취침',
        tip:'등산복·등산화·간식을 미리 배낭에 챙겨두면 새벽에 여유로워요.' },
    ]
  },
  {
    date:'7/18', label:'DAY 2', full:'7월 18일 (토) · 한라산', anchor:'d2',
    items:[
      { time:'06:00', place:'한라산', title:'관음사 원점회귀 출발',
        transit:'뭉클 펜션(함덕)에서 관음사 탐방로 입구까지 차량 약 40분', point:'간식과 물 최소 1.5L 이상 준비',
        tip:'주차장이 아침 일찍 만차가 되니 05:30 이전 도착을 추천해요.' },
      { time:'07:00–13:00', place:'한라산', title:'관음사 코스 등반',
        transit:'편도 약 8.7km, 왕복 약 5~6시간 소요', point:'삼각봉 대피소에서 정상 조망 감상',
        tip:'하절기는 낙석·급변 기상에 대비해 우비를 꼭 챙기세요.' },
      { time:'13:30', place:'함덕', title:'점심 (흑본오겹 / 함덕고갈치 / 고집돌우럭)',
        transit:'하산 후 차량으로 함덕까지 약 40분', point:'등반 후 체력 보충용 든든한 한 끼',
        tip:'주말 점심시간은 대기가 있을 수 있어 미리 전화 문의를 추천해요.' },
      { time:'15:00', place:'함덕 · 뭉클 펜션', title:'숙소 휴식',
        transit:'-', point:'등반 피로 회복, 샤워 및 낮잠',
        tip:'다리 근육 이완을 위해 스트레칭을 해두면 다음날이 편해요.' },
      { time:'18:30', place:'함덕', title:'저녁 · 해변 산책',
        transit:'숙소에서 도보 5~10분', point:'노을 지는 함덕해변 산책',
        tip:'해질 무렵 백사장 산책로가 특히 아름다워요.' },
    ]
  },
  {
    date:'7/19', label:'DAY 3', full:'7월 19일 (일) · 동부 스쿠터', anchor:'d3',
    items:[
      { time:'09:00', place:'함덕', title:'스쿠터 대여',
        transit:'뭉클 펜션 인근 대여점', point:'125cc 이상 스쿠터 추천 (해안도로 안정감)',
        tip:'운전면허증과 국제면허증(필요 시) 반드시 지참하세요.' },
      { time:'09:30–15:30', place:'동부', title:'함덕 → 김녕 → 월정리 → 세화 → 비자림',
        transit:'전체 약 45km, 카페 방문 포함 약 6시간', point:'해안도로 드라이브와 카페 투어를 함께',
        tip:'한여름 자외선이 강하니 자외선 차단 아이템을 꼭 챙기세요.' },
      { time:'16:00', place:'함덕 · 뭉클 펜션', title:'숙소 휴식',
        transit:'-', point:'저녁 일정 전 재정비',
        tip:'스쿠터 반납 시간을 미리 확인해두세요.' },
      { time:'18:30', place:'서우봉', title:'일몰 감상',
        transit:'함덕에서 도보 또는 차량 10분', point:'정상 억새 능선 포토스팟',
        tip:'일몰 40분 전에는 도착해서 자리를 잡는 게 좋아요.' },
      { time:'19:30', place:'함덕', title:'저녁',
        transit:'서우봉에서 함덕까지 도보 10분', point:'하루 마무리 식사',
        tip:'해변가 식당은 저녁에 붐빌 수 있어요.' },
    ]
  },
  {
    date:'7/20', label:'DAY 4', full:'7월 20일 (월) · 남원·제주시', anchor:'d4',
    items:[
      { time:'08:30', place:'남원', title:'태웃개 · 제주올레 5코스',
        transit:'뭉클 펜션(함덕) 체크아웃 후 차량 약 1시간', point:'해안 절경 산책로, 여유로운 아침 산책',
        tip:'짐을 미리 트렁크에 정리해두면 이동이 편해요.' },
      { time:'11:30', place:'남원', title:'공천포식당 점심 (한치·전복물회)',
        transit:'태웃개에서 차량 10분', point:'브레이크타임 전 방문 추천',
        tip:'물회는 여름철 별미이니 놓치지 마세요.' },
      { time:'14:30', place:'제주시', title:'도두봉',
        transit:'남원에서 차량 약 1시간', point:'키세스존 전망 포토스팟',
        tip:'공항 이착륙 비행기 뷰가 인상적이에요.' },
      { time:'15:30', place:'제주시', title:'이호테우해변',
        transit:'도두봉에서 도보 10분', point:'빨간·흰 목마 등대에서 인증샷',
        tip:'해변 카페에서 잠시 쉬어가기 좋아요.' },
      { time:'17:30', place:'제주시', title:'저녁',
        transit:'-', point:'여행 마무리 식사',
        tip:'공항 근처 식당은 저녁 피크타임을 피하는 게 좋아요.' },
      { time:'18:20', place:'제주시', title:'동문시장 쇼핑',
        transit:'차량 15분', point:'기념품 · 흑돼지 육포 · 감귤 초콜릿',
        tip:'현금 결제가 필요한 노점도 있으니 소액권을 준비하세요.' },
      { time:'19:40', place:'공항', title:'렌터카 반납',
        transit:'20:40 출발 예정', point:'반납 전 유류 확인',
        tip:'출발 2시간 전 반납 완료를 목표로 이동하세요.' },
    ]
  },
];

// ---- 숙소 ----
const accommodation = { name:'뭉클 펜션', lat:33.5440, lng:126.6705, desc:'함덕 숙소 (3박)' };

// ---- 관광지 12곳 ----
const spots = [
  { id:'hamdeok', name:'함덕해수욕장', icon:'fa-umbrella-beach', lat:33.5434, lng:126.6693,
    stay:'1시간', photospot:'서우봉 방향 에메랄드빛 백사장 라인', fee:'무료', parking:'무료 공영주차장',
    toilet:'해변 내 공중화장실', crowd:'여름 성수기 혼잡', bestTime:'오전 또는 노을 무렵',
    tip:'투명한 에메랄드빛 얕은 바다가 특징이라 아이 동반 가족에게도 인기예요.',
    desc:'제주 동부를 대표하는 해변으로, 얕고 투명한 에메랄드빛 바다와 하얀 백사장이 어우러져 있습니다. 숙소 인근이라 여행 내내 자주 들르게 되는 베이스캠프 같은 장소예요.' },
  { id:'seowoobong', name:'서우봉', icon:'fa-mountain-sun', lat:33.5482, lng:126.6788,
    stay:'40분', photospot:'정상 억새 능선, 봉수대 실루엣', fee:'무료', parking:'입구 소형 주차장',
    toilet:'입구 화장실', crowd:'일몰 시간대 혼잡', bestTime:'일몰 40분 전',
    tip:'봄에는 유채꽃, 여름엔 초록 능선과 함덕 바다 조망이 압권이에요.',
    desc:'함덕해수욕장을 감싸는 나지막한 오름으로, 정상까지 왕복 약 40분이면 다녀올 수 있어요. 일몰 명소로 특히 유명합니다.' },
  { id:'gimnyeong', name:'김녕해변', icon:'fa-water', lat:33.5563, lng:126.7597,
    stay:'1시간', photospot:'에메랄드빛 바다와 하얀 모래', fee:'무료', parking:'무료 주차장',
    toilet:'해변 화장실', crowd:'보통', bestTime:'오전',
    tip:'김녕성세기해변이라고도 불리며, 함덕보다 한적하게 즐길 수 있어요.',
    desc:'맑고 투명한 바다색이 인상적인 해변으로, 스쿠터 동부 투어 중 첫 번째로 들르기 좋은 장소입니다.' },
  { id:'woljeongri', name:'월정리', icon:'fa-mug-saucer', lat:33.5563, lng:126.7961,
    stay:'1시간', photospot:'해변을 따라 이어진 카페거리 뷰', fee:'무료', parking:'해변가 유료 주차장 다수',
    toilet:'카페 및 공영화장실', crowd:'카페거리 상시 혼잡', bestTime:'늦은 오후',
    tip:'카페마다 통유리창 오션뷰가 달라 취향에 맞는 곳을 골라보세요.',
    desc:'제주에서 가장 유명한 카페거리 중 하나로, 에메랄드빛 바다를 배경으로 한 감성 카페들이 줄지어 있습니다.' },
  { id:'sehwa', name:'세화', icon:'fa-water', lat:33.5259, lng:126.8590,
    stay:'40분', photospot:'세화해변 산책로', fee:'무료', parking:'무료 주차장',
    toilet:'해변 화장실', crowd:'한적한 편', bestTime:'오후',
    tip:'세화 오일장(5·10일장)과 겹치면 로컬 분위기를 더 느낄 수 있어요.',
    desc:'상대적으로 조용하고 로컬 감성이 살아있는 해변 마을로, 명진전복 등 로컬 맛집이 모여 있습니다.' },
  { id:'bijarim', name:'비자림', icon:'fa-tree', lat:33.4886, lng:126.7996,
    stay:'1시간', photospot:'붉은 화산송이 흙길과 비자나무 숲', fee:'성인 3,000원 내외', parking:'무료 주차장',
    toilet:'입구 화장실', crowd:'성수기 오전 혼잡', bestTime:'오전 이른 시간',
    tip:'약 800년 된 새천년비자나무 앞은 필수 인증샷 스팟이에요.',
    desc:'국내 최대 비자나무 자생지로, 신비로운 숲길 산책을 즐길 수 있는 힐링 명소입니다.' },
  { id:'taeutgae', name:'태웃개', icon:'fa-anchor', lat:33.2660, lng:126.6280,
    stay:'1시간', photospot:'남원 해안 절벽과 에메랄드빛 바다', fee:'무료', parking:'인근 갓길 주차',
    toilet:'인근 공중화장실', crowd:'한적함', bestTime:'오전',
    tip:'올레5코스 시작 구간과 이어져 산책하듯 걷기 좋아요.',
    desc:'남원 해안의 숨은 절경으로, 올레5코스와 연결되는 조용한 해안 산책 포인트입니다.' },
  { id:'olle5', name:'제주올레 5코스', icon:'fa-person-hiking', lat:33.2793, lng:126.7150,
    stay:'1~2시간(부분 구간)', photospot:'남원 해안절벽 산책로', fee:'무료', parking:'남원포구 주차장',
    toilet:'구간 내 화장실 제한적', crowd:'한적함', bestTime:'오전 서늘할 때',
    tip:'전 구간(약 13km) 대신 태웃개~공천포 구간만 걸어도 충분히 아름다워요.',
    desc:'남원포구에서 쇠소깍까지 이어지는 해안 올레길로, 에메랄드빛 바다를 곁에 두고 걷는 코스입니다.' },
  { id:'gongcheonpo', name:'공천포', icon:'fa-fish', lat:33.2685, lng:126.6390,
    stay:'40분', photospot:'공천포 방파제에서 바라본 해안선', fee:'무료', parking:'식당 인근 무료 주차',
    toilet:'식당 이용 시 가능', crowd:'한적함', bestTime:'점심 시간대',
    tip:'공천포식당 물회와 함께 방파제 산책을 즐겨보세요.',
    desc:'조용한 어촌 포구로, 남원 지역 대표 맛집인 공천포식당이 자리한 곳입니다.' },
  { id:'dodubong', name:'도두봉', icon:'fa-plane', lat:33.4989, lng:126.4759,
    stay:'30분', photospot:'키세스존(하트 모양 나무) 뷰', fee:'무료', parking:'입구 소형 주차장',
    toilet:'입구 화장실', crowd:'포토존 대기 있음', bestTime:'오후 항공기 이착륙 시간대',
    tip:'정상까지 왕복 20~30분이면 충분해 부담 없이 다녀올 수 있어요.',
    desc:'낮은 오름이지만 정상에서 제주공항 활주로와 바다를 함께 조망할 수 있는 인기 명소입니다.' },
  { id:'iho', name:'이호테우해변', icon:'fa-water', lat:33.4989, lng:126.4614,
    stay:'40분', photospot:'빨간 등대 · 하얀 목마 등대', fee:'무료', parking:'무료 주차장',
    toilet:'해변 화장실', crowd:'노을 시간대 혼잡', bestTime:'노을 무렵',
    tip:'제주시 도심에서 가장 가까운 노을 명소 중 하나예요.',
    desc:'말 모양의 빨강·하양 등대가 상징인 해변으로, 도심에서 가까워 마지막 날 일정에 넣기 좋습니다.' },
  { id:'dongmun', name:'동문시장', icon:'fa-store', lat:33.5135, lng:126.5283,
    stay:'1~1.5시간', photospot:'야시장 먹거리 골목 야경', fee:'무료(구매 별도)', parking:'인근 공영주차장',
    toilet:'시장 내 화장실', crowd:'저녁 시간 혼잡', bestTime:'18:00 이후 야시장',
    tip:'흑돼지 육포, 감귤 초콜릿, 오메기떡이 대표 기념품이에요.',
    desc:'제주 최대 전통시장이자 야시장으로, 여행 마지막 날 기념품 쇼핑과 길거리 음식을 즐기기 좋습니다.' },
];

// ---- 지역별 맛집 ----
const foods = [
  { region:'함덕', name:'흑본오겹', menu:'흑돼지 오겹살', hours:'11:30–22:00', breakTime:'없음', price:'2인 6만원대', rating:'4.4', reason:'한라산 등반 후 방문하기 좋은 든든한 고기 맛집', waiting:'주말 대기 있음', reservation:'가능', q:'흑본오겹 함덕' },
  { region:'함덕', name:'함덕고갈치', menu:'갈치조림 · 갈치구이', hours:'09:00–21:00', breakTime:'15:00–17:00', price:'2인 7만원대', rating:'4.3', reason:'담백한 갈치조림으로 든든한 한 끼', waiting:'보통', reservation:'권장', q:'함덕고갈치' },
  { region:'함덕', name:'고집돌우럭', menu:'우럭정식', hours:'10:00–21:00', breakTime:'15:00–17:00', price:'2인 6만원대', rating:'4.3', reason:'푸짐한 반찬과 함께 나오는 우럭조림 정식', waiting:'보통', reservation:'권장', q:'고집돌우럭 함덕' },
  { region:'김녕', name:'김녕 해녀의 집', menu:'전복죽 · 해물뚝배기', hours:'09:00–18:00', breakTime:'없음', price:'2인 4만원대', rating:'4.2', reason:'해녀가 직접 채취한 해산물로 만든 향토음식', waiting:'적음', reservation:'불필요', q:'김녕 해녀의 집' },
  { region:'월정리', name:'월정리 해녀물국', menu:'전복물국 · 성게미역국', hours:'09:00–19:00', breakTime:'없음', price:'2인 5만원대', rating:'4.3', reason:'카페거리 방문 전후 든든한 한 끼로 좋음', waiting:'보통', reservation:'불필요', q:'월정리 해녀물국' },
  { region:'세화', name:'명진전복', menu:'전복돌솥밥', hours:'09:30–21:00', breakTime:'없음', price:'2인 6만원대', rating:'4.5', reason:'스쿠터 코스 중 들르기 좋은 전복 맛집', waiting:'대기 많음', reservation:'불가(현장대기)', q:'명진전복 세화' },
  { region:'남원', name:'공천포식당', menu:'한치물회 · 전복물회', hours:'10:00–15:30', breakTime:'브레이크 전 방문 추천', price:'2인 4만원대', rating:'4.4', reason:'여름철 별미 물회 전문점', waiting:'점심 피크 대기', reservation:'불필요', q:'공천포식당' },
  { region:'제주시', name:'우진해장국', menu:'몸국 · 고사리해장국', hours:'24시간', breakTime:'없음', price:'2인 2만원대', rating:'4.2', reason:'제주 전통 향토음식을 부담 없는 가격에', waiting:'보통', reservation:'불필요', q:'우진해장국 제주시' },
  { region:'제주시', name:'동문시장 포장마차거리', menu:'흑돼지 꼬치 · 한치튀김', hours:'18:00–24:00', breakTime:'없음', price:'1인 1~2만원대', rating:'4.1', reason:'야시장 감성으로 다양한 먹거리를 조금씩', waiting:'혼잡', reservation:'불필요', q:'동문시장 야시장' },
  { region:'공항 근처', name:'제주공항 흑돼지거리', menu:'흑돼지 구이', hours:'11:00–22:00', breakTime:'없음', price:'2인 8만원대', rating:'4.0', reason:'출발 전 마지막 흑돼지 한 상', waiting:'저녁 대기 있음', reservation:'권장', q:'제주공항 흑돼지거리' },
  { region:'공항 근처', name:'용담해안도로 카페 겸 식당', menu:'해물라면 · 딱새우회', hours:'10:00–20:00', breakTime:'없음', price:'2인 4만원대', rating:'4.1', reason:'반납 전 노을 보며 가볍게 먹기 좋음', waiting:'적음', reservation:'불필요', q:'용담해안도로 딱새우' },
];

// ---- 카페 ----
const cafes = [
  { name:'월정리 오션뷰 카페', region:'월정리', tags:['오션뷰','디저트'], icon:'fa-mug-hot', desc:'통유리창 너머 에메랄드빛 바다가 펼쳐지는 대표 오션뷰 카페.' },
  { name:'세화 해변 감성 카페', region:'세화', tags:['감성','오션뷰'], icon:'fa-mug-hot', desc:'한적한 세화 해변을 바라보며 여유를 즐길 수 있는 로컬 카페.' },
  { name:'함덕 노을 루프탑 카페', region:'함덕', tags:['노을','오션뷰'], icon:'fa-fire', desc:'루프탑에서 함덕해변 노을을 감상하기 좋은 스팟.' },
  { name:'김녕 베이커리 카페', region:'김녕', tags:['디저트'], icon:'fa-cookie', desc:'직접 굽는 베이커리와 스콘이 인기인 아늑한 카페.' },
  { name:'서우봉 아래 감성 카페', region:'함덕', tags:['감성','노을'], icon:'fa-leaf', desc:'서우봉 산책 전후 들르기 좋은 조용한 감성 카페.' },
  { name:'이호테우 등대 카페', region:'제주시', tags:['노을','오션뷰'], icon:'fa-lighthouse', desc:'빨강·하양 등대 뷰와 함께 노을을 즐길 수 있는 카페.' },
  { name:'도두봉 뷰 카페', region:'제주시', tags:['오션뷰','디저트'], icon:'fa-plane', desc:'비행기 이착륙 뷰와 커피를 함께 즐기는 인기 카페.' },
  { name:'비자림 인근 티하우스', region:'비자림', tags:['감성'], icon:'fa-spa', desc:'숲 산책 후 들르기 좋은 조용한 티 카페.' },
];

// ---- 스쿠터 루트 ----
const scooterStops = [
  { name:'함덕 (출발)', dist:'-', time:'-', note:'스쿠터 대여 및 안전장비 점검' },
  { name:'김녕해변', dist:'약 12km', time:'약 20분', note:'해안도로 드라이브 후 잠시 휴식' },
  { name:'월정리', dist:'약 4km', time:'약 8분', note:'카페거리에서 여유로운 휴식 추천' },
  { name:'세화', dist:'약 8km', time:'약 15분', note:'명진전복에서 늦은 점심 또는 간식' },
  { name:'비자림', dist:'약 7km', time:'약 15분', note:'숲길 산책, 스쿠터는 입구에 주차' },
  { name:'함덕 (복귀)', dist:'약 14km', time:'약 25분', note:'해질 무렵 도착, 서우봉 일몰 연계' },
];

// ---- 한라산 체크리스트 / 팁 ----
const hallaChecklistItems = ['등산화','등산스틱','충분한 식수(1.5L 이상)','간식(당분·염분)','우비','보조배터리','자외선 차단제','여벌 양말'];
const hallaTips = [
  '관음사 코스는 편도 8.7km로 왕복 5~6시간 이상 소요돼요. 07:00 이전 출발을 목표로 하세요.',
  '탐방로 입구 통제 시간이 있으니 사전에 국립공원 홈페이지에서 확인하세요.',
  '삼각봉 대피소 이후 급경사 구간이 있어 무리한 페이스는 피하는 게 좋아요.',
  '하절기에도 정상부는 기온차가 크니 얇은 바람막이를 챙기세요.',
];

// ---- 동문시장 기념품 ----
const marketItems = [
  { icon:'fa-drumstick-bite', name:'흑돼지 육포', desc:'가격대 1만~2만원, 실온 보관 가능해 선물용으로 인기' },
  { icon:'fa-candy-cane', name:'감귤 초콜릿', desc:'가격대 8천~1.5만원, 여름철엔 아이스팩 포장 요청 추천' },
  { icon:'fa-cookie-bite', name:'오메기떡', desc:'가격대 1만원 내외, 냉장 보관 필요·구매 당일 섭취 권장' },
  { icon:'fa-wine-bottle', name:'한라봉/천혜향 가공품', desc:'가격대 1만~3만원, 파손 주의해 캐리어 하단에 보관' },
];

// ---- 예산 ----
const budgetItems = [
  { icon:'fa-bed', label:'숙소', sub:'뭉클 펜션(함덕) · 3박', amount:'약 45만원' },
  { icon:'fa-car', label:'렌터카', sub:'4일, 보험 포함', amount:'약 25만원' },
  { icon:'fa-motorcycle', label:'스쿠터 대여', sub:'1일', amount:'약 6만원' },
  { icon:'fa-utensils', label:'식비', sub:'2인, 8끼 기준', amount:'약 40만원' },
  { icon:'fa-mug-hot', label:'카페', sub:'2인, 6회 기준', amount:'약 9만원' },
  { icon:'fa-gift', label:'기념품', sub:'동문시장 등', amount:'약 10만원' },
];

// ---- 준비물 체크리스트 (LocalStorage 저장) ----
const checklistItems = ['등산화','등산스틱','보조배터리','선크림','우비','수영복(선택)','운전면허증','스쿠터 장갑','자외선 차단 아이템','상비약'];


/* --------------------------------------------------------------------------
   ② 렌더 함수
   -------------------------------------------------------------------------- */

function renderDayTabs(){
  const wrap = document.getElementById('dayTabs');
  wrap.innerHTML = itinerary.map((d,i)=>`
    <button class="day-tab ${i===0?'active':''}" data-day="${i}">${d.date} · ${d.label}</button>
  `).join('');
  wrap.querySelectorAll('.day-tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      wrap.querySelectorAll('.day-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const idx = btn.dataset.day;
      document.getElementById('d'+(Number(idx)+1)+'-group')?.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
}

function renderTimeline(){
  const wrap = document.getElementById('timeline');
  wrap.innerHTML = itinerary.map((d,di)=>`
    <div class="day-group" id="d${di+1}-group">
      <h3 class="day-group-title">${d.full}</h3>
      ${d.items.map((it,ii)=>`
        <div class="tl-item" data-day="${di}" data-i="${ii}">
          <span class="tl-dot"></span>
          <div class="tl-card">
            <div class="tl-card-head">
              <span class="tl-time">${it.time}</span>
              <div class="tl-main">
                <p class="tl-place">${it.place}</p>
                <p class="tl-title">${it.title}</p>
              </div>
              <i class="fa-solid fa-chevron-down tl-chevron"></i>
            </div>
            <div class="tl-body">
              <div class="tl-body-inner">
                <div class="tl-row"><i class="fa-solid fa-route"></i><span><span class="tl-label">이동</span>${it.transit}</span></div>
                <div class="tl-row"><i class="fa-solid fa-star"></i><span><span class="tl-label">추천포인트</span>${it.point}</span></div>
                <div class="tl-row"><i class="fa-solid fa-lightbulb"></i><span><span class="tl-label">여행팁</span>${it.tip}</span></div>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');

  wrap.querySelectorAll('.tl-card-head').forEach(head=>{
    head.addEventListener('click', ()=>{
      head.closest('.tl-item').classList.toggle('open');
    });
  });
}

function renderSpotGrid(){
  const grid = document.getElementById('spotGrid');
  grid.innerHTML = spots.map((s,i)=>`
    <div class="spot-card" data-spot="${i}" data-aos="fade-up" data-aos-delay="${(i%4)*60}">
      <div class="card-photo" style="background:${paletteAt(i)}">
        <i class="fa-solid ${s.icon} bigicon"></i>
        <span class="card-badge">${s.stay}</span>
      </div>
      <div class="card-body">
        <p class="card-title">${s.name}</p>
        <p class="card-sub"><i class="fa-solid fa-camera"></i> ${s.photospot.slice(0,14)}${s.photospot.length>14?'…':''}</p>
      </div>
    </div>
  `).join('');
  grid.querySelectorAll('.spot-card').forEach(card=>{
    card.addEventListener('click', ()=> openSpotDetail(spots[card.dataset.spot], Number(card.dataset.spot)));
  });
}

function openSpotDetail(s, i){
  const body = document.getElementById('detailBody');
  body.innerHTML = `
    <div class="dt-photo" style="background:${paletteAt(i)}">
      <i class="fa-solid ${s.icon}" style="font-size:26px;"></i>
    </div>
    <p class="dt-eyebrow">SPOT</p>
    <h3 class="dt-title">${s.name}</h3>
    <p class="dt-desc">${s.desc}</p>
    <div class="dt-grid">
      <div class="dt-fact"><p class="dt-fact-label">추천 체류시간</p><p class="dt-fact-val">${s.stay}</p></div>
      <div class="dt-fact"><p class="dt-fact-label">입장료</p><p class="dt-fact-val">${s.fee}</p></div>
      <div class="dt-fact"><p class="dt-fact-label">주차</p><p class="dt-fact-val">${s.parking}</p></div>
      <div class="dt-fact"><p class="dt-fact-label">화장실</p><p class="dt-fact-val">${s.toilet}</p></div>
      <div class="dt-fact"><p class="dt-fact-label">혼잡도</p><p class="dt-fact-val">${s.crowd}</p></div>
      <div class="dt-fact"><p class="dt-fact-label">추천 시간대</p><p class="dt-fact-val">${s.bestTime}</p></div>
    </div>
    <div class="dt-tip"><i class="fa-solid fa-lightbulb"></i><span>${s.tip}</span></div>
  `;
  openDetailSheet();
}

function renderFoodFilter(){
  const regions = ['전체', ...new Set(foods.map(f=>f.region))];
  const wrap = document.getElementById('foodFilter');
  wrap.innerHTML = regions.map((r,i)=>`<button class="chip ${i===0?'active':''}" data-region="${r}">${r}</button>`).join('');
  wrap.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      wrap.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      renderFoodCarousel(chip.dataset.region);
    });
  });
}

function renderFoodCarousel(region='전체'){
  const wrap = document.getElementById('foodCarousel');
  const list = region==='전체' ? foods : foods.filter(f=>f.region===region);
  wrap.innerHTML = list.map((f,i)=>`
    <div class="food-card">
      <div class="food-photo" style="background:${paletteAt(i)}"><span class="food-tag">${f.region}</span></div>
      <div class="food-body">
        <p class="food-region"><i class="fa-solid fa-location-dot"></i> ${f.region}</p>
        <p class="food-name">${f.name}</p>
        <p class="food-menu">${f.menu}</p>
        <div class="food-meta">
          <span><i class="fa-regular fa-clock"></i> ${f.hours}</span>
          <span><i class="fa-solid fa-mug-saucer"></i> 브레이크 ${f.breakTime}</span>
          <span><i class="fa-solid fa-won-sign"></i> ${f.price}</span>
          <span><i class="fa-solid fa-star"></i> ${f.rating}</span>
          <span><i class="fa-solid fa-hourglass-half"></i> ${f.waiting}</span>
          <span><i class="fa-solid fa-check"></i> 예약 ${f.reservation}</span>
        </div>
        <p class="food-menu" style="margin-bottom:12px;">${f.reason}</p>
        <div class="food-links">
          <a class="gmap" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(f.q)}"><i class="fa-brands fa-google"></i> 구글맵</a>
          <a class="nmap" target="_blank" rel="noopener" href="https://map.naver.com/p/search/${encodeURIComponent(f.q)}"><i class="fa-solid fa-map"></i> 네이버맵</a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCafeFilter(){
  const tags = ['전체','오션뷰','노을','감성','디저트'];
  const wrap = document.getElementById('cafeFilter');
  wrap.innerHTML = tags.map((t,i)=>`<button class="chip ${i===0?'active':''}" data-tag="${t}">${t}</button>`).join('');
  wrap.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      wrap.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      renderCafeGrid(chip.dataset.tag);
    });
  });
}

function renderCafeGrid(tag='전체'){
  const grid = document.getElementById('cafeGrid');
  const list = tag==='전체' ? cafes : cafes.filter(c=>c.tags.includes(tag));
  grid.innerHTML = list.map((c,i)=>`
    <div class="cafe-card" data-aos="fade-up" data-aos-delay="${(i%4)*60}">
      <div class="card-photo" style="background:${paletteAt(i+2)}">
        <i class="fa-solid ${c.icon} bigicon"></i>
        <span class="card-badge">${c.region}</span>
      </div>
      <div class="card-body">
        <p class="card-title">${c.name}</p>
        <p class="card-sub">${c.tags.join(' · ')}</p>
      </div>
    </div>
  `).join('');
}

function renderScooter(){
  const route = document.getElementById('scooterRoute');
  route.innerHTML = scooterStops.map((s,i)=>`
    <div class="sr-stop" data-aos="fade-up" data-aos-delay="${i*40}">
      <span class="sr-num">${i+1}</span>
      <div class="sr-card">
        <p class="sr-name">${s.name}</p>
        <div class="sr-info">
          <span><i class="fa-solid fa-road"></i> ${s.dist}</span>
          <span><i class="fa-regular fa-clock"></i> ${s.time}</span>
        </div>
        <p style="margin-top:8px; font-size:12.5px; color:var(--c-ink-soft);">${s.note}</p>
      </div>
    </div>
  `).join('');

  const notes = document.getElementById('scooterNotes');
  notes.innerHTML = `
    <p class="sn-title"><i class="fa-solid fa-mug-hot"></i> 추천 휴식포인트</p>
    <ul class="sn-list"><li>월정리 카페거리</li><li>세화 해변 산책로</li><li>비자림 입구 쉼터</li></ul>
    <p class="sn-title"><i class="fa-solid fa-gas-pump"></i> 주유 팁</p>
    <ul class="sn-list"><li>대여 시 만유 상태 확인, 반납 전 동일하게 채워두기</li><li>동부 구간은 주유소 간격이 넓으니 절반 이하로 내려가면 미리 주유</li></ul>
    <p class="sn-title"><i class="fa-solid fa-triangle-exclamation"></i> 주의사항</p>
    <ul class="sn-list"><li>해안도로는 바람이 강할 수 있어 서행 필수</li><li>헬멧 착용 필수, 야간 주행 시 반사 조끼 권장</li><li>급경사·급커브 구간 다수, 규정 속도 준수</li></ul>
  `;
}

function renderHallasan(){
  const stats = document.getElementById('hallaStats');
  stats.innerHTML = `
    <div class="hs-item"><p class="hs-val">상</p><p class="hs-label">난이도</p></div>
    <div class="hs-item"><p class="hs-val">5~6시간</p><p class="hs-label">등산시간</p></div>
    <div class="hs-item"><p class="hs-val">8.7km</p><p class="hs-label">편도 거리</p></div>
  `;
  const cl = document.getElementById('hallaChecklist');
  cl.innerHTML = `
    <p class="hc-title"><i class="fa-solid fa-backpack"></i> 준비물 체크리스트</p>
    <div class="hc-grid">
      ${hallaChecklistItems.map((t,i)=>`
        <label><input type="checkbox" style="accent-color:#149C82;"> ${t}</label>
      `).join('')}
    </div>
  `;
  const tips = document.getElementById('hallaTips');
  tips.innerHTML = `
    <p class="hc-title"><i class="fa-solid fa-circle-info"></i> 등반 팁</p>
    <ul>${hallaTips.map(t=>`<li>${t}</li>`).join('')}</ul>
  `;
}

function renderMarket(){
  const grid = document.getElementById('marketGrid');
  grid.innerHTML = marketItems.map(m=>`
    <div class="market-item" data-aos="fade-up">
      <div class="market-icon"><i class="fa-solid ${m.icon}"></i></div>
      <div>
        <p class="market-name">${m.name}</p>
        <p class="market-desc">${m.desc}</p>
      </div>
    </div>
  `).join('');
}

function renderBudget(){
  const list = document.getElementById('budgetList');
  list.innerHTML = budgetItems.map(b=>`
    <div class="budget-row">
      <div class="budget-icon"><i class="fa-solid ${b.icon}"></i></div>
      <div class="budget-label">${b.label}<div class="budget-sub">${b.sub}</div></div>
      <div class="budget-amount">${b.amount}</div>
    </div>
  `).join('');
  document.getElementById('budgetTotal').innerHTML = `
    <span class="bt-label">총 예상비용 (2인 기준)</span>
    <span class="bt-value">약 135만원</span>
  `;
}

function renderChecklist(){
  const grid = document.getElementById('checklistGrid');
  const saved = JSON.parse(localStorage.getItem('jeju_checklist') || '{}');
  grid.innerHTML = checklistItems.map((t,i)=>`
    <div class="check-item ${saved[i]?'checked':''}" data-i="${i}">
      <span class="box"><i class="fa-solid fa-check" style="${saved[i]?'':'display:none;'}"></i></span>
      <span class="label">${t}</span>
    </div>
  `).join('');
  grid.querySelectorAll('.check-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      item.classList.toggle('checked');
      const isChecked = item.classList.contains('checked');
      item.querySelector('.box i').style.display = isChecked ? '' : 'none';
      const saved = JSON.parse(localStorage.getItem('jeju_checklist') || '{}');
      saved[item.dataset.i] = isChecked;
      localStorage.setItem('jeju_checklist', JSON.stringify(saved));
      updateChecklistProgress();
    });
  });
  updateChecklistProgress();
}

function updateChecklistProgress(){
  const items = document.querySelectorAll('.check-item');
  const checked = document.querySelectorAll('.check-item.checked').length;
  const pct = items.length ? Math.round((checked/items.length)*100) : 0;
  document.getElementById('checklistProgress').style.width = pct + '%';
}

/* --------------------------------------------------------------------------
   지도 (Leaflet)
   -------------------------------------------------------------------------- */
let leafletMap, markerLayer;

function renderMapFilter(){
  const wrap = document.getElementById('mapDayFilter');
  const days = ['전체','DAY 1','DAY 2','DAY 3','DAY 4'];
  wrap.innerHTML = days.map((d,i)=>`<button class="map-chip ${i===0?'active':''}" data-idx="${i-1}">${d}</button>`).join('');
  wrap.querySelectorAll('.map-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      wrap.querySelectorAll('.map-chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      drawMapMarkers(Number(chip.dataset.idx));
    });
  });
}

// 일정 날짜별로 대략 매핑되는 관광지 id 그룹 (지도 필터용)
const dayToSpots = {
  0: ['hamdeok'],
  1: ['hamdeok'],
  2: ['hamdeok','gimnyeong','woljeongri','sehwa','bijarim','seowoobong'],
  3: ['taeutgae','olle5','gongcheonpo','dodubong','iho','dongmun'],
};

function initMap(){
  leafletMap = L.map('leafletMap', { scrollWheelZoom:false }).setView([33.45, 126.65], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:18, attribution:'&copy; OpenStreetMap contributors'
  }).addTo(leafletMap);
  markerLayer = L.layerGroup().addTo(leafletMap);
  drawMapMarkers(-1);
}

function drawMapMarkers(dayIdx){
  markerLayer.clearLayers();

  // 숙소는 필터와 무관하게 항상 표시
  const homeMarker = L.marker([accommodation.lat, accommodation.lng], {
    icon: L.divIcon({
      className:'', html:'<div style="background:#FF7A47;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3);"><i class="fa-solid fa-house" style="transform:rotate(45deg);color:#fff;font-size:11px;"></i></div>',
      iconSize:[26,26], iconAnchor:[13,26]
    })
  }).addTo(markerLayer);
  homeMarker.bindPopup(`<div class="map-popup-title">${accommodation.name}</div><div class="map-popup-row"><i class="fa-solid fa-house"></i> ${accommodation.desc}</div>`);

  const ids = dayIdx===-1 ? spots.map(s=>s.id) : dayToSpots[dayIdx];
  const filtered = spots.filter(s=>ids.includes(s.id));
  const latlngs = [[accommodation.lat, accommodation.lng]];
  filtered.forEach(s=>{
    const marker = L.circleMarker([s.lat,s.lng], {
      radius:9, color:'#0B6E58', weight:2, fillColor:'#149C82', fillOpacity:0.85
    }).addTo(markerLayer);
    marker.bindPopup(`
      <div class="map-popup-title">${s.name}</div>
      <div class="map-popup-row"><i class="fa-solid fa-clock"></i> 추천 체류 ${s.stay}</div>
      <div class="map-popup-row"><i class="fa-solid fa-camera"></i> ${s.photospot}</div>
      <div class="map-popup-row"><i class="fa-solid fa-signs-post"></i> 추천 시간 ${s.bestTime}</div>
    `);
    latlngs.push([s.lat,s.lng]);
  });
  if(dayIdx!==-1 && latlngs.length>1){
    L.polyline(latlngs, {color:'#FF7A47', weight:3, dashArray:'6 8'}).addTo(markerLayer);
  }
  if(latlngs.length){
    leafletMap.fitBounds(latlngs, {padding:[30,30]});
  }
}

/* --------------------------------------------------------------------------
   ③ 공통 인터랙션
   -------------------------------------------------------------------------- */

function openDetailSheet(){
  document.getElementById('detailScrim').classList.add('show');
  document.getElementById('detailSheet').classList.add('show');
}
function closeDetailSheet(){
  document.getElementById('detailScrim').classList.remove('show');
  document.getElementById('detailSheet').classList.remove('show');
}

function initInteractions(){
  // 로딩 화면 제거
  window.addEventListener('load', ()=>{
    setTimeout(()=> document.getElementById('loader').classList.add('hide'), 400);
  });

  // 스티키 헤더
  const header = document.getElementById('stickyHeader');
  window.addEventListener('scroll', ()=>{
    header.classList.toggle('solid', window.scrollY > 80);
  }, {passive:true});

  // 드로어
  const drawer = document.getElementById('drawer');
  const scrim = document.getElementById('drawerScrim');
  const openDrawer = ()=>{ drawer.classList.add('open'); scrim.classList.add('show'); };
  const closeDrawer = ()=>{ drawer.classList.remove('open'); scrim.classList.remove('show'); };
  document.getElementById('menuToggle').addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  document.querySelectorAll('[data-nav]').forEach(a=> a.addEventListener('click', closeDrawer));

  // 히어로 스크롤 버튼
  document.getElementById('heroScroll').addEventListener('click', ()=>{
    document.getElementById('itinerary').scrollIntoView({behavior:'smooth'});
  });

  // FAB
  const fab = document.getElementById('fab');
  const fabMenu = document.getElementById('fabMenu');
  fab.addEventListener('click', ()=>{
    fab.classList.toggle('open');
    fabMenu.classList.toggle('show');
  });
  document.getElementById('fabTop').addEventListener('click', ()=>{
    window.scrollTo({top:0, behavior:'smooth'});
    fab.classList.remove('open'); fabMenu.classList.remove('show');
  });
  document.querySelectorAll('.fab-menu-item[data-nav]').forEach(a=>{
    a.addEventListener('click', ()=>{ fab.classList.remove('open'); fabMenu.classList.remove('show'); });
  });

  // 상세 시트 닫기
  document.getElementById('detailClose').addEventListener('click', closeDetailSheet);
  document.getElementById('detailScrim').addEventListener('click', closeDetailSheet);

  // 하단 내비게이션 활성 상태 (IntersectionObserver)
  const bnItems = document.querySelectorAll('.bn-item');
  const sections = ['hero','itinerary','map','food','checklist'].map(id=>document.getElementById(id));
  const shDay = document.getElementById('shDay');
  const dayAnchors = ['d1-group','d2-group','d3-group','d4-group'];

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        bnItems.forEach(b=> b.classList.toggle('active', b.dataset.bn===id));
      }
    });
  }, {rootMargin:'-40% 0px -50% 0px'});
  sections.forEach(s=> s && io.observe(s));

  const dayIo = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const idx = dayAnchors.indexOf(entry.target.id);
        if(idx>-1) shDay.textContent = 'DAY ' + (idx+1);
      }
    });
  }, {rootMargin:'-30% 0px -60% 0px'});
  setTimeout(()=>{
    dayAnchors.forEach(id=>{ const el=document.getElementById(id); el && dayIo.observe(el); });
  }, 300);
}

function initHeroAnimation(){
  if(typeof gsap === 'undefined') return;
  gsap.from('.hero-eyebrow', {opacity:0, y:-16, duration:.8, delay:.2});
  gsap.from('.hero-title span', {opacity:0, y:24, duration:.9, delay:.35, stagger:.12});
  gsap.from('.hero-date', {opacity:0, y:16, duration:.8, delay:.7});
  gsap.from('.hero-tagline', {opacity:0, y:16, duration:.8, delay:.85});
}

/* --------------------------------------------------------------------------
   초기화
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  renderDayTabs();
  renderTimeline();
  renderSpotGrid();
  renderFoodFilter();
  renderFoodCarousel();
  renderCafeFilter();
  renderCafeGrid();
  renderScooter();
  renderHallasan();
  renderMarket();
  renderBudget();
  renderChecklist();
  renderMapFilter();
  initMap();
  initInteractions();
  initHeroAnimation();

  if(typeof AOS !== 'undefined'){
    AOS.init({ duration:600, once:true, offset:40 });
  }
});
