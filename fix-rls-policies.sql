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