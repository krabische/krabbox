-- Check the current structure of the listing table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'listing' 
ORDER BY ordinal_position;

-- Check if there are any existing records
SELECT COUNT(*) as total_listings FROM listing;

-- Check a sample record to see what data is actually stored
SELECT * FROM listing LIMIT 1; 

-- Add missing columns to listing table
ALTER TABLE listing ADD COLUMN IF NOT EXISTS host_name TEXT;
ALTER TABLE listing ADD COLUMN IF NOT EXISTS square_meters DECIMAL(10,2);
ALTER TABLE listing ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Update existing records to set host_name based on owner_id
-- (This will be populated when new listings are created) 