export type TimeTheme = 'day' | 'sunset' | 'night';

export type SpotTimeFilter = 'all' | 'day' | 'sunset' | 'night';

export type SpotCategory = 'sightseeing' | 'experience' | 'gourmet' | 'onsen' | 'historic';

export type CongestionLevel = 'smooth' | 'moderate' | 'busy';

export interface LiveCongestionInfo {
  level: CongestionLevel;
  statusText: '空いています' | 'やや混雑' | '混雑気味';
  waitingMinutesEstimate: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  lastUpdated: string;
  crowdPercentage: number; // 0 ~ 100%
  parkingStatus: 'vacant' | 'moderate' | 'full';
  parkingText: string;
  congestionReason: string;
  googleMapsTrafficUrl: string;
}

export interface NichinanSpot {
  id: string;
  name: string;
  kana: string;
  category: SpotCategory;
  categoryLabel: string;
  area: string; // e.g. '鵜戸・日南海岸エリア', '飫肥（おび）エリア', '油津港エリア', '南郷エリア'
  timeSuitability: ('day' | 'sunset' | 'night')[]; // 昼・夕・夜のどれに適しているか
  requiresReservation: boolean; // 予約が必要かどうか
  reservationPriceAdult?: number;
  reservationPriceChild?: number;
  reservationOptions?: string[]; // e.g. ["カート利用付き", "お食事付き"]
  daytimeHighlight: string; // 昼の見どころ
  nighttimeHighlight: string; // 夜の見どころ・ライトアップ
  description: string;
  hours: string;
  nightHours?: string;
  address: string;
  phone: string;
  googleMapQuery: string;
  tags: string[];
  imageUrl?: string;
  imageEmoji: string;
  currentCongestion: CongestionLevel; // 混雑状況
}

export interface ScenicSlide {
  id: string;
  spotId: string;
  title: string;
  subTitle: string;
  area: string;
  imageUrl: string;
  tag: string;
  highlight: string;
  requiresReservation: boolean;
}

export interface OperationInfo {
  generalNotice: string;
  weatherCondition: string;
  lastUpdated: string;
  featuredTheme: string;
  sunsetTime: string;
  stargazingForecast: string;
}

export type SlotCategory = 'day' | 'sunset' | 'night';

export interface Reservation {
  id: string; // e.g. "NCN-20260903-8821"
  ticketNumber: string;
  spotId: string;
  spotName: string;
  customerName: string;
  phone: string;
  date: string; // YYYY-MM-DD
  slotCategory: SlotCategory;
  timeRange: string;
  adultCount: number;
  childCount: number;
  selectedOption?: string; // e.g. "カート確約" or "特製スイーツ付"
  totalAmount: number;
  paymentMethod: 'credit_card' | 'paypay' | 'local_pay';
  status: 'valid' | 'used' | 'cancelled';
  bookedAt: string;
  usedAt?: string;
}

export type StartLocationId =
  | 'miyazaki_airport'
  | 'nichinan_coast'
  | 'obi_castle'
  | 'aburatsu_port'
  | 'nango_station'
  | 'current_gps';

export type TransportMode = 'car' | 'bus' | 'bicycle';

export type TripDuration = 'half_day' | 'full_day' | 'night_stay';

export type TripPreference =
  | 'scenic'
  | 'historic'
  | 'gourmet'
  | 'night_stars'
  | 'activity'
  | 'family';

export interface CourseStep {
  spotId: string;
  timeSlot: string;
  durationMinutes: number;
  activityNote: string;
  transferNoteBefore?: string;
  transferMinutesBefore?: number;
}

export interface ModelCourse {
  id: string;
  title: string;
  catchphrase: string;
  description: string;
  duration: TripDuration;
  durationLabel: string;
  estimatedTotalHours: string;
  recommendedTransport: string;
  totalDistanceKm: number;
  estimatedBudgetAdult: number;
  tags: string[];
  startLocationName: string;
  steps: CourseStep[];
  highlights: string[];
}
