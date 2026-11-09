import {
  NichinanSpot,
  ModelCourse,
  CourseStep,
  StartLocationId,
  TransportMode,
  TripDuration,
  TripPreference,
} from '../types';
import { nichinanSpotsData } from '../data/initialData';

export interface LocationPreset {
  id: StartLocationId;
  name: string;
  shortLabel: string;
  lat: number;
  lng: number;
  description: string;
}

export const START_LOCATION_PRESETS: LocationPreset[] = [
  {
    id: 'miyazaki_airport',
    name: '宮崎空港・宮崎市内・青島方面から（国道220号北側）',
    shortLabel: '宮崎空港・青島方面',
    lat: 31.875,
    lng: 131.428,
    description: '宮崎市街・空港から日南海岸へドライブで南下するスタート地点',
  },
  {
    id: 'nichinan_coast',
    name: '鵜戸・日南海岸エリア（サンメッセ・鵜戸神宮付近）',
    shortLabel: '鵜戸・日南海岸',
    lat: 31.65,
    lng: 131.467,
    description: '日南海岸の絶景オーシャンビューが広がる海岸線の中心地',
  },
  {
    id: 'obi_castle',
    name: '飫肥（おび）城下町・飫肥駅周辺',
    shortLabel: '飫肥城下町エリア',
    lat: 31.626,
    lng: 131.353,
    description: '「九州の小京都」と呼ばれる飫肥城や武家屋敷が並ぶ歴史の街',
  },
  {
    id: 'aburatsu_port',
    name: '油津港・油津駅・堀川運河周辺',
    shortLabel: '油津港・商店街',
    lat: 31.583,
    lng: 131.398,
    description: '赤レンガ倉庫や堀川運河、新鮮なカツオ料理が集まる港町',
  },
  {
    id: 'nango_station',
    name: '南郷駅・道の駅なんごう・目井津港周辺',
    shortLabel: '南郷・道の駅エリア',
    lat: 31.533,
    lng: 131.378,
    description: 'マンゴーの里、エメラルドグリーンの島々、海辺の温泉が自慢の南端エリア',
  },
];

// Spot coordinates lookup
export const SPOT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'spot-sunmesse': { lat: 31.652, lng: 131.467 },
  'spot-udo-shrine': { lat: 31.649, lng: 131.466 },
  'spot-obi-castle': { lat: 31.628, lng: 131.355 },
  'spot-ocean-kayak': { lat: 31.691, lng: 131.474 },
  'spot-aburatsu-bar': { lat: 31.584, lng: 131.399 },
  'spot-nango-onsen': { lat: 31.531, lng: 131.379 },
  'spot-katsuo-aburi': { lat: 31.588, lng: 131.397 },
  'spot-stargazing-tour': { lat: 31.528, lng: 131.395 },
  'spot-michi-nango': { lat: 31.523, lng: 131.385 },
  'spot-inohae-valley': { lat: 31.692, lng: 131.365 },
  'spot-horikawa-canal': { lat: 31.584, lng: 131.396 },
};

// Haversine distance in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Find nearest starting preset from GPS coordinates
export function findNearestPreset(userLat: number, userLng: number): { preset: LocationPreset; distanceKm: number } {
  let nearest = START_LOCATION_PRESETS[0];
  let minDistance = calculateDistanceKm(userLat, userLng, nearest.lat, nearest.lng);

  for (const preset of START_LOCATION_PRESETS) {
    const dist = calculateDistanceKm(userLat, userLng, preset.lat, preset.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = preset;
    }
  }

  return { preset: nearest, distanceKm: minDistance };
}

// Generate Google Maps Directions URL
export function generateGoogleMapsRouteUrl(startLocationName: string, spotIds: string[]): string {
  const spots = spotIds
    .map((id) => nichinanSpotsData.find((s) => s.id === id))
    .filter((s): s is NichinanSpot => Boolean(s));

  if (spots.length === 0) return 'https://www.google.com/maps';

  const origin = encodeURIComponent(startLocationName || spots[0].googleMapQuery);
  const destination = encodeURIComponent(spots[spots.length - 1].googleMapQuery);
  const waypoints = spots
    .slice(0, -1)
    .map((s) => encodeURIComponent(s.googleMapQuery))
    .join('|');

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
}

