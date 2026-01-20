import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, X } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('সঠিক ইমেইল দিন'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে'),
  displayName: z.string().optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validationResult = authSchema.safeParse({ email, password, displayName });
      if (!validationResult.success) {
        const errors = validationResult.error.errors;
        toast({
          title: 'Validation Error',
          description: errors[0].message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          let message = 'লগইন করতে সমস্যা হয়েছে';
          if (error.message.includes('Invalid login credentials')) {
            message = 'ইমেইল বা পাসওয়ার্ড ভুল';
          }
          toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'স্বাগতম!',
            description: 'সফলভাবে লগইন হয়েছে',
          });
        }
      } else {
        const { error } = await signUp(email, password, displayName);
        if (error) {
          let message = 'সাইন আপ করতে সমস্যা হয়েছে';
          if (error.message.includes('already registered')) {
            message = 'এই ইমেইল দিয়ে আগেই একাউন্ট আছে';
          }
          toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'সাইন আপ সফল!',
            description: 'আপনার একাউন্ট তৈরি হয়েছে',
          });
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card relative">
        {/* Close Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4 mx-auto">
            <span className="font-arabic text-primary text-lg">بِسْمِ اللَّهِ</span>
          </div>
          <CardTitle className="text-2xl">
            আমল <span className="text-gradient-gold">ট্র্যাকার</span>
          </CardTitle>
          <CardDescription>
            {isLogin ? 'আপনার একাউন্টে লগইন করুন' : 'নতুন একাউন্ট তৈরি করুন'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="displayName">নাম (ঐচ্ছিক)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="আপনার নাম"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  অপেক্ষা করুন...
                </>
              ) : isLogin ? (
                'লগইন করুন'
              ) : (
                'সাইন আপ করুন'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? 'একাউন্ট নেই?' : 'আগে থেকে একাউন্ট আছে?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
            >
              {isLogin ? 'সাইন আপ করুন' : 'লগইন করুন'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
