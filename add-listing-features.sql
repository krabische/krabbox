-- Add missing columns to listings table for new features
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS area DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS contact_number TEXT;

-- Add missing pricing columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS daily_rate DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS weekly_rate DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS monthly_rate DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS security_deposit DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS sell_price DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_for_sale BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_for_rent BOOLEAN DEFAULT TRUE;

-- Add missing availability columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS min_rental_days INTEGER DEFAULT 1;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS max_rental_days INTEGER DEFAULT 365;

-- Add missing location columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS location_address TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS location_city TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS location_state TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS location_zip_code TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS location_coordinates JSONB;

-- Add missing size columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS size_height DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS size_width DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS size_depth DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS size_unit TEXT DEFAULT 'cm';

-- Add missing other columns
ALTER TABLE listings ADD COLUMN IF NOT EXISTS condition TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS host_name TEXT;

-- Update RLS policies to exclude archived listings from public view
DROP POLICY IF EXISTS "Anyone can view available listings" ON listings;
CREATE POLICY "Anyone can view available listings" ON listings
  FOR SELECT USING (is_available = TRUE AND is_archived = FALSE);

-- Allow hosts to view their archived listings
DROP POLICY IF EXISTS "Hosts can view their own listings" ON listings;
CREATE POLICY "Hosts can view their own listings" ON listings
  FOR SELECT USING (auth.uid() = host_id);

CREATE OR REPLACE FUNCTION archive_listing(listing_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE listings
  SET is_archived = TRUE,
      archived_at = NOW(),
      is_available = FALSE
  WHERE id = listing_id AND host_id = auth.uid();

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION unarchive_listing(listing_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE listings
  SET is_archived = FALSE,
      archived_at = NULL,
      is_available = TRUE
  WHERE id = listing_id AND host_id = auth.uid();

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
