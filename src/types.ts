export type WasteStreamType = 'plastic' | 'metal' | 'paper' | 'organic' | 'glass' | 'specialist';

export interface UserEcoProfile {
  id: string;
  name: string;
  email: string;
  userCode: string; // e.g. "SW-RO-84920" - scanned at any public bin
  pinCode: string; // 4-digit PIN for touchscreen entry at public bins
  points: number;
  streakDays: number;
  totalItemsRecycled: number;
  totalWeightKg: number;
  co2SavedKg: number;
  treesPlanted: number;
  totalDonatedRon: number;
  pointsDonated: number;
  tier: 'Eco Scout' | 'Green Guardian' | 'Circular Champion';
  isAuthenticated: boolean;
  memberSince: string;
  hasClaimedDailyToday: boolean;
  dailyCheckInDay: number; // 1 to 7
}

export interface SmartBinLocation {
  id: string;
  name: string;
  city: 'Bucharest' | 'Cluj-Napoca';
  address: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  distanceMeters: number;
  walkingMin: number;
  isOpen24h: boolean;
  isWheelchairAccessible: boolean;
  status: 'available' | 'nearly_full' | 'full';
  streams: {
    type: WasteStreamType;
    label: string;
    fillPercent: number;
    color: string;
  }[];
}

export interface CollectionTruckInfo {
  id: string;
  licensePlate: string;
  driverName: string;
  city: 'Bucharest' | 'Cluj-Napoca';
  currentCoordinates: { x: number; y: number };
  targetStopIndex: number;
  capacityUsedPercent: number;
  status: 'en_route' | 'servicing' | 'depot_bound';
  nextStopName: string;
  nextStopEtaMin: number;
  routeProgressPercent: number;
  stops: {
    binId: string;
    stopName: string;
    estimatedArrivalMin: number;
    isServiced: boolean;
    coordinates: { x: number; y: number };
  }[];
}

export interface RecognizedItem {
  id: string;
  name: string;
  category: WasteStreamType;
  streamName: string;
  binColor: string;
  confidence: number;
  points: number;
  weightG: number;
  preparationTip: string;
  canRecycle: boolean;
  specialWarning?: string;
}

export interface DepositHistoryItem {
  id: string;
  timestamp: string;
  itemName: string;
  category: WasteStreamType;
  binName: string;
  pointsEarned: number;
  weightG: number;
  co2SavedKg: number;
  userCodeUsed: string;
}

export interface RewardItem {
  id: string;
  title: string;
  partnerName: string;
  category: 'transit' | 'food' | 'student' | 'eco' | 'store';
  pointsCost: number;
  expiryDays: number;
  iconName: string;
  valueRon: string;
  description: string;
  terms: string;
}

export interface RedeemedVoucher {
  id: string;
  rewardId: string;
  title: string;
  partnerName: string;
  code: string;
  redeemedAt: string;
  expiresAt: string;
  isUsed: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  city: 'Bucharest' | 'Cluj-Napoca';
  date: string;
  time: string;
  location: string;
  participants: number;
  pointsBonus: number;
  organizer: string;
  description: string;
  isRsvp: boolean;
}

export interface CommunityProgramDonation {
  id: string;
  title: string;
  titleRo: string;
  category: 'roma_academy' | 'micro_coop' | 'youth_tech' | 'urban_trees';
  raisedRon: number;
  targetRon: number;
  partner: string;
  summary: string;
  donorCount: number;
}

export interface DonationReceipt {
  id: string;
  programId: string;
  programTitle: string;
  donorEmail: string;
  amountRon: number;
  pointsUsed?: number;
  paymentMethod: 'card' | 'points';
  cardLast4?: string;
  timestamp: string;
  taxDeductibleCode: string;
}

export interface DonorLeaderboardItem {
  rank: number;
  name: string;
  city: string;
  totalDonatedRon: number;
  pointsDonated: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface EmergencyAlert {
  id: string;
  type: 'bin_warning' | 'login_notice' | 'fleet_update';
  title: string;
  message: string;
  badge: string;
  timestamp: string;
}

export interface UserAppSettings {
  language: 'RO' | 'EN';
  activeCity: 'Bucharest' | 'Cluj-Napoca';
  notifications: {
    binServicedAlert: boolean;
    truckNearbyAlert: boolean;
    streakReminder: boolean;
    communityEvents: boolean;
  };
  privacy: {
    anonymousLeaderboard: boolean;
    onDeviceVisionOnly: boolean;
    shareTelemetry: boolean;
  };
  accessibility: {
    highContrast: boolean;
    soundEffects: boolean;
    largeFont: boolean;
  };
}

export interface EcoTip {
  id: string;
  title: string;
  category: string;
  text: string;
  readTime: string;
}
