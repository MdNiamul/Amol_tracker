import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, Save, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Goals {
  dailyPrayers: number;
  weeklyPrayers: number;
  dailyAmals: number;
  weeklyAmals: number;
}

interface GoalSettingProps {
  currentStats: {
    todayPrayers: number;
    weekPrayers: number;
    todayAmals: number;
    weekAmals: number;
  };
}

export const GoalSetting = ({ currentStats }: GoalSettingProps) => {
  const [goals, setGoals] = useState<Goals>({
    dailyPrayers: 5,
    weeklyPrayers: 35,
    dailyAmals: 3,
    weeklyAmals: 21,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedGoals = localStorage.getItem('prayer-goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('prayer-goals', JSON.stringify(goals));
    setIsEditing(false);
    toast.success('টার্গেট সেভ হয়েছে!');
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const ProgressBar = ({ current, goal, label }: { current: number; goal: number; label: string }) => {
    const progress = calculateProgress(current, goal);
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium">{current}/{goal}</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              progress >= 100 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          টার্গেট সেটিং
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? <Save className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1" />}
          {isEditing ? 'সেভ করুন' : 'এডিট করুন'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyPrayers">দৈনিক নামাজ টার্গেট</Label>
              <Input
                id="dailyPrayers"
                type="number"
                min="1"
                max="5"
                value={goals.dailyPrayers}
                onChange={(e) => setGoals({ ...goals, dailyPrayers: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeklyPrayers">সাপ্তাহিক নামাজ টার্গেট</Label>
              <Input
                id="weeklyPrayers"
                type="number"
                min="1"
                max="35"
                value={goals.weeklyPrayers}
                onChange={(e) => setGoals({ ...goals, weeklyPrayers: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyAmals">দৈনিক আমল টার্গেট</Label>
              <Input
                id="dailyAmals"
                type="number"
                min="1"
                max="5"
                value={goals.dailyAmals}
                onChange={(e) => setGoals({ ...goals, dailyAmals: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weeklyAmals">সাপ্তাহিক আমল টার্গেট</Label>
              <Input
                id="weeklyAmals"
                type="number"
                min="1"
                max="35"
                value={goals.weeklyAmals}
                onChange={(e) => setGoals({ ...goals, weeklyAmals: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground">দৈনিক অগ্রগতি</h4>
                <ProgressBar 
                  current={currentStats.todayPrayers} 
                  goal={goals.dailyPrayers} 
                  label="নামাজ" 
                />
                <ProgressBar 
                  current={currentStats.todayAmals} 
                  goal={goals.dailyAmals} 
                  label="আমল" 
                />
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground">সাপ্তাহিক অগ্রগতি</h4>
                <ProgressBar 
                  current={currentStats.weekPrayers} 
                  goal={goals.weeklyPrayers} 
                  label="নামাজ" 
                />
                <ProgressBar 
                  current={currentStats.weekAmals} 
                  goal={goals.weeklyAmals} 
                  label="আমল" 
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
