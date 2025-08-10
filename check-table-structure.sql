-- Check the current structure of the listings table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'listings'
ORDER BY ordinal_position;

-- Check if there are any existing records
SELECT COUNT(*) as total_listings FROM listings;

-- Check a sample record to see what data is actually stored
SELECT * FROM listings LIMIT 1;

-- Add missing columns to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS host_name TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS square_meters DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Update existing records to set host_name based on owner_id
-- (This will be populated when new listings are created) 