// Curated Preset Recommended Courses
export const CURATED_PRESET_COURSES: ModelCourse[] = [
  {
    id: 'course-nichinan-classic-1day',
    title: '日南ブルー定番！モアイ＆鵜戸神宮と小京都飫肥 1日満喫ドライブ',
    catchphrase: '太平洋の絶景パノラマから名物カツオ炙り重、江戸情緒の城下町まで王道を凝縮！',
    description: '日南を初めて訪れる方に最もおすすめの黄金ルート。午前は海と空の雄大な絶景、お昼は七輪で炙る一本釣りカツオ、午後は九州の小京都・飫肥を散策します。',
    duration: 'full_day',
    durationLabel: '1日（約7時間）',
    estimatedTotalHours: '約 7.0 時間',
    recommendedTransport: 'レンタカー・車（推奨）',
    totalDistanceKm: 34.5,
    estimatedBudgetAdult: 4200,
    tags: ['王道定番', '絶景オーシャンビュー', '名物グルメ', '歴史町歩き'],
    startLocationName: '宮崎空港・青島方面（北側）',
    highlights: [
      '完全復刻のモアイ像7体と太平洋の大パノラマ（サンメッセ日南）',
      '断崖洞窟の朱塗り本殿で運玉投げ祈願（鵜戸神宮）',
      '日本一の日南一本釣りカツオ炙り重ランチ（磯料理 びび）',
      '重厚な大手門と鯉が泳ぐ武家屋敷通りの散策（飫肥城下町）',
    ],
    steps: [
      {
        spotId: 'spot-sunmesse',
        timeSlot: '09:30 - 11:00',
        durationMinutes: 90,
        activityNote: 'モアイ像の前で記念撮影＆園内ラウンドカートで青い海を見下ろす丘の上へドライブ',
        transferNoteBefore: '宮崎方面より国道220号（日南海岸フェニックスロード）を南下',
        transferMinutesBefore: 30,
      },
      {
        spotId: 'spot-udo-shrine',
        timeSlot: '11:15 - 12:15',
        durationMinutes: 60,
        activityNote: '海食洞窟に鎮座する朱塗り本殿を参拝。崖下の「亀石」枡形へ運玉を投げ入れる名物祈願！',
        transferNoteBefore: '車で約10分（日南海岸を南へ）',
        transferMinutesBefore: 10,
      },
      {
        spotId: 'spot-katsuo-aburi',
        timeSlot: '12:45 - 14:00',
        durationMinutes: 75,
        activityNote: '新鮮な一本釣りカツオを卓上七輪で炙り、特製タレと最後はお茶漬けで三度愉しむご当地ランチ',
        transferNoteBefore: '車で約20分（油津港方面へ移動）',
        transferMinutesBefore: 20,
      },
      {
        spotId: 'spot-obi-castle',
        timeSlot: '14:20 - 16:30',
        durationMinutes: 130,
        activityNote: '飫肥杉の並木と石垣、武家屋敷を歩く。名物「飫肥天」や「厚焼玉子」の食べあるきMAPを活用！',
        transferNoteBefore: '車で約15分（飫肥城下町へ）',
        transferMinutesBefore: 15,
      },
    ],
  },
  {
    id: 'course-nichinan-night-stars',
    title: '夕景マジックアワーから海辺の星空温泉＆ナイトバル 贅沢トワイライトコース',
    catchphrase: '茜色に染まる水平線、波音を聞く露天風呂、満天の星と地ビールに酔いしれる夜の旅',
    description: '日南の夜の魅力を存分に楽しむ特別なコース。夕暮れの海岸ドライブから、赤レンガ倉庫のナイトバル、海辺の星空露天風呂と天の川観賞まで日南ナイトを満喫します。',
    duration: 'night_stay',
    durationLabel: '夕方〜夜（約6時間）',
    estimatedTotalHours: '約 6.0 時間',
    recommendedTransport: '車 または タクシー利用',
    totalDistanceKm: 28.0,
    estimatedBudgetAdult: 6400,
    tags: ['夕景サンセット', '夜温泉', 'クラフトビール', '星空・天の川'],
    startLocationName: '油津港・油津駅周辺',
    highlights: [
      'ガス灯が灯る石造り運河のノスタルジック散策（堀川運河）',
      '大正ロマン赤レンガ倉庫テラスで宮崎クラフトビールと鮮魚料理（Yotten）',
      '波音を聞き星空を仰ぐ太平洋一望の天然美肌温泉（南郷温泉）',
      '街明かりのないビーチで寝転んで見上げる大パノラマの天の川（栄松ビーチ）',
    ],
    steps: [
      {
        spotId: 'spot-horikawa-canal',
        timeSlot: '16:30 - 17:30',
        durationMinutes: 60,
        activityNote: '夕暮れ時の堀川運河と乙姫橋を散策。映画の舞台にもなったノスタルジックな石造りの景色を堪能',
        transferNoteBefore: '油津駅・港周辺からすぐ',
        transferMinutesBefore: 5,
      },
      {
        spotId: 'spot-aburatsu-bar',
        timeSlot: '17:45 - 19:15',
        durationMinutes: 90,
        activityNote: 'ライトアップされた赤レンガ倉庫前のテラス席で、日南クラフトビール飲み比べと地元鮮魚ディナー',
        transferNoteBefore: '徒歩約5分（運河沿い）',
        transferMinutesBefore: 5,
      },
      {
        spotId: 'spot-nango-onsen',
        timeSlot: '19:40 - 20:45',
        durationMinutes: 65,
        activityNote: '夜風を感じながら太平洋を望む天然温泉露天風呂へ。湯上がりは肌がすべすべになる美肌の湯',
        transferNoteBefore: '車で約15分（南郷海岸へ南下）',
        transferMinutesBefore: 15,
      },
      {
        spotId: 'spot-stargazing-tour',
        timeSlot: '21:00 - 22:15',
        durationMinutes: 75,
        activityNote: '星空ソムリエの解説とともに、リクライニングチェアで満天の星と天の川を眺める贅沢な静寂体験',
        transferNoteBefore: '車で約10分（栄松ビーチ特設デッキへ）',
        transferMinutesBefore: 10,
      },
    ],
  },
  {
    id: 'course-nature-activity-refresh',
    title: 'エメラルドグリーンの海と苔の渓谷！アクティブ＆森林セラピー癒やし旅',
    catchphrase: '透明度抜群のクリアSUPで海を満喫し、300種の苔が息づく渓谷でマイナスイオン深呼吸！',
    description: '日南の豊かな自然を五感で体感するリフレッシュコース。午前は青い海をクリアSUPでクルーズ、午後はジャカランダの丘と原生林の猪八重渓谷で森林浴を楽しみます。',
    duration: 'full_day',
    durationLabel: '1日（約6.5時間）',
    estimatedTotalHours: '約 6.5 時間',
    recommendedTransport: 'レンタカー・車',
    totalDistanceKm: 42.0,
    estimatedBudgetAdult: 5500,
    tags: ['SUP・マリン', '森林セラピー', '大自然リフレッシュ', '南国スイーツ'],
    startLocationName: '日南海岸エリア',
    highlights: [
      '透き通る日南の海を海上散歩する爽快クリアSUP体験（富土ビーチ）',
      '碧い海を見下ろす丘で名物完熟マンゴーソフト（道の駅なんごう）',
      '環境省認定の森林セラピー基地・清流と滝の苔トレッキング（猪八重渓谷）',
    ],
    steps: [
      {
        spotId: 'spot-ocean-kayak',
        timeSlot: '09:30 - 11:30',
        durationMinutes: 120,
        activityNote: 'ガイド付きのクリアSUP体験。海底の魚や珊瑚が透けて見えるエメラルドグリーンの海上をクルーズ！',
        transferNoteBefore: '日南海岸ビーチベース集合',
        transferMinutesBefore: 15,
      },
      {
        spotId: 'spot-michi-nango',
        timeSlot: '12:15 - 13:45',
        durationMinutes: 90,
        activityNote: '南国パノラマ展望レストランで海鮮丼ランチ＆濃厚な日南産完熟マンゴーソフトクリームを堪能',
        transferNoteBefore: '車で約30分（日南海岸を南へドライブ）',
        transferMinutesBefore: 30,
      },
      {
        spotId: 'spot-inohae-valley',
        timeSlot: '14:30 - 16:30',
        durationMinutes: 120,
        activityNote: '木漏れ日とマイナスイオンが降り注ぐ清流の苔散策。貴重な苔の絨毯と美しい滝に癒やされるトレッキング',
        transferNoteBefore: '車で約35分（北郷の山あいの渓谷へ）',
        transferMinutesBefore: 35,
      },
    ],
  },
  {
    id: 'course-half-day-highlights',
    title: 'サクッと半日！日南名所スピードダイジェスト',
    catchphrase: '限られた時間でも大満足！サンメッセ日南＆鵜戸神宮の2大名勝を効率よくめぐる半日プラン',
    description: 'ドライブの途中やフライト前後の約3.5時間で、日南の代表的な2大パワースポットを凝縮して巡るコンパクトなプランです。',
    duration: 'half_day',
    durationLabel: '半日（約3.5時間）',
    estimatedTotalHours: '約 3.5 時間',
    recommendedTransport: 'レンタカー・車 または 観光バス',
    totalDistanceKm: 16.0,
    estimatedBudgetAdult: 1000,
    tags: ['半日ショート', '絶景', 'パワースポット', '初心者向け'],
    startLocationName: '宮崎空港・日南海岸北側',
    highlights: [
      '完全復刻のモアイ像と太平洋オーシャンビュー（サンメッセ日南）',
      '波打ち際の洞窟神社と名物運玉投げ（鵜戸神宮）',
    ],
    steps: [
      {
        spotId: 'spot-sunmesse',
        timeSlot: '10:00 - 11:45',
        durationMinutes: 105,
        activityNote: 'モアイ像7体との記念写真や丘の上の絶景ブランコ。南国の風を感じながら園内を散策',
        transferNoteBefore: '宮崎方面より国道220号南下',
        transferMinutesBefore: 20,
      },
      {
        spotId: 'spot-udo-shrine',
        timeSlot: '12:00 - 13:30',
        durationMinutes: 90,
        activityNote: '荒波の打ち寄せる岩窟の中へ。朱塗り本殿で参拝し、亀石の背中に運玉を投げ入れる運試し！',
        transferNoteBefore: '車で約10分',
        transferMinutesBefore: 10,
      },
    ],
  },
];

