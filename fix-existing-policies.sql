-- Safe SQL script that handles existing policies
-- This script will drop existing policies and recreate them

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

CREATE TABLE IF NOT EXISTS listing_images (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_order ON listing_images(listing_id, order_index);

-- Enable RLS for listing_images
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;

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

-- Success message
SELECT 'All policies and tables created successfully!' as status; 