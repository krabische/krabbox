# Быстрая настройка Supabase для исправления ошибок

## 🚨 СРОЧНО: Исправьте эти ошибки

### 1. Создайте Storage Bucket

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект: `majhlkvnwnsycbtpguzb`
3. Перейдите в **Storage** (в левом меню)
4. Нажмите **Create a new bucket**
5. Заполните:
   - **Name**: `listings` (точно так!)
   - **Public bucket**: ✅ Отметьте галочку
   - **File size limit**: `5MB`
   - **Allowed MIME types**: `image/*`
6. Нажмите **Create bucket**

### 2. Выполните SQL скрипт для обновления таблицы

1. В Supabase Dashboard перейдите в **SQL Editor**
2. Скопируйте и вставьте содержимое файла `update-listing-images-table.sql`
3. Нажмите **Run**

**ИЛИ** скопируйте этот код:

```sql
-- Update existing listing_images table to add missing columns
-- This script safely adds columns that might be missing

-- Add order_index column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listing_images' 
        AND column_name = 'order_index'
    ) THEN
        ALTER TABLE listing_images ADD COLUMN order_index INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listing_images' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE listing_images ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listing_images' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE listing_images ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_order ON listing_images(listing_id, order_index);

-- Enable RLS if not already enabled
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for listing_images table (if they exist)
DROP POLICY IF EXISTS "Anyone can view listing images" ON listing_images;
DROP POLICY IF EXISTS "Users can add images to their own listings" ON listing_images;
DROP POLICY IF EXISTS "Users can update images for their own listings" ON listing_images;
DROP POLICY IF EXISTS "Users can delete images from their own listings" ON listing_images;

-- Create policies for listing_images table
CREATE POLICY "Anyone can view listing images" ON listing_images
  FOR SELECT USING (true);

CREATE POLICY "Users can add images to their own listings" ON listing_images
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM listing 
      WHERE listing.id = listing_images.listing_id 
      AND listing.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update images for their own listings" ON listing_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM listing 
      WHERE listing.id = listing_images.listing_id 
      AND listing.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images from their own listings" ON listing_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM listing 
      WHERE listing.id = listing_images.listing_id 
      AND listing.owner_id = auth.uid()
    )
  );

-- Success message
SELECT 'listing_images table updated successfully!' as status;
```

3. Нажмите **Run**

### 3. Настройте Storage Policies

После создания bucket, выполните эти команды в SQL Editor:

```sql
-- Allow anyone to view images
CREATE POLICY "Anyone can view listing images" ON storage.objects
FOR SELECT USING (bucket_id = 'listings');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload listing images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'listings' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own images
CREATE POLICY "Users can update their own listing images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'listings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own listing images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'listings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## ✅ После выполнения:

1. Обновите страницу сайта
2. Попробуйте загрузить изображения снова
3. Ошибки должны исчезнуть

## 🔍 Проверка:

- В Storage должен появиться bucket `listings`
- В Database должна появиться таблица `listing_images`
- В Policies должны быть все необходимые политики 