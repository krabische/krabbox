-- Включить RLS для таблицы listing
ALTER TABLE listing ENABLE ROW LEVEL SECURITY;

-- Политика для просмотра всех объявлений
CREATE POLICY "Anyone can view listings" ON listing
  FOR SELECT USING (true);

-- Политика для создания объявлений (только аутентифицированные пользователи)
CREATE POLICY "Authenticated users can create listings" ON listing
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Политика для обновления объявлений (только владелец)
CREATE POLICY "Users can update their own listings" ON listing
  FOR UPDATE USING (auth.uid() = owner_id);

-- Политика для удаления объявлений (только владелец)
CREATE POLICY "Users can delete their own listings" ON listing
  FOR DELETE USING (auth.uid() = owner_id); 

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