-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create tracker_records table for prayer/amal data
CREATE TABLE public.tracker_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  prayers JSONB NOT NULL DEFAULT '{"fajr": false, "dhuhr": false, "asr": false, "maghrib": false, "isha": false}',
  amals JSONB NOT NULL DEFAULT '{"quranReading": false, "dhikr": false, "sadaqah": false, "fasting": false, "tahajjud": false, "dua": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS on tracker_records
ALTER TABLE public.tracker_records ENABLE ROW LEVEL SECURITY;

-- Tracker records policies
CREATE POLICY "Users can view their own records" 
ON public.tracker_records FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own records" 
ON public.tracker_records FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own records" 
ON public.tracker_records FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records" 
ON public.tracker_records FOR DELETE 
USING (auth.uid() = user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_tracker_records_updated_at
  BEFORE UPDATE ON public.tracker_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();