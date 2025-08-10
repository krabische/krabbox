-- Complete listing table structure with all required fields
-- This script will add all missing columns to the listing table

-- Add all missing columns to listing table
ALTER TABLE listing ADD COLUMN IF NOT EXISTS host_name TEXT;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS owner_name TEXT;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS square_meters DECIMAL(10,2);
ALTER TABLE listing ADD COLUMN IF NOT EXISTS area DECIMAL(10,2);
ALTER TABLE listing ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Add category field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'carry-on';

-- Add type field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'hardside';

-- Add condition field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'excellent';

-- Add features field (as JSON array)
ALTER TABLE listing ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]';

-- Add contact number field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS contact_number TEXT;

-- Add listing type field (rent/sale)
ALTER TABLE listing ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'rent';
ALTER TABLE listing ADD COLUMN IF NOT EXISTS is_for_sale BOOLEAN DEFAULT FALSE;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS is_for_rent BOOLEAN DEFAULT TRUE;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS daily_rate DECIMAL(10,2);

-- Add weekly rate field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS weekly_rate DECIMAL(10,2);

-- Add monthly rate field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS monthly_rate DECIMAL(10,2);

-- Add security deposit field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS security_deposit DECIMAL(10,2) DEFAULT 50;

-- Add min rental days field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS min_rental_days INTEGER DEFAULT 1;

-- Add max rental days field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS max_rental_days INTEGER DEFAULT 30;

-- Add sell price field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS sell_price DECIMAL(10,2);

-- Add address field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS address TEXT;

-- Add state field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS state TEXT;

-- Add zip code field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Add rating field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0;

-- Add review count field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Add available field
ALTER TABLE listing ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS location_address TEXT;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS location_city TEXT;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS location_state TEXT;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS location_zip_code TEXT;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS size_height DECIMAL(10,2);
ALTER TABLE listing ADD COLUMN IF NOT EXISTS size_width DECIMAL(10,2);
ALTER TABLE listing ADD COLUMN IF NOT EXISTS size_depth DECIMAL(10,2);
ALTER TABLE listing ADD COLUMN IF NOT EXISTS size_unit TEXT;

-- Success message
SELECT 'All columns added successfully to listing table!' as status; 