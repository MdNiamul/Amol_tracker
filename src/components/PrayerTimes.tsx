import { useState, useEffect } from 'react';
import { Clock, MapPin, RefreshCw, Loader2, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PrayerTime {
  name: string;
  arabic: string;
  time: string;
}

interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export const PrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeRemaining: string } | null>(null);

  const PRAYER_NAMES: { key: keyof PrayerTimesData; name: string; arabic: string }[] = [
    { key: 'Fajr', name: 'ফজর', arabic: 'فجر' },
    { key: 'Sunrise', name: 'সূর্যোদয়', arabic: 'شروق' },
    { key: 'Dhuhr', name: 'যোহর', arabic: 'ظهر' },
    { key: 'Asr', name: 'আসর', arabic: 'عصر' },
    { key: 'Maghrib', name: 'মাগরিব', arabic: 'مغرب' },
    { key: 'Isha', name: 'ইশা', arabic: 'عشاء' },
  ];

  const getLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      // Check for saved location
      const savedLocation = localStorage.getItem('prayerTimesLocation');
      if (savedLocation) {
        resolve(JSON.parse(savedLocation));
        return;
      }

      if (!navigator.geolocation) {
        reject(new Error('আপনার ব্রাউজার লোকেশন সাপোর্ট করে না'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Try to get city name
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${locationData.latitude}&longitude=${locationData.longitude}&localityLanguage=bn`
            );
            const data = await response.json();
            locationData.city = data.city || data.locality || 'Unknown';
            locationData.country = data.countryName || 'Unknown';
          } catch {
            locationData.city = 'Unknown';
            locationData.country = 'Unknown';
          }

          localStorage.setItem('prayerTimesLocation', JSON.stringify(locationData));
          resolve(locationData);
        },
        (err) => {
          reject(new Error('লোকেশন পেতে সমস্যা হয়েছে। অনুগ্রহ করে লোকেশন পারমিশন দিন।'));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const fetchPrayerTimes = async (lat: number, lng: number) => {
    try {
      const today = new Date();
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lng}&method=1`
      );
      
      if (!response.ok) throw new Error('নামাজের সময় লোড করতে সমস্যা হয়েছে');
      
      const data = await response.json();
      const timings: PrayerTimesData = data.data.timings;

      const times: PrayerTime[] = PRAYER_NAMES.map(prayer => ({
        name: prayer.name,
        arabic: prayer.arabic,
        time: timings[prayer.key],
      }));

      setPrayerTimes(times);
      calculateNextPrayer(times);
    } catch (err) {
      setError('নামাজের সময় লোড করতে সমস্যা হয়েছে');
    }
  };

  const calculateNextPrayer = (times: PrayerTime[]) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const prayer of times) {
      if (prayer.name === 'সূর্যোদয়') continue; // Skip sunrise

      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;

      if (prayerMinutes > currentMinutes) {
        const diff = prayerMinutes - currentMinutes;
        const hoursRemaining = Math.floor(diff / 60);
        const minutesRemaining = diff % 60;
        
        setNextPrayer({
          name: prayer.name,
          timeRemaining: hoursRemaining > 0 
            ? `${hoursRemaining} ঘণ্টা ${minutesRemaining} মিনিট`
            : `${minutesRemaining} মিনিট`,
        });
        return;
      }
    }

    // If no prayer found, next is Fajr tomorrow
    const fajr = times.find(p => p.name === 'ফজর');
    if (fajr) {
      const [hours, minutes] = fajr.time.split(':').map(Number);
      const fajrMinutes = hours * 60 + minutes;
      const diff = (24 * 60 - currentMinutes) + fajrMinutes;
      const hoursRemaining = Math.floor(diff / 60);
      const minutesRemaining = diff % 60;
      
      setNextPrayer({
        name: 'ফজর',
        timeRemaining: `${hoursRemaining} ঘণ্টা ${minutesRemaining} মিনিট`,
      });
    }
  };

  const loadPrayerTimes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const loc = await getLocation();
      setLocation(loc);
      await fetchPrayerTimes(loc.latitude, loc.longitude);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = () => {
    localStorage.removeItem('prayerTimesLocation');
    loadPrayerTimes();
  };

  useEffect(() => {
    loadPrayerTimes();

    // Update next prayer every minute
    const interval = setInterval(() => {
      if (prayerTimes.length > 0) {
        calculateNextPrayer(prayerTimes);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Recalculate when prayerTimes changes
  useEffect(() => {
    if (prayerTimes.length > 0) {
      calculateNextPrayer(prayerTimes);
    }
  }, [prayerTimes]);

  const isPrayerActive = (prayerName: string) => {
    return nextPrayer?.name === prayerName;
  };

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            নামাজের সময়সূচী
          </h2>
          {location && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {location.city}, {location.country}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={refreshLocation}
          disabled={loading}
          className="h-8 w-8"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">সময়সূচী লোড হচ্ছে...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadPrayerTimes} variant="outline">
            আবার চেষ্টা করুন
          </Button>
        </div>
      ) : (
        <>
          {/* Next Prayer Banner */}
          {nextPrayer && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-muted-foreground">পরবর্তী নামাজ</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-bold text-primary">{nextPrayer.name}</span>
                <span className="text-lg font-semibold text-foreground">{nextPrayer.timeRemaining} বাকি</span>
              </div>
            </div>
          )}

          {/* Prayer Times Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {prayerTimes.map((prayer) => (
              <div
                key={prayer.name}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-300",
                  isPrayerActive(prayer.name)
                    ? "bg-primary/10 border-primary"
                    : "bg-secondary/50 border-transparent"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-arabic text-primary text-lg">{prayer.arabic}</span>
                </div>
                <p className="font-medium text-foreground">{prayer.name}</p>
                <p className="text-2xl font-bold text-primary mt-1">{prayer.time}</p>
              </div>
            ))}
          </div>

          {/* Sehri and Iftar Times */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prayerTimes.find(p => p.name === 'ফজর') && (
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-blue-500" />
                  সেহরির সময়
                </h3>
                <p className="text-2xl font-bold text-blue-500">{prayerTimes.find(p => p.name === 'ফজর')?.time}</p>
                <p className="text-xs text-muted-foreground mt-1">সেহরি শেষ হয় ফজরের আগে</p>
              </div>
            )}
            {prayerTimes.find(p => p.name === 'মাগরিব') && (
              <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Moon className="w-5 h-5 text-orange-500" />
                  ইফতারের সময়
                </h3>
                <p className="text-2xl font-bold text-orange-500">{prayerTimes.find(p => p.name === 'মাগরিব')?.time}</p>
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            * সময়সূচী আপনার লোকেশন অনুযায়ী দেখানো হয়েছে (মুসলিম ওয়ার্ল্ড লীগ পদ্ধতি)
          </p>
        </>
      )}
    </div>
  );
};
