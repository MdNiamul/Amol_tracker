import { Check } from 'lucide-react';
import { PrayerStatus, PrayerName } from '@/types/tracker';
import { cn } from '@/lib/utils';

interface PrayerTrackerProps {
  prayers: PrayerStatus;
  onToggle: (prayer: PrayerName) => void;
}

const PRAYER_INFO: { name: PrayerName; label: string; arabic: string; time: string }[] = [
  { name: 'fajr', label: 'Fajr', arabic: 'فجر', time: 'Dawn' },
  { name: 'dhuhr', label: 'Dhuhr', arabic: 'ظهر', time: 'Midday' },
  { name: 'asr', label: 'Asr', arabic: 'عصر', time: 'Afternoon' },
  { name: 'maghrib', label: 'Maghrib', arabic: 'مغرب', time: 'Sunset' },
  { name: 'isha', label: 'Isha', arabic: 'عشاء', time: 'Night' },
];

export const PrayerTracker = ({ prayers, onToggle }: PrayerTrackerProps) => {
  const completedCount = Object.values(prayers).filter(Boolean).length;

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Daily Salah</h2>
          <p className="text-sm text-muted-foreground">৫ ওয়াক্ত নামাজ</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">{completedCount}</span>
          <span className="text-muted-foreground">/5</span>
        </div>
      </div>

      <div className="grid gap-3">
        {PRAYER_INFO.map((prayer) => (
          <button
            key={prayer.name}
            onClick={() => onToggle(prayer.name)}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl transition-all duration-300",
              "border-2",
              prayers[prayer.name]
                ? "bg-primary/10 border-primary"
                : "bg-secondary/50 border-transparent hover:border-primary/30"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "prayer-checkbox flex items-center justify-center",
                  prayers[prayer.name] && "prayer-checkbox-checked"
                )}
              >
                {prayers[prayer.name] && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{prayer.label}</span>
                  <span className="font-arabic text-primary text-lg">{prayer.arabic}</span>
                </div>
                <span className="text-xs text-muted-foreground">{prayer.time}</span>
              </div>
            </div>
            {prayers[prayer.name] && (
              <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/20 rounded-full">
                ✓ Complete
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${(completedCount / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
