
-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_verifications table
CREATE TABLE IF NOT EXISTS user_verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  action_type VARCHAR(50) NOT NULL, -- 'facebook', 'instagram', 'tiktok', 'youtube', 'product_review'
  image_url TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_awarded INTEGER DEFAULT 25,
  UNIQUE(user_id, action_type)
);

-- Create user_phones table
CREATE TABLE IF NOT EXISTS user_phones (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reward_history table
CREATE TABLE IF NOT EXISTS reward_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  platform VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  value INTEGER NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for user_verifications table
CREATE POLICY "Users can view own verifications" ON user_verifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own verifications" ON user_verifications FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create RLS policies for user_phones table
CREATE POLICY "Users can view own phone" ON user_phones FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own phone" ON user_phones FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own phone" ON user_phones FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for reward_history table
CREATE POLICY "Users can view own rewards" ON reward_history FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own rewards" ON reward_history FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
