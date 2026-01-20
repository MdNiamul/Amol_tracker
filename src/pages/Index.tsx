import { useState } from 'react';
import { format } from 'date-fns';
import { Header } from '@/components/Header';
import { PrayerTracker } from '@/components/PrayerTracker';
import { AmalTracker } from '@/components/AmalTracker';
import { StatsCard } from '@/components/StatsCard';
import { IslamicResources } from '@/components/IslamicResources';
import { ProgressReports } from '@/components/ProgressReports';
import { GoalSetting } from '@/components/GoalSetting';
import { TasbihCounter } from '@/components/TasbihCounter';
import { PrayerTimes } from '@/components/PrayerTimes';
import { RamadanTracker } from '@/components/RamadanTracker';
import { useTracker } from '@/hooks/useTracker';
import { PrayerName, AmalName, DayRecord } from '@/types/tracker';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { 
    records,
    getRecordForDate, 
    updatePrayer, 
    updateAmal, 
    getStats,
    getTodayStats,
    getWeekStats,
  } = useTracker();

  // Convert records array to Record<string, DayRecord> for ProgressReports
  const recordsMap = records.reduce((acc: Record<string, DayRecord>, record: DayRecord) => {
    acc[record.date] = record;
    return acc;
  }, {});

  const record = getRecordForDate(selectedDate);
  const stats = getStats();
  const todayStats = getTodayStats();
  const weekStats = getWeekStats();

  const handlePrayerToggle = (prayer: PrayerName) => {
    updatePrayer(selectedDate, prayer, !record.prayers[prayer]);
  };

  const handleAmalToggle = (amal: AmalName) => {
    updateAmal(selectedDate, amal, !record.amals[amal]);
  };

  const isToday = format(new Date(), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <Header selectedDate={selectedDate} />

        {/* Prayer Times */}
        <section className="mb-8 animate-fade-in">
          <PrayerTimes />
        </section>

        {/* Stats Overview */}
        <section className="mb-8">
          <StatsCard stats={stats} />
        </section>

        {/* Goal Setting */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <GoalSetting 
            currentStats={{
              ...todayStats,
              ...weekStats,
            }}
          />
        </section>

        {/* Progress Reports */}
        <section className="mb-8">
          <ProgressReports records={recordsMap} getRecordForDate={getRecordForDate} />
        </section>

        {/* Prayer and Amal Trackers */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <PrayerTracker prayers={record.prayers} onToggle={handlePrayerToggle} />
          <AmalTracker amals={record.amals} onToggle={handleAmalToggle} />
        </div>
 

 
        {/* Tasbih Counter */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <TasbihCounter />
        </section>

        {/* Ramadan Tracker */}
        <section className="mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <RamadanTracker />
        </section>

        {/* Date selector for editing past days */}
        {!isToday && (
          <div className="mb-4 text-center">
            <button
              onClick={() => setSelectedDate(new Date())}
              className="text-sm text-primary hover:underline"
            >
              আজকে ফিরে যান
            </button>
          </div>
        )}

        {/* Islamic Resources */}
        <section className="mb-8">
          <IslamicResources />
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-muted-foreground text-sm">
          <p className="font-arabic text-lg mb-2">رَبَّنَا تَقَبَّلْ مِنَّا</p>
          <p>May Allah accept our deeds • আল্লাহ আমাদের আমল কবুল করুন</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
