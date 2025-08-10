-- Complete setup script that safely handles all existing policies
-- This script will drop all existing policies and recreate them

-- Drop existing policies for listings table (if they exist)
DROP POLICY IF EXISTS "Anyone can view listings" ON listings;
DROP POLICY IF EXISTS "Authenticated users can create listings" ON listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON listings;

-- Drop existing policies for listing_images table (if they exist)
DROP POLICY IF EXISTS "Anyone can view listing images" ON listing_images;
DROP POLICY IF EXISTS "Users can add images to their own listings" ON listing_images;
DROP POLICY IF EXISTS "Users can update images for their own listings" ON listing_images;
DROP POLICY IF EXISTS "Users can delete images from their own listings" ON listing_images;

-- Drop existing policies for storage.objects (if they exist)
DROP POLICY IF EXISTS "Anyone can view listing images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own listing images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own listing images" ON storage.objects;

-- Create policies for listings table
CREATE POLICY "Anyone can view listings" ON listings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own listings" ON listings
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own listings" ON listings
  FOR DELETE USING (auth.uid() = owner_id);

-- Create policies for listing_images table
CREATE POLICY "Anyone can view listing images" ON listing_images
  FOR SELECT USING (true);

CREATE POLICY "Users can add images to their own listings" ON listing_images
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_images.listing_id
      AND listings.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update images for their own listings" ON listing_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_images.listing_id
      AND listings.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images from their own listings" ON listing_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_images.listing_id
      AND listings.owner_id = auth.uid()
    )
  );

-- Create policies for storage.objects
CREATE POLICY "Anyone can view listing images" ON storage.objects
  FOR SELECT USING (bucket_id = 'listings');

CREATE POLICY "Authenticated users can upload listing images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'listings' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own listing images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'listings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own listing images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'listings' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add missing columns to listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS host_name TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS square_meters DECIMAL(10,2);
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- Success message
SELECT 'All policies created successfully!' as status; 