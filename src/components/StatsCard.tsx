import { Flame, Trophy, Target, Star } from 'lucide-react';
import { TrackerStats } from '@/types/tracker';

interface StatsCardProps {
  stats: TrackerStats;
}

export const StatsCard = ({ stats }: StatsCardProps) => {
  const statItems = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: stats.currentStreak,
      suffix: 'days',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Trophy,
      label: 'Longest Streak',
      value: stats.longestStreak,
      suffix: 'days',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Target,
      label: 'Total Prayers',
      value: stats.totalPrayers,
      suffix: '',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Star,
      label: 'Completion',
      value: stats.completionRate,
      suffix: '%',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="stat-card">
            <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {item.value}
              <span className="text-sm font-normal text-muted-foreground ml-1">{item.suffix}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
          </div>
        );
      })}
    </div>
  );
};
