-- Enable Row Level Security on Categories Table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public read access for categories" ON categories;
DROP POLICY IF EXISTS "Auth users can modify categories" ON categories;

-- Create Policy: Anyone can read categories
CREATE POLICY "Public read access for categories"
  ON categories FOR SELECT
  USING (true);

-- Create Policy: Only authenticated users (admins) can modify categories
CREATE POLICY "Auth users can modify categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
