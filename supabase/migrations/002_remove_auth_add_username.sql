-- Migration to remove auth dependencies and add username

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view content for their own profile" ON content_items;
DROP POLICY IF EXISTS "Users can insert content for their own profile" ON content_items;
DROP POLICY IF EXISTS "Users can update content for their own profile" ON content_items;
DROP POLICY IF EXISTS "Users can delete content for their own profile" ON content_items;
DROP POLICY IF EXISTS "Anyone can view published profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view content for published profiles" ON content_items;

-- Drop foreign key constraints that reference auth.users
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Add username column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);

-- Remove user_id column (we'll keep id as UUID primary key)
ALTER TABLE profiles DROP COLUMN IF EXISTS user_id;

-- Update profiles table structure
-- id is now just a UUID, not referencing auth.users
-- Set default for new rows
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- New RLS policies: allow public read of published profiles, allow all edits
-- Since there's no authentication, we allow anyone to create/edit profiles
CREATE POLICY "Anyone can view published profiles"
  ON profiles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
  ON profiles FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can view content for published profiles"
  ON content_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = content_items.profile_id
      AND profiles.is_published = true
    )
  );

CREATE POLICY "Anyone can view all content"
  ON content_items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create content"
  ON content_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update content"
  ON content_items FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete content"
  ON content_items FOR DELETE
  USING (true);

