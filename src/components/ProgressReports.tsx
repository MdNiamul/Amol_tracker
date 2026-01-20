import { useState, useMemo } from 'react';
import { format, subDays, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, getWeek, getDay, addDays } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { DayRecord, PrayerStatus } from '@/types/tracker';
import { TrendingUp, Target, Award, Calendar, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressReportsProps {
  records: Record<string, DayRecord>;
  getRecordForDate: (date: Date) => DayRecord;
}

const PRAYER_NAMES = {
  fajr: 'ফজর',
  dhuhr: 'যোহর',
  asr: 'আসর',
  maghrib: 'মাগরিব',
  isha: 'ইশা',
};

const COLORS = ['hsl(168, 65%, 35%)', 'hsl(168, 55%, 45%)', 'hsl(168, 45%, 55%)', 'hsl(168, 35%, 65%)', 'hsl(45, 80%, 55%)'];

interface RamadanDay {
  date: string;
  sehri: boolean;
  iftar: boolean;
  taraweeh: boolean;
}

export const ProgressReports = ({ records, getRecordForDate }: ProgressReportsProps) => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  
  const today = useMemo(() => new Date(), []);
  
  const dateRange = useMemo(() => {
    if (period === 'week') {
      const start = startOfWeek(today, { weekStartsOn: 6 }); // Saturday start
      const end = endOfWeek(today, { weekStartsOn: 6 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(today);
      const end = endOfMonth(today);
      return eachDayOfInterval({ start, end });
    }
  }, [period, today]);

  // Daily prayer completion data for bar chart
  const dailyData = useMemo(() => {
    return dateRange.map(date => {
      const record = getRecordForDate(date);
      const prayerCount = Object.values(record.prayers).filter(Boolean).length;
      return {
        date: format(date, period === 'week' ? 'EEE' : 'd', { locale: bn }),
        fullDate: format(date, 'dd MMM', { locale: bn }),
        prayers: prayerCount,
        percentage: Math.round((prayerCount / 5) * 100),
      };
    });
  }, [dateRange, getRecordForDate, period]);

  // Individual prayer completion for pie chart
  const prayerBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    };
    
    dateRange.forEach(date => {
      const record = getRecordForDate(date);
      Object.entries(record.prayers).forEach(([prayer, completed]) => {
        if (completed) breakdown[prayer]++;
      });
    });

    return Object.entries(breakdown).map(([prayer, count]) => ({
      name: PRAYER_NAMES[prayer as keyof typeof PRAYER_NAMES],
      value: count,
      percentage: Math.round((count / dateRange.length) * 100),
    }));
  }, [dateRange, getRecordForDate]);

  // Weekly trend data (last 4 weeks)
  const weeklyTrend = useMemo(() => {
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(today, i * 7), { weekStartsOn: 6 });
      const weekEnd = endOfWeek(subDays(today, i * 7), { weekStartsOn: 6 });
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      let totalPrayers = 0;
      let perfectDays = 0;
      
      days.forEach(date => {
        const record = getRecordForDate(date);
        const count = Object.values(record.prayers).filter(Boolean).length;
        totalPrayers += count;
        if (count === 5) perfectDays++;
      });
      
      weeks.push({
        week: `সপ্তাহ ${4 - i}`,
        total: totalPrayers,
        perfectDays,
        average: Math.round((totalPrayers / 35) * 100),
      });
    }
    return weeks;
  }, [getRecordForDate, today]);

  // Statistics
  const stats = useMemo(() => {
    let totalPrayers = 0;
    let perfectDays = 0;
    let currentStreak = 0;
    let bestPrayer = { name: '', count: 0 };
    
    const prayerCounts: Record<string, number> = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
    
    // Calculate from recent to old for streak
    const sortedDates = [...dateRange].reverse();
    
    sortedDates.forEach((date, idx) => {
      const record = getRecordForDate(date);
      const count = Object.values(record.prayers).filter(Boolean).length;
      totalPrayers += count;
      
      if (count === 5) {
        perfectDays++;
        if (idx === currentStreak) currentStreak++;
      }
      
      Object.entries(record.prayers).forEach(([prayer, completed]) => {
        if (completed) prayerCounts[prayer]++;
      });
    });
    
    // Find best prayer
    Object.entries(prayerCounts).forEach(([prayer, count]) => {
      if (count > bestPrayer.count) {
        bestPrayer = { name: PRAYER_NAMES[prayer as keyof typeof PRAYER_NAMES], count };
      }
    });
    
    return {
      totalPrayers,
      perfectDays,
      currentStreak,
      bestPrayer: bestPrayer.name,
      completionRate: Math.round((totalPrayers / (dateRange.length * 5)) * 100),
    };
  }, [dateRange, getRecordForDate]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            প্রগ্রেস রিপোর্ট
          </CardTitle>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as 'week' | 'month')}>
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="week">সাপ্তাহিক</TabsTrigger>
              <TabsTrigger value="month">মাসিক</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <Target className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{stats.completionRate}%</p>
            <p className="text-xs text-muted-foreground">সম্পূর্ণতা</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <Award className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{stats.perfectDays}</p>
            <p className="text-xs text-muted-foreground">পারফেক্ট দিন</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{stats.totalPrayers}</p>
            <p className="text-xs text-muted-foreground">মোট নামাজ</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <TrendingUp className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.bestPrayer}</p>
            <p className="text-xs text-muted-foreground">সেরা নামাজ</p>
          </div>
        </div>

        {/* Daily Prayer Bar Chart */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            দৈনিক নামাজ ({period === 'week' ? 'এই সপ্তাহ' : 'এই মাস'})
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 5]} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                          <p className="font-medium">{data.fullDate}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.prayers}/5 নামাজ ({data.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="prayers" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Prayer Breakdown Pie Chart */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">নামাজ ব্রেকডাউন</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prayerBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {prayerBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">{data.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {data.value} দিন ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {prayerBreakdown.map((prayer, idx) => (
                <div key={prayer.name} className="flex items-center gap-1 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[idx] }}
                  />
                  <span>{prayer.name}</span>
                </div>
              ))}
            </div>
          </div>

        {/* Weekly Trend Line Chart */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">সাপ্তাহিক ট্রেন্ড</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
                            <p className="font-medium">{data.week}</p>
                            <p className="text-sm text-primary">মোট: {data.total} নামাজ</p>
                            <p className="text-sm text-accent">পারফেক্ট: {data.perfectDays} দিন</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="perfectDays" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>মোট নামাজ</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span>পারফেক্ট দিন</span>
              </div>
            </div>
          </div>
        </div>

        {/* GitHub-style Contribution Grid */}
        <ContributionGrid records={records} getRecordForDate={getRecordForDate} />
        
        {/* Ramadan Contribution Grid */}
        <RamadanContributionGrid />
      </CardContent>
    </Card>
  );
};

// GitHub-style Contribution Grid Component
const ContributionGrid = ({ records, getRecordForDate }: ProgressReportsProps) => {
  const today = useMemo(() => new Date(), []);
  const startDate = subDays(today, 365);
  
  // Generate weeks for the last 365 days
  const weeks = useMemo(() => {
    const start = startOfWeek(startDate, { weekStartsOn: 0 });
    const end = endOfWeek(today, { weekStartsOn: 0 });
    
    const allWeeks: { weekStart: Date; days: Date[] }[] = [];
    let currentWeekStart = start;
    
    while (currentWeekStart <= end) {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 });
      const days = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
      allWeeks.push({ weekStart: currentWeekStart, days });
      currentWeekStart = new Date(currentWeekStart);
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    
    return allWeeks;
  }, [startDate, today]);

  const getColorForDay = (date: Date): string => {
    if (date > today) return 'bg-secondary/30'; // Future days
    
    const record = getRecordForDate(date);
    const prayerCount = Object.values(record.prayers).filter(Boolean).length;
    
    if (prayerCount === 5) {
      return 'bg-blue-500'; // All 5 prayers - Blue
    } else if (prayerCount >= 4) {
      return 'bg-blue-400';
    } else if (prayerCount >= 3) {
      return 'bg-blue-300';
    } else if (prayerCount >= 1) {
      return 'bg-blue-200';
    }
    return 'bg-secondary/50'; // No prayers
  };

  const dayNames = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Grid3X3 className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium text-foreground">কন্ট্রিবিউশন গ্রাফ</h3>
        <span className="text-xs text-muted-foreground">(গত ৩৬৫ দিন)</span>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1 text-[10px] text-muted-foreground">
            {dayNames.map((day, idx) => (
              <div key={idx} className="h-3 flex items-center justify-end pr-1" style={{ minWidth: '28px' }}>
                {idx % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* Grid */}
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.days.map((day, dayIdx) => {
                const record = getRecordForDate(day);
                const prayerCount = day <= today ? Object.values(record.prayers).filter(Boolean).length : 0;
                
                return (
                  <div
                    key={dayIdx}
                    className={cn(
                      "w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer",
                      getColorForDay(day)
                    )}
                    title={`${format(day, 'dd MMM yyyy', { locale: bn })} - ${prayerCount}/5 নামাজ`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
        <span>কম</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-secondary/50" title="০ নামাজ" />
          <div className="w-3 h-3 rounded-sm bg-blue-200" title="১-২ নামাজ" />
          <div className="w-3 h-3 rounded-sm bg-blue-300" title="৩ নামাজ" />
          <div className="w-3 h-3 rounded-sm bg-blue-400" title="৪ নামাজ" />
          <div className="w-3 h-3 rounded-sm bg-blue-500" title="৫ নামাজ (সম্পূর্ণ)" />
        </div>
        <span>বেশি</span>
      </div>
    </div>
  );
};

const RamadanContributionGrid = () => {
  const today = useMemo(() => new Date(), []);
  const startDate = subDays(today, 365);
  
  // Generate weeks for the last 365 days
  const weeks = useMemo(() => {
    const start = startOfWeek(startDate, { weekStartsOn: 0 });
    const end = endOfWeek(today, { weekStartsOn: 0 });
    
    const allWeeks: { weekStart: Date; days: Date[] }[] = [];
    let currentWeekStart = start;
    
    while (currentWeekStart <= end) {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 0 });
      const days = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
      allWeeks.push({ weekStart: currentWeekStart, days });
      currentWeekStart = addDays(weekEnd, 1);
    }
    
    return allWeeks;
  }, [startDate, today]);
  
  const dayNames = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
  
  const getRamadanActivityForDate = (date: Date) => {
    const saved = localStorage.getItem('ramadan-tracker');
    if (saved) {
      const data = JSON.parse(saved);
      const dateStr = format(date, 'yyyy-MM-dd');
      const record = data.history?.find((d: RamadanDay) => d.date === dateStr);
      if (record) {
        return [record.sehri, record.iftar, record.taraweeh].filter(Boolean).length;
      }
    }
    return 0;
  };
  
  const getColorForRamadanDay = (day: Date) => {
    const activityCount = day <= today ? getRamadanActivityForDate(day) : 0;
    
    if (activityCount === 0) return 'bg-secondary/50';
    if (activityCount === 1) return 'bg-green-200';
    if (activityCount === 2) return 'bg-green-300';
    if (activityCount === 3) return 'bg-green-400';
    return 'bg-green-500';
  };
  
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Grid3X3 className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium text-foreground">রমজান কন্ট্রিবিউশন গ্রাফ</h3>
        <span className="text-xs text-muted-foreground">(গত ৩৬৫ দিন)</span>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1 text-[10px] text-muted-foreground">
            {dayNames.map((day, idx) => (
              <div key={idx} className="h-3 flex items-center justify-end pr-1" style={{ minWidth: '28px' }}>
                {idx % 2 === 1 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* Grid */}
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-1">
              {week.days.map((day, dayIdx) => {
                const activityCount = day <= today ? getRamadanActivityForDate(day) : 0;
                
                return (
                  <div
                    key={dayIdx}
                    className={cn(
                      "w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer",
                      getColorForRamadanDay(day)
                    )}
                    title={`${format(day, 'dd MMM yyyy', { locale: bn })} - ${activityCount}/3 রমজান কার্যক্রম`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
        <span>কম</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-secondary/50" title="০ কার্যক্রম" />
          <div className="w-3 h-3 rounded-sm bg-green-200" title="১ কার্যক্রম" />
          <div className="w-3 h-3 rounded-sm bg-green-300" title="২ কার্যক্রম" />
          <div className="w-3 h-3 rounded-sm bg-green-400" title="৩ কার্যক্রম (সম্পূর্ণ)" />
        </div>
        <span>বেশি</span>
      </div>
    </div>
  );
};
