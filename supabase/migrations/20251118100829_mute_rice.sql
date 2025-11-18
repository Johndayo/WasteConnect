/*
  # Create user profiles and authentication system

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `name` (text)
      - `email` (text)
      - `user_type` (enum: generator, recycler, upcycler, energy_expert)
      - `company` (text, optional)
      - `location` (text)
      - `coordinates` (point, optional)
      - `avatar_url` (text, optional)
      - `rating` (numeric, default 0)
      - `verified` (boolean, default false)
      - `description` (text, optional)
      - `website` (text, optional)
      - `phone` (text, optional)
      - `certifications` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for authenticated users to manage their own profiles
    - Add policy for public read access to verified profiles

  3. Functions
    - Trigger to create profile on user signup
    - Function to update user profile
*/

-- Create enum for user types
CREATE TYPE user_type_enum AS ENUM ('generator', 'recycler', 'upcycler', 'energy_expert');

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  user_type user_type_enum NOT NULL DEFAULT 'generator',
  company text,
  location text NOT NULL,
  coordinates point,
  avatar_url text,
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  verified boolean DEFAULT false,
  description text,
  website text,
  phone text,
  certifications text[] DEFAULT '{}',
  completed_projects integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read all verified profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (verified = true OR auth.uid() = id);

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, name, email, user_type, location)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type_enum, 'generator'),
    COALESCE(NEW.raw_user_meta_data->>'location', 'Location not specified')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();