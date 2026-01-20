import { format } from 'date-fns';
import { Calendar, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  selectedDate: Date;
}

export const Header = ({ selectedDate }: HeaderProps) => {
  const isToday = format(new Date(), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="text-center py-8 animate-fade-in">
      {/* Top bar with theme toggle and auth */}
      <div className="flex justify-end items-center gap-2 mb-4">
        <ThemeToggle />
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              <User className="w-4 h-4 inline mr-1" />
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAuthAction}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">লগআউট</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={handleAuthAction}
            className="gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>লগইন</span>
          </Button>
        )}
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
        <span className="font-arabic text-primary text-lg">بِسْمِ اللَّهِ</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
        আমল <span className="text-gradient-gold">ট্র্যাকার</span>
      </h1>
      <p className="text-muted-foreground text-lg mb-6">
        Track your daily prayers & good deeds
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
        <Calendar className="w-4 h-4 text-primary" />
        <span className="font-medium">
          {isToday ? 'Today, ' : ''}{format(selectedDate, 'MMMM d, yyyy')}
        </span>
      </div>

      {!user && (
        <p className="mt-4 text-sm text-muted-foreground">
          💡 লগইন করলে আপনার ডাটা সেভ থাকবে সব ডিভাইসে
        </p>
      )}
    </header>
  );
};
