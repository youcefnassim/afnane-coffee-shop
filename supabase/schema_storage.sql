-- Storage setup for Afnane Coffee photo / video uploads
-- Run this in Supabase Dashboard → SQL Editor

-- 1) Create public bucket (safe if it already exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'afnene-media',
  'afnene-media',
  true,
  20971520,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
ON CONFLICT (id) DO UPDATE
SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2) Replace restrictive policies with public read/write on this bucket
-- (needed because admin login is client-side and may not create a Supabase Auth session)
DROP POLICY IF EXISTS "Public read afnene-media" ON storage.objects;
DROP POLICY IF EXISTS "Public upload afnene-media" ON storage.objects;
DROP POLICY IF EXISTS "Public update afnene-media" ON storage.objects;
DROP POLICY IF EXISTS "Public delete afnene-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;

CREATE POLICY "Public read afnene-media"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'afnene-media');

CREATE POLICY "Public upload afnene-media"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'afnene-media');

CREATE POLICY "Public update afnene-media"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'afnene-media')
  WITH CHECK (bucket_id = 'afnene-media');

CREATE POLICY "Public delete afnene-media"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'afnene-media');

-- 3) Allow anon writes for admin tables
-- (admin currently uses client-side login without a Supabase Auth session)
DROP POLICY IF EXISTS "Auth users can modify daily_menu" ON daily_menu;
DROP POLICY IF EXISTS "Anon can modify daily_menu" ON daily_menu;
CREATE POLICY "Anon can modify daily_menu"
  ON daily_menu FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Auth users can modify products" ON products;
DROP POLICY IF EXISTS "Anon can modify products" ON products;
CREATE POLICY "Anon can modify products"
  ON products FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Auth users can modify gallery" ON gallery;
DROP POLICY IF EXISTS "Anon can modify gallery" ON gallery;
CREATE POLICY "Anon can modify gallery"
  ON gallery FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);