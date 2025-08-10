-- Complete listing table structure with all required fields
-- This script will add all missing columns to the listing table

-- Add all missing columns to listing table
ALTER TABLE listing ADD COLUMN IF NOT EXISTS host_name TEXT;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS square_meters DECIMAL(10,2);
ALTER TABLE listing ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

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

-- Add availability field
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE;

-- Success message
SELECT 'All columns added successfully to listing table!' as status;
