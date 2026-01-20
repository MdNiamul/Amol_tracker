export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerStatus {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export type AmalName = 'tahajjud' | 'quran' | 'dhikr' | 'sadaqah' | 'dua';

export interface AmalStatus {
  tahajjud: boolean;
  quran: boolean;
  dhikr: boolean;
  sadaqah: boolean;
  dua: boolean;
}

export interface DayRecord {
  date: string; // ISO date string YYYY-MM-DD
  prayers: PrayerStatus;
  amals: AmalStatus;
}

export interface TrackerStats {
  currentStreak: number;
  longestStreak: number;
  totalPrayers: number;
  totalAmals: number;
  completionRate: number;
}
