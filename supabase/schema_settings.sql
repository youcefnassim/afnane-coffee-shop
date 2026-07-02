-- Create Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id integer PRIMARY KEY DEFAULT 1,
  shop_name text DEFAULT 'AFNENE',
  tagline text DEFAULT 'Coffee • Drink • Snack',
  phone text DEFAULT '+213 554 78 50 79',
  email text DEFAULT 'hello@afnene.com',
  address text DEFAULT 'Afnen SNACK & COFFEE, Oran, Algérie',
  whatsapp text DEFAULT '213554785079',
  instagram text DEFAULT '@afnene.snackcoffee',
  facebook text DEFAULT 'afnene.coffee',
  opening_hours text DEFAULT 'Tous les jours: 07h00 - 22h00',
  map_embed text DEFAULT 'https://maps.google.com/maps?q=35.7203394,-0.5774749&z=17&output=embed',
  primary_color text DEFAULT '#004B36',
  secondary_color text DEFAULT '#D6B370',
  currency text DEFAULT 'DA',
  updated_at timestamptz DEFAULT now()
);

-- Insert default row
INSERT INTO settings (id, shop_name, tagline, phone, email, address, whatsapp, instagram, facebook, opening_hours, map_embed, primary_color, secondary_color, currency)
VALUES (1, 'AFNENE', 'Coffee • Drink • Snack', '+213 554 78 50 79', 'hello@afnene.com', 'Afnen SNACK & COFFEE, Oran, Algérie', '213554785079', '@afnene.snackcoffee', 'afnene.coffee', 'Tous les jours: 07h00 - 22h00', 'https://maps.google.com/maps?q=35.7203394,-0.5774749&z=17&output=embed', '#004B36', '#D6B370', 'DA')
ON CONFLICT (id) DO NOTHING;

-- RLS Configuration
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read settings" ON settings;
DROP POLICY IF EXISTS "Auth update settings" ON settings;

CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Auth update settings" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
