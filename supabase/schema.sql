-- Create Products Table
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id text NOT NULL,
  name jsonb NOT NULL,
  description jsonb NOT NULL,
  ingredients jsonb NOT NULL,
  price numeric NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url text NOT NULL,
  available boolean DEFAULT true,
  best_seller boolean DEFAULT false,
  featured boolean DEFAULT false,
  promotion boolean DEFAULT false,
  calories integer,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create Daily Menu Table
CREATE TABLE daily_menu (
  id integer PRIMARY KEY DEFAULT 1,
  title text DEFAULT 'Menu du jour',
  dish_name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  image_url text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Create Gallery Table
CREATE TABLE gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  category text NOT NULL,
  url text NOT NULL,
  caption text,
  color text,
  created_at timestamptz DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create Policies for Products
-- Anyone can read products
CREATE POLICY "Public read access for products"
  ON products FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete products
CREATE POLICY "Auth users can modify products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Create Policies for Daily Menu
CREATE POLICY "Public read access for daily_menu"
  ON daily_menu FOR SELECT
  USING (true);

CREATE POLICY "Auth users can modify daily_menu"
  ON daily_menu FOR ALL
  USING (auth.role() = 'authenticated');

-- Create Policies for Gallery
CREATE POLICY "Public read access for gallery"
  ON gallery FOR SELECT
  USING (true);

CREATE POLICY "Auth users can modify gallery"
  ON gallery FOR ALL
  USING (auth.role() = 'authenticated');

-- Note: Don't forget to create a Storage Bucket named 'afnene-media'
-- and set it to Public in the Supabase Dashboard -> Storage.
-- Then set the Storage Policies to allow authenticated users to upload/modify, and public to read.
