import { useState, useEffect } from 'react';
import { Moon, Sun, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface RamadanDay {
  date: string;
  sehri: boolean;
  iftar: boolean;
  taraweeh: boolean;
}

const STORAGE_KEY = 'ramadan-tracker';

export const RamadanTracker = () => {
  const [currentDay, setCurrentDay] = useState<RamadanDay>({
    date: format(new Date(), 'yyyy-MM-dd'),
    sehri: false,
    iftar: false,
    taraweeh: false,
  });
  const [history, setHistory] = useState<RamadanDay[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setHistory(data.history || []);
      
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayRecord = data.history?.find((d: RamadanDay) => d.date === today);
      if (todayRecord) {
        setCurrentDay(todayRecord);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const updatedHistory = history.filter(d => d.date !== today);
    updatedHistory.push(currentDay);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ history: updatedHistory }));
  }, [currentDay]);

  const toggleItem = (item: 'sehri' | 'iftar' | 'taraweeh') => {
    setCurrentDay(prev => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const resetToday = () => {
    setCurrentDay({
      date: format(new Date(), 'yyyy-MM-dd'),
      sehri: false,
      iftar: false,
      taraweeh: false,
    });
  };

  const completedCount = [currentDay.sehri, currentDay.iftar, currentDay.taraweeh].filter(Boolean).length;

  const items = [
    {
      key: 'sehri' as const,
      name: 'সাহরি',
      arabic: 'سحور',
      icon: Moon,
      description: 'ভোর রাতে খাবার',
      time: 'ফজরের আগে',
    },
    {
      key: 'iftar' as const,
      name: 'ইফতার',
      arabic: 'إفطار',
      icon: Sun,
      description: 'রোজা ভাঙা',
      time: 'মাগরিবের সময়',
    },
    {
      key: 'taraweeh' as const,
      name: 'তারাবীহ',
      arabic: 'تراويح',
      icon: Moon,
      description: 'রাতের নামাজ',
      time: 'ইশার পর',
    },
  ];

  // Calculate stats from history
  const totalDays = history.length || 1;
  const totalSehri = history.filter(d => d.sehri).length + (currentDay.sehri ? 1 : 0);
  const totalIftar = history.filter(d => d.iftar).length + (currentDay.iftar ? 1 : 0);
  const totalTaraweeh = history.filter(d => d.taraweeh).length + (currentDay.taraweeh ? 1 : 0);

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            রমজান ট্র্যাকার
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            আজকের তারিখ: {format(new Date(), 'dd MMMM, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">{completedCount}</span>
          <span className="text-muted-foreground">/3</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetToday}
            className="h-8 w-8 ml-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Daily Items */}
      <div className="grid gap-3 mb-6">
        {items.map((item) => {
          const Icon = item.icon;
          const isCompleted = currentDay[item.key];
          
          return (
            <button
              key={item.key}
              onClick={() => toggleItem(item.key)}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl transition-all duration-300",
                "border-2",
                isCompleted
                  ? "bg-primary/10 border-primary"
                  : "bg-secondary/50 border-transparent hover:border-primary/30"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <span className="font-arabic text-primary text-lg">{item.arabic}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.description} • {item.time}</span>
                </div>
              </div>
              {isCompleted && (
                <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/20 rounded-full">
                  ✓ সম্পন্ন
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${(completedCount / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{totalSehri}</p>
          <p className="text-xs text-muted-foreground">সাহরি</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{totalIftar}</p>
          <p className="text-xs text-muted-foreground">ইফতার</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{totalTaraweeh}</p>
          <p className="text-xs text-muted-foreground">তারাবীহ</p>
        </div>
      </div>

      {/* Dua */}
      <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <p className="font-arabic text-lg text-center text-primary mb-2">
          اللَّهُمَّ إِنِّي لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
        </p>
        <p className="text-xs text-center text-muted-foreground">
          ইফতারের দোয়া: হে আল্লাহ! আমি তোমারই জন্য রোজা রেখেছি, তোমারই উপর ঈমান এনেছি এবং তোমারই রিযিক দ্বারা ইফতার করছি।
        </p>
      </div>
    </div>
  );
};
