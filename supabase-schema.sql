-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  phone_number TEXT,
  avatar_url TEXT,
  is_host BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  host_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[],
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  size JSONB NOT NULL,
  features TEXT[],
  condition TEXT NOT NULL,
  location JSONB NOT NULL,
  availability JSONB NOT NULL,
  pricing JSONB NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for listings
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view listings" ON listings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own listings" ON listings
  FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own listings" ON listings
  FOR DELETE USING (auth.uid() = host_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, '', '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_host_id ON listings(host_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email); 