// Dynamic Smart Model Course Generator
export function generateSmartCourse(params: {
  startLocationId: StartLocationId;
  gpsCoords?: { latitude: number; longitude: number };
  duration: TripDuration;
  transport: TransportMode;
  preferences: TripPreference[];
  startTime?: string;
}): ModelCourse {
  const { startLocationId, gpsCoords, duration, transport, preferences, startTime = '09:30' } = params;

  // Determine actual starting point and base coordinates
  let startPreset = START_LOCATION_PRESETS.find((p) => p.id === startLocationId) || START_LOCATION_PRESETS[0];
  let startDisplayName = startPreset.shortLabel;

  if (startLocationId === 'current_gps' && gpsCoords) {
    const nearest = findNearestPreset(gpsCoords.latitude, gpsCoords.longitude);
    startPreset = nearest.preset;
    startDisplayName = `現在地付近（最寄：${nearest.preset.shortLabel}）`;
  }

  // Determine maximum stops based on duration
  const maxStops = duration === 'half_day' ? 2 : duration === 'full_day' ? 4 : 5;

  // Score spots based on preferences and start location proximity
  const scoredSpots = nichinanSpotsData.map((spot) => {
    let score = 0;
    const coords = SPOT_COORDINATES[spot.id] || { lat: startPreset.lat, lng: startPreset.lng };
    const distToStart = calculateDistanceKm(startPreset.lat, startPreset.lng, coords.lat, coords.lng);

    // Proximity score: closer spots are favored initially
    score += Math.max(0, 40 - distToStart);

    // Preference matching
    if (preferences.includes('scenic') && spot.category === 'sightseeing') score += 35;
    if (preferences.includes('historic') && spot.category === 'historic') score += 35;
    if (preferences.includes('gourmet') && spot.category === 'gourmet') score += 35;
    if (preferences.includes('night_stars') && (spot.category === 'onsen' || spot.id === 'spot-stargazing-tour' || spot.id === 'spot-aburatsu-bar')) score += 40;
    if (preferences.includes('activity') && spot.category === 'experience') score += 35;
    if (preferences.includes('family') && (spot.id === 'spot-sunmesse' || spot.id === 'spot-udo-shrine' || spot.id === 'spot-michi-nango')) score += 30;

    // Time-of-day suitability for duration
    if (duration === 'night_stay' && spot.timeSuitability.includes('night')) score += 30;
    if (duration === 'half_day' && (spot.id === 'spot-sunmesse' || spot.id === 'spot-udo-shrine')) score += 20;

    return { spot, score, coords, distToStart };
  });

  // Sort by score
  scoredSpots.sort((a, b) => b.score - a.score);

  // Pick diverse spots
  const selectedSpots: NichinanSpot[] = [];
  const selectedCategories = new Set<string>();

  for (const item of scoredSpots) {
    if (selectedSpots.length >= maxStops) break;
    // Don't duplicate categories unless needed
    if (!selectedCategories.has(item.spot.category) || selectedSpots.length >= 3) {
      selectedSpots.push(item.spot);
      selectedCategories.add(item.spot.category);
    }
  }

  // Fill up if fewer than maxStops
  if (selectedSpots.length < maxStops) {
    for (const item of scoredSpots) {
      if (!selectedSpots.some((s) => s.id === item.spot.id)) {
        selectedSpots.push(item.spot);
        if (selectedSpots.length >= maxStops) break;
      }
    }
  }

  // Order spots by geographical chain from starting location
  const orderedSpots: NichinanSpot[] = [];
  let currentLat = startPreset.lat;
  let currentLng = startPreset.lng;
  const remaining = [...selectedSpots];

  while (remaining.length > 0) {
    let nearestIndex = 0;
    let minD = 9999;
    for (let i = 0; i < remaining.length; i++) {
      const c = SPOT_COORDINATES[remaining[i].id] || { lat: currentLat, lng: currentLng };
      const d = calculateDistanceKm(currentLat, currentLng, c.lat, c.lng);
      if (d < minD) {
        minD = d;
        nearestIndex = i;
      }
    }
    const nextSpot = remaining.splice(nearestIndex, 1)[0];
    orderedSpots.push(nextSpot);
    const nextCoords = SPOT_COORDINATES[nextSpot.id] || { lat: currentLat, lng: currentLng };
    currentLat = nextCoords.lat;
    currentLng = nextCoords.lng;
  }

  // Calculate timelines and step details
  const [startHour, startMin] = startTime.split(':').map(Number);
  let currentClockMinutes = (startHour || 9) * 60 + (startMin || 30);
  let totalDistance = 0;
  let totalBudget = 0;

  const steps: CourseStep[] = [];
  let prevLat = startPreset.lat;
  let prevLng = startPreset.lng;

  for (let i = 0; i < orderedSpots.length; i++) {
    const spot = orderedSpots[i];
    const spotCoords = SPOT_COORDINATES[spot.id] || { lat: prevLat, lng: prevLng };
    const stepDist = calculateDistanceKm(prevLat, prevLng, spotCoords.lat, spotCoords.lng);
    totalDistance += stepDist;

    // Transfer time based on transport mode
    const speedKmH = transport === 'car' ? 38 : transport === 'bus' ? 24 : 14;
    const transferMins = Math.max(10, Math.round((stepDist / speedKmH) * 60));
    currentClockMinutes += transferMins;

    const startH = Math.floor(currentClockMinutes / 60);
    const startM = currentClockMinutes % 60;
    const durationMins = spot.requiresReservation ? 75 : 60;
    const endClockMins = currentClockMinutes + durationMins;
    const endH = Math.floor(endClockMins / 60);
    const endM = endClockMins % 60;

    const formatTime = (h: number, m: number) =>
      `${String(h % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const timeSlot = `${formatTime(startH, startM)} - ${formatTime(endH, endM)}`;
    currentClockMinutes = endClockMins;

    // Add budget
    totalBudget += (spot.reservationPriceAdult || 0);

    const transferNote =
      i === 0
        ? `${startDisplayName}から${transport === 'car' ? '車' : transport === 'bus' ? 'バス' : '自転車'}で約${transferMins}分（約${stepDist}km）`
        : `前のスポットから${transport === 'car' ? '車' : transport === 'bus' ? 'バス' : '自転車'}で約${transferMins}分（約${stepDist}km）`;

    steps.push({
      spotId: spot.id,
      timeSlot,
      durationMinutes: durationMins,
      activityNote: spot.daytimeHighlight || spot.description.slice(0, 50) + '...',
      transferNoteBefore: transferNote,
      transferMinutesBefore: transferMins,
    });

    prevLat = spotCoords.lat;
    prevLng = spotCoords.lng;
  }

  // Create catchy dynamic title
  const prefNames = preferences.map((p) => {
    switch (p) {
      case 'scenic':
        return '絶景';
      case 'historic':
        return '歴史・城下町';
      case 'gourmet':
        return '名物グルメ';
      case 'night_stars':
        return '夜景・星空';
      case 'activity':
        return 'アクティビティ';
      case 'family':
        return 'ファミリー';
    }
  });

  const durationName = duration === 'half_day' ? '半日コース' : duration === 'full_day' ? '1日満喫コース' : 'ナイト探訪＆ステイコース';
  const transportName = transport === 'car' ? 'ドライブ' : transport === 'bus' ? 'バス旅' : 'ポタリング';
  const title = `【${startDisplayName}発】日南${prefNames.slice(0, 2).join('＆') || '名所'} ${durationName}（${transportName}）`;
  const catchphrase = `${startDisplayName}からスタートし、${orderedSpots.map((s) => s.name).slice(0, 3).join('・')}をスムーズに巡る最適ルート！`;

  const totalHours = Math.round((totalDistance / (transport === 'car' ? 35 : 18) + (steps.length * 1.2)) * 10) / 10;

  return {
    id: `custom-course-${Date.now()}`,
    title,
    catchphrase,
    description: `あなたの出発地「${startDisplayName}」と好みに合わせて自動編成された日南観光モデルコースです。無駄な往復を抑えた順路設計で、${transportName}に最適なスケジュールです。`,
    duration,
    durationLabel: durationName,
    estimatedTotalHours: `約 ${totalHours} 時間`,
    recommendedTransport: transport === 'car' ? 'レンタカー・自家用車' : transport === 'bus' ? '路線バス・観光周遊バス' : '自転車・E-Bike',
    totalDistanceKm: Math.round(totalDistance * 10) / 10,
    estimatedBudgetAdult: totalBudget > 0 ? totalBudget : 1500,
    tags: [startDisplayName, durationName, transportName, ...prefNames],
    startLocationName: startDisplayName,
    steps,
    highlights: orderedSpots.map((s) => `${s.name}（${s.area}）: ${s.daytimeHighlight.slice(0, 45)}`),
  };
}
