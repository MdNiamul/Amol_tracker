import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TasbihItem {
  id: string;
  arabic: string;
  bengali: string;
  meaning: string;
  target: number;
  color: string;
}

const TASBIH_ITEMS: TasbihItem[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللهِ',
    bengali: 'সুবহানাল্লাহ',
    meaning: 'আল্লাহ পবিত্র',
    target: 33,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'alhamdulillah',
    arabic: 'اَلْحَمْدُ لِلّهِ',
    bengali: 'আলহামদুলিল্লাহ',
    meaning: 'সমস্ত প্রশংসা আল্লাহর',
    target: 33,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'allahuakbar',
    arabic: 'اَللهُ اَكْبَرْ',
    bengali: 'আল্লাহু আকবার',
    meaning: 'আল্লাহ সবচেয়ে মহান',
    target: 34,
    color: 'from-amber-500 to-orange-600',
  },
];

const STORAGE_KEY = 'tasbih_counts';

export const TasbihCounter = () => {
  const [counts, setCounts] = useState<Record<string, number>>({
    subhanallah: 0,
    alhamdulillah: 0,
    allahuakbar: 0,
  });
  const [activeItem, setActiveItem] = useState<string>('subhanallah');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastTap, setLastTap] = useState<number>(0);

  // Load counts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { counts: savedCounts, date } = JSON.parse(saved);
      // Reset if it's a new day
      const today = new Date().toDateString();
      if (date === today) {
        setCounts(savedCounts);
      }
    }
  }, []);

  // Save counts to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      counts,
      date: new Date().toDateString(),
    }));
  }, [counts]);

  const playClickSound = useCallback(() => {
    if (soundEnabled) {
      // Create a subtle click sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }, [soundEnabled]);

  const handleCount = useCallback(() => {
    const now = Date.now();
    if (now - lastTap < 100) return; // Debounce
    setLastTap(now);
    
    playClickSound();
    
    setCounts(prev => {
      const currentItem = TASBIH_ITEMS.find(item => item.id === activeItem)!;
      const newCount = prev[activeItem] + 1;
      
      // Auto-advance to next tasbih when target reached
      if (newCount === currentItem.target) {
        const currentIndex = TASBIH_ITEMS.findIndex(item => item.id === activeItem);
        if (currentIndex < TASBIH_ITEMS.length - 1) {
          setTimeout(() => setActiveItem(TASBIH_ITEMS[currentIndex + 1].id), 500);
        }
      }
      
      return { ...prev, [activeItem]: newCount };
    });
  }, [activeItem, lastTap, playClickSound]);

  const handleReset = (itemId?: string) => {
    if (itemId) {
      setCounts(prev => ({ ...prev, [itemId]: 0 }));
    } else {
      setCounts({
        subhanallah: 0,
        alhamdulillah: 0,
        allahuakbar: 0,
      });
    }
  };

  const currentItem = TASBIH_ITEMS.find(item => item.id === activeItem)!;
  const currentCount = counts[activeItem];
  const isComplete = currentCount >= currentItem.target;
  const totalCount = counts.subhanallah + counts.alhamdulillah + counts.allahuakbar;
  const totalTarget = TASBIH_ITEMS.reduce((sum, item) => sum + item.target, 0);
  const allComplete = totalCount >= totalTarget;

  return (
    <Card className="glass-card animate-fade-in overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            তাসবীহ কাউন্টার
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleReset()}
              className="h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${Math.min((totalCount / totalTarget) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {totalCount}/{totalTarget}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tasbih selector tabs */}
        <div className="grid grid-cols-3 gap-2">
          {TASBIH_ITEMS.map((item) => {
            const itemCount = counts[item.id];
            const itemComplete = itemCount >= item.target;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "relative p-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? `bg-gradient-to-br ${item.color} text-white shadow-lg scale-105` 
                    : "bg-secondary/50 hover:bg-secondary",
                  itemComplete && !isActive && "ring-2 ring-primary/50"
                )}
              >
                {itemComplete && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <p className={cn(
                  "font-arabic text-lg leading-tight",
                  isActive ? "text-white" : "text-foreground"
                )}>
                  {item.arabic}
                </p>
                <p className={cn(
                  "text-xs mt-1",
                  isActive ? "text-white/80" : "text-muted-foreground"
                )}>
                  {itemCount}/{item.target}
                </p>
              </button>
            );
          })}
        </div>

        {/* Main counter button */}
        <div className="flex flex-col items-center py-6">
          <button
            onClick={handleCount}
            disabled={allComplete}
            className={cn(
              "relative w-44 h-44 rounded-full transition-all duration-200 active:scale-95",
              "flex flex-col items-center justify-center",
              "shadow-2xl",
              allComplete 
                ? "bg-gradient-to-br from-primary to-accent cursor-default"
                : `bg-gradient-to-br ${currentItem.color} hover:shadow-3xl hover:scale-105`,
              "focus:outline-none focus:ring-4 focus:ring-primary/30"
            )}
          >
            {/* Ripple effect ring */}
            <div className={cn(
              "absolute inset-0 rounded-full border-4 border-white/20",
              "animate-pulse"
            )} />
            
            {allComplete ? (
              <>
                <Check className="w-12 h-12 text-white mb-1" />
                <span className="text-white text-lg font-medium">সম্পূর্ণ!</span>
              </>
            ) : (
              <>
                <span className="font-arabic text-3xl text-white leading-tight">
                  {currentItem.arabic}
                </span>
                <span className="text-5xl font-bold text-white mt-2">
                  {currentCount}
                </span>
                <span className="text-white/70 text-sm mt-1">
                  / {currentItem.target}
                </span>
              </>
            )}
          </button>
          
          {!allComplete && (
            <p className="mt-4 text-center text-muted-foreground text-sm">
              {currentItem.bengali} - {currentItem.meaning}
            </p>
          )}
          
          {allComplete && (
            <div className="mt-4 text-center">
              <p className="text-primary font-medium">মাশাআল্লাহ! তাসবীহ সম্পূর্ণ হয়েছে</p>
              <p className="text-muted-foreground text-sm mt-1">
                আল্লাহ আপনার আমল কবুল করুন
              </p>
            </div>
          )}
        </div>

        {/* Individual reset buttons */}
        <div className="flex justify-center gap-2">
          {TASBIH_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleReset(item.id)}
              className="text-xs"
              disabled={counts[item.id] === 0}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              {item.bengali}
            </Button>
          ))}
        </div>

        {/* Hadith about Tasbih */}
        <div className="p-3 bg-secondary/30 rounded-lg text-center">
          <p className="text-xs text-muted-foreground italic">
            "যে ব্যক্তি প্রত্যেক ফরজ নামাজের পর ৩৩ বার সুবহানাল্লাহ, ৩৩ বার আলহামদুলিল্লাহ 
            এবং ৩৪ বার আল্লাহু আকবার বলে, তার গুনাহ মাফ হয়ে যায়।"
          </p>
          <p className="text-xs text-muted-foreground mt-1">— মুসলিম</p>
        </div>
      </CardContent>
    </Card>
  );
};
