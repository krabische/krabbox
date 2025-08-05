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

### 2. Выполните SQL скрипт для таблицы listing_images

1. В Supabase Dashboard перейдите в **SQL Editor**
2. Скопируйте и вставьте этот код:

```sql
-- Create listing_images table
CREATE TABLE IF NOT EXISTS listing_images (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listing(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_order ON listing_images(listing_id, order_index);

-- Enable Row Level Security
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;

-- Policy for viewing images (anyone can view)
CREATE POLICY "Anyone can view listing images" ON listing_images
  FOR SELECT USING (true);

-- Policy for inserting images (authenticated users can add images to their own listings)
CREATE POLICY "Users can add images to their own listings" ON listing_images
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM listing 
      WHERE listing.id = listing_images.listing_id 
      AND listing.owner_id = auth.uid()
    )
  );

-- Policy for updating images (users can update images for their own listings)
CREATE POLICY "Users can update images for their own listings" ON listing_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM listing 
      WHERE listing.id = listing_images.listing_id 
      AND listing.owner_id = auth.uid()
    )
  );

-- Policy for deleting images (users can delete images from their own listings)
CREATE POLICY "Users can delete images from their own listings" ON listing_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM listing 
      WHERE listing.id = listing_images.listing_id 
      AND listing.owner_id = auth.uid()
    )
  );
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