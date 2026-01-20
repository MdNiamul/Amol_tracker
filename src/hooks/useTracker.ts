import { useState, useEffect, useCallback } from 'react';
import { DayRecord, PrayerName, AmalName, PrayerStatus, AmalStatus, TrackerStats } from '@/types/tracker';
import { format, subDays, parseISO, differenceInDays, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const STORAGE_KEY = 'islamic-tracker-data';

const getDefaultPrayers = (): PrayerStatus => ({
  fajr: false,
  dhuhr: false,
  asr: false,
  maghrib: false,
  isha: false,
});

const getDefaultAmals = (): AmalStatus => ({
  tahajjud: false,
  quran: false,
  dhikr: false,
  sadaqah: false,
  dua: false,
});

export const useTracker = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase or localStorage
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      if (user) {
        // Load from Supabase
        const { data, error } = await supabase
          .from('tracker_records')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error loading tracker data:', error);
        } else if (data) {
          const formattedRecords: DayRecord[] = data.map(record => ({
            date: record.date,
            prayers: record.prayers as unknown as PrayerStatus,
            amals: record.amals as unknown as AmalStatus,
          }));
          setRecords(formattedRecords);
        }
      } else {
        // Load from localStorage for non-logged-in users
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setRecords(JSON.parse(stored));
          } catch (e) {
            console.error('Failed to parse stored data', e);
          }
        }
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  // Save to localStorage for non-logged-in users
  useEffect(() => {
    if (!user && records.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records, user]);

  const getDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

  const getRecordForDate = useCallback((date: Date): DayRecord => {
    const dateKey = getDateKey(date);
    const existing = records.find(r => r.date === dateKey);
    if (existing) return existing;
    return {
      date: dateKey,
      prayers: getDefaultPrayers(),
      amals: getDefaultAmals(),
    };
  }, [records]);

  const saveToSupabase = async (dateKey: string, prayers: PrayerStatus, amals: AmalStatus) => {
    if (!user) return;

    const { error } = await supabase
      .from('tracker_records')
      .upsert({
        user_id: user.id,
        date: dateKey,
        prayers: prayers as unknown as Record<string, boolean>,
        amals: amals as unknown as Record<string, boolean>,
      }, {
        onConflict: 'user_id,date',
      });

    if (error) {
      console.error('Error saving to Supabase:', error);
    }
  };

  const updatePrayer = useCallback((date: Date, prayer: PrayerName, completed: boolean) => {
    const dateKey = getDateKey(date);
    
    setRecords(prev => {
      const existing = prev.find(r => r.date === dateKey);
      let newRecords: DayRecord[];
      let newPrayers: PrayerStatus;
      let newAmals: AmalStatus;
      
      if (existing) {
        newPrayers = { ...existing.prayers, [prayer]: completed };
        newAmals = existing.amals;
        newRecords = prev.map(r => 
          r.date === dateKey 
            ? { ...r, prayers: newPrayers }
            : r
        );
      } else {
        newPrayers = { ...getDefaultPrayers(), [prayer]: completed };
        newAmals = getDefaultAmals();
        newRecords = [...prev, {
          date: dateKey,
          prayers: newPrayers,
          amals: newAmals,
        }];
      }
      
      // Save to Supabase if logged in
      if (user) {
        saveToSupabase(dateKey, newPrayers, newAmals);
      }
      
      return newRecords;
    });
  }, [user]);

  const updateAmal = useCallback((date: Date, amal: AmalName, completed: boolean) => {
    const dateKey = getDateKey(date);
    
    setRecords(prev => {
      const existing = prev.find(r => r.date === dateKey);
      let newRecords: DayRecord[];
      let newPrayers: PrayerStatus;
      let newAmals: AmalStatus;
      
      if (existing) {
        newPrayers = existing.prayers;
        newAmals = { ...existing.amals, [amal]: completed };
        newRecords = prev.map(r => 
          r.date === dateKey 
            ? { ...r, amals: newAmals }
            : r
        );
      } else {
        newPrayers = getDefaultPrayers();
        newAmals = { ...getDefaultAmals(), [amal]: completed };
        newRecords = [...prev, {
          date: dateKey,
          prayers: newPrayers,
          amals: newAmals,
        }];
      }
      
      // Save to Supabase if logged in
      if (user) {
        saveToSupabase(dateKey, newPrayers, newAmals);
      }
      
      return newRecords;
    });
  }, [user]);

  const getCompletionLevel = useCallback((date: Date): number => {
    const record = getRecordForDate(date);
    const prayerCount = Object.values(record.prayers).filter(Boolean).length;
    const amalCount = Object.values(record.amals).filter(Boolean).length;
    
    // Primary focus on prayers - 5 prayers = brightest green
    // Amals add bonus levels
    if (prayerCount === 0 && amalCount === 0) return 0;
    if (prayerCount === 0) return 1; // Only amals, light
    if (prayerCount <= 2) return 1;
    if (prayerCount <= 3) return 2;
    if (prayerCount === 4) return 3;
    if (prayerCount === 5 && amalCount === 0) return 4;
    if (prayerCount === 5) return 5; // All prayers + some amals = max
    return 0;
  }, [getRecordForDate]);

  const getStats = useCallback((): TrackerStats => {
    const today = startOfDay(new Date());
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let totalPrayers = 0;
    let totalAmals = 0;

    // Sort records by date
    const sortedRecords = [...records].sort((a, b) => 
      parseISO(b.date).getTime() - parseISO(a.date).getTime()
    );

    // Calculate current streak
    for (let i = 0; i < 365; i++) {
      const checkDate = subDays(today, i);
      const record = getRecordForDate(checkDate);
      const prayerCount = Object.values(record.prayers).filter(Boolean).length;
      
      if (prayerCount === 5) {
        if (i === 0 || currentStreak > 0) currentStreak++;
      } else if (i === 0) {
        // Today not complete yet, check yesterday
        continue;
      } else {
        break;
      }
    }

    // Calculate longest streak and totals
    let prevDate: Date | null = null;
    for (const record of sortedRecords) {
      const prayerCount = Object.values(record.prayers).filter(Boolean).length;
      const amalCount = Object.values(record.amals).filter(Boolean).length;
      
      totalPrayers += prayerCount;
      totalAmals += amalCount;

      const recordDate = parseISO(record.date);
      
      if (prayerCount === 5) {
        if (!prevDate || differenceInDays(prevDate, recordDate) === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
        prevDate = recordDate;
      } else {
        tempStreak = 0;
        prevDate = null;
      }
    }

    const totalDays = records.length || 1;
    const maxPossible = totalDays * 5;
    const completionRate = Math.round((totalPrayers / maxPossible) * 100);

    return {
      currentStreak,
      longestStreak,
      totalPrayers,
      totalAmals,
      completionRate: isNaN(completionRate) ? 0 : completionRate,
    };
  }, [records, getRecordForDate]);

  const getLast365Days = useCallback((): { date: Date; level: number }[] => {
    const days: { date: Date; level: number }[] = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = subDays(today, i);
      days.push({
        date,
        level: getCompletionLevel(date),
      });
    }
    
    return days;
  }, [getCompletionLevel]);

  const getTodayStats = useCallback(() => {
    const today = new Date();
    const record = getRecordForDate(today);
    return {
      todayPrayers: Object.values(record.prayers).filter(Boolean).length,
      todayAmals: Object.values(record.amals).filter(Boolean).length,
    };
  }, [getRecordForDate]);

  const getWeekStats = useCallback(() => {
    const today = new Date();
    let weekPrayers = 0;
    let weekAmals = 0;
    
    for (let i = 0; i < 7; i++) {
      const day = subDays(today, i);
      const record = getRecordForDate(day);
      weekPrayers += Object.values(record.prayers).filter(Boolean).length;
      weekAmals += Object.values(record.amals).filter(Boolean).length;
    }
    
    return { weekPrayers, weekAmals };
  }, [getRecordForDate]);

  return {
    records,
    loading,
    getRecordForDate,
    updatePrayer,
    updateAmal,
    getCompletionLevel,
    getStats,
    getLast365Days,
    getTodayStats,
    getWeekStats,
  };
};
