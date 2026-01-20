import { Check, Moon, BookOpen, Heart, HandCoins, Sparkles } from 'lucide-react';
import { AmalStatus, AmalName } from '@/types/tracker';
import { cn } from '@/lib/utils';

interface AmalTrackerProps {
  amals: AmalStatus;
  onToggle: (amal: AmalName) => void;
}

const AMAL_INFO: { name: AmalName; label: string; bengali: string; icon: React.ElementType }[] = [
  { name: 'tahajjud', label: 'Tahajjud', bengali: 'তাহাজ্জুদ', icon: Moon },
  { name: 'quran', label: 'Quran', bengali: 'কুরআন তিলাওয়াত', icon: BookOpen },
  { name: 'dhikr', label: 'Dhikr', bengali: 'জিকির', icon: Sparkles },
  { name: 'sadaqah', label: 'Sadaqah', bengali: 'সদকা', icon: HandCoins },
  { name: 'dua', label: 'Dua', bengali: 'দোয়া', icon: Heart },
];

export const AmalTracker = ({ amals, onToggle }: AmalTrackerProps) => {
  const completedCount = Object.values(amals).filter(Boolean).length;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Daily Amal</h2>
          <p className="text-sm text-muted-foreground">অতিরিক্ত আমল</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-accent">{completedCount}</span>
          <span className="text-muted-foreground">/5</span>
        </div>
      </div>

      <div className="grid gap-3">
        {AMAL_INFO.map((amal) => {
          const Icon = amal.icon;
          return (
            <button
              key={amal.name}
              onClick={() => onToggle(amal.name)}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl transition-all duration-300",
                "border-2",
                amals[amal.name]
                  ? "bg-accent/10 border-accent"
                  : "bg-secondary/50 border-transparent hover:border-accent/30"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                    amals[amal.name]
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground block">{amal.label}</span>
                  <span className="text-xs text-muted-foreground">{amal.bengali}</span>
                </div>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  amals[amal.name]
                    ? "bg-accent border-accent"
                    : "border-muted-foreground/30"
                )}
              >
                {amals[amal.name] && <Check className="w-4 h-4 text-accent-foreground" